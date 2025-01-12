module portfolio_addr::finance_portfolio {
    use std::string::{Self, String};
    use std::signer;
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_token::token::{Self, TokenDataId};
    use aptos_std::table::{Self, Table};

    // Errors
    const EPORTFOLIO_EXISTS: u64 = 1;
    const EPORTFOLIO_NOT_FOUND: u64 = 2;
    const EINVALID_TOKEN_ID: u64 = 3;
    const ETOKEN_NOT_FOUND: u64 = 4;
    const EINVALID_AMOUNT: u64 = 5;
    const ENOT_AUTHORIZED: u64 = 6;

    // Constants for NFT collections
    const CARBON_NFT_COLLECTION: vector<u8> = b"Finance Portfolio Carbon NFT";
    const LESSON_NFT_COLLECTION: vector<u8> = b"Finance Portfolio Lesson NFT";

    struct Portfolio has key, store {
        ipfs_hash: String,
        person_name: String,
        carbon_credits: u64,
        lessons_completed: u64,
        is_registered: bool
    }

    struct PortfolioData has key {
        portfolios: Table<address, Portfolio>,
        carbon_nft_counter: u64,
        lesson_nft_counter: u64,
        carbon_nft_uris: Table<u64, String>,
        lesson_nft_uris: Table<u64, String>,
        // Events
        portfolio_created_events: EventHandle<PortfolioCreatedEvent>,
        portfolio_updated_events: EventHandle<PortfolioUpdatedEvent>,
        carbon_credits_events: EventHandle<CarbonCreditsEvent>,
        lesson_completed_events: EventHandle<LessonCompletedEvent>,
        nft_minted_events: EventHandle<NFTMintedEvent>,
        uri_set_events: EventHandle<URISetEvent>
    }

    // Event structures
    struct PortfolioCreatedEvent has drop, store {
        owner: address,
        person_name: String,
        ipfs_hash: String
    }

    struct PortfolioUpdatedEvent has drop, store {
        owner: address,
        new_ipfs_hash: String
    }

    struct CarbonCreditsEvent has drop, store {
        owner: address,
        amount: u64,
        new_total: u64
    }

    struct LessonCompletedEvent has drop, store {
        owner: address,
        lesson_id: u64,
        total_completed: u64
    }

    struct NFTMintedEvent has drop, store {
        owner: address,
        token_id: u64,
        is_carbon_nft: bool
    }

    struct URISetEvent has drop, store {
        token_id: u64,
        uri: String,
        is_carbon_nft: bool
    }

    public fun initialize(account: &signer) {
        let portfolio_data = PortfolioData {
            portfolios: table::new(),
            carbon_nft_counter: 1,
            lesson_nft_counter: 10000,
            carbon_nft_uris: table::new(),
            lesson_nft_uris: table::new(),
            portfolio_created_events: account::new_event_handle<PortfolioCreatedEvent>(account),
            portfolio_updated_events: account::new_event_handle<PortfolioUpdatedEvent>(account),
            carbon_credits_events: account::new_event_handle<CarbonCreditsEvent>(account),
            lesson_completed_events: account::new_event_handle<LessonCompletedEvent>(account),
            nft_minted_events: account::new_event_handle<NFTMintedEvent>(account),
            uri_set_events: account::new_event_handle<URISetEvent>(account)
        };
        move_to(account, portfolio_data);
    }

    public entry fun create_portfolio(
        account: &signer,
        ipfs_hash: String,
        person_name: String
    ) acquires PortfolioData {
        let addr = signer::address_of(account);
        let portfolio_data = borrow_global_mut<PortfolioData>(@portfolio_addr);
        
        assert!(!table::contains(&portfolio_data.portfolios, addr), EPORTFOLIO_EXISTS);

        let portfolio = Portfolio {
            ipfs_hash,
            person_name,
            carbon_credits: 0,
            lessons_completed: 0,
            is_registered: true
        };

        table::add(&mut portfolio_data.portfolios, addr, portfolio);

        event::emit_event(&mut portfolio_data.portfolio_created_events, PortfolioCreatedEvent {
            owner: addr,
            person_name,
            ipfs_hash
        });
    }

    public entry fun update_portfolio_ipfs(
        account: &signer,
        new_ipfs_hash: String
    ) acquires PortfolioData {
        let addr = signer::address_of(account);
        let portfolio_data = borrow_global_mut<PortfolioData>(@portfolio_addr);
        
        assert!(table::contains(&portfolio_data.portfolios, addr), EPORTFOLIO_NOT_FOUND);
        
        let portfolio = table::borrow_mut(&mut portfolio_data.portfolios, addr);
        portfolio.ipfs_hash = new_ipfs_hash;

        event::emit_event(&mut portfolio_data.portfolio_updated_events, PortfolioUpdatedEvent {
            owner: addr,
            new_ipfs_hash
        });
    }

    public entry fun add_carbon_credits(
        admin: &signer,
        user: address,
        amount: u64
    ) acquires PortfolioData {
        assert!(signer::address_of(admin) == @portfolio_addr, ENOT_AUTHORIZED);
        assert!(amount > 0, EINVALID_AMOUNT);

        let portfolio_data = borrow_global_mut<PortfolioData>(@portfolio_addr);
        assert!(table::contains(&portfolio_data.portfolios, user), EPORTFOLIO_NOT_FOUND);

        let portfolio = table::borrow_mut(&mut portfolio_data.portfolios, user);
        portfolio.carbon_credits = portfolio.carbon_credits + amount;

        let nft_count = portfolio.carbon_credits / 100;
        if (nft_count > 0) {
            let credits_used = nft_count * 100;
            portfolio.carbon_credits = portfolio.carbon_credits - credits_used;

            let i = 0;
            while (i < nft_count) {
                mint_carbon_nft(admin, user, portfolio_data);
                i = i + 1;
            };
        };

        event::emit_event(&mut portfolio_data.carbon_credits_events, CarbonCreditsEvent {
            owner: user,
            amount,
            new_total: portfolio.carbon_credits
        });
    }

    public entry fun complete_lesson(
        admin: &signer,
        user: address
    ) acquires PortfolioData {
        assert!(signer::address_of(admin) == @portfolio_addr, ENOT_AUTHORIZED);
        
        let portfolio_data = borrow_global_mut<PortfolioData>(@portfolio_addr);
        assert!(table::contains(&portfolio_data.portfolios, user), EPORTFOLIO_NOT_FOUND);

        let portfolio = table::borrow_mut(&mut portfolio_data.portfolios, user);
        portfolio.lessons_completed = portfolio.lessons_completed + 1;
        
        mint_lesson_nft(admin, user, portfolio_data);

        event::emit_event(&mut portfolio_data.lesson_completed_events, LessonCompletedEvent {
            owner: user,
            lesson_id: portfolio.lessons_completed,
            total_completed: portfolio.lessons_completed
        });
    }

    fun mint_carbon_nft(
        admin: &signer,
        recipient: address,
        portfolio_data: &mut PortfolioData
    ) {
        let token_id = portfolio_data.carbon_nft_counter;
        portfolio_data.carbon_nft_counter = portfolio_data.carbon_nft_counter + 1;


        event::emit_event(&mut portfolio_data.nft_minted_events, NFTMintedEvent {
            owner: recipient,
            token_id,
            is_carbon_nft: true
        });
    }

    fun mint_lesson_nft(
        admin: &signer,
        recipient: address,
        portfolio_data: &mut PortfolioData
    ) {
        let token_id = portfolio_data.lesson_nft_counter;
        portfolio_data.lesson_nft_counter = portfolio_data.lesson_nft_counter + 1;

        event::emit_event(&mut portfolio_data.nft_minted_events, NFTMintedEvent {
            owner: recipient,
            token_id,
            is_carbon_nft: false
        });
    }

    public entry fun set_carbon_nft_uri(
        admin: &signer,
        token_id: u64,
        uri: String
    ) acquires PortfolioData {
        assert!(signer::address_of(admin) == @portfolio_addr, ENOT_AUTHORIZED);
        let portfolio_data = borrow_global_mut<PortfolioData>(@portfolio_addr);
        assert!(token_id < portfolio_data.carbon_nft_counter, EINVALID_TOKEN_ID);

        table::upsert(&mut portfolio_data.carbon_nft_uris, token_id, uri);

        event::emit_event(&mut portfolio_data.uri_set_events, URISetEvent {
            token_id,
            uri,
            is_carbon_nft: true
        });
    }

    public entry fun set_lesson_nft_uri(
        admin: &signer,
        token_id: u64,
        uri: String
    ) acquires PortfolioData {
        assert!(signer::address_of(admin) == @portfolio_addr, ENOT_AUTHORIZED);
        let portfolio_data = borrow_global_mut<PortfolioData>(@portfolio_addr);
        assert!(token_id >= 10000 && token_id < portfolio_data.lesson_nft_counter, EINVALID_TOKEN_ID);

        table::upsert(&mut portfolio_data.lesson_nft_uris, token_id, uri);

        event::emit_event(&mut portfolio_data.uri_set_events, URISetEvent {
            token_id,
            uri,
            is_carbon_nft: false
        });
    }

    #[view]
    public fun get_token_uri(token_id: u64): String acquires PortfolioData {
        let portfolio_data = borrow_global<PortfolioData>(@portfolio_addr);
        
        if (token_id < 10000) {
            assert!(table::contains(&portfolio_data.carbon_nft_uris, token_id), ETOKEN_NOT_FOUND);
            *table::borrow(&portfolio_data.carbon_nft_uris, token_id)
        } else {
            assert!(table::contains(&portfolio_data.lesson_nft_uris, token_id), ETOKEN_NOT_FOUND);
            *table::borrow(&portfolio_data.lesson_nft_uris, token_id)
        }
    }
}