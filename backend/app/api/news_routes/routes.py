from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
from ...news_recommendation_module.news import NewsReporter
from app.redis_db.redis import redis_client

router = APIRouter()

reporter = NewsReporter()
reporter.fetch_news(['^BSESN', "TCS.NS"])

class Stocks(BaseModel):
    name: str
    quantity: int
    price_bought_at: float
# will have to take the current value from the float

class Crypto(BaseModel):
    name: str
    quantity: int
    price_bought_at: float

class MutualFunds(BaseModel):
    name: str
    investment_amount: float
    mf_type: str
# will have to get the curren value from the api

class FixedDeposits(BaseModel):
    bank_name: str
    investment_amount: float
    maturity_value: float
    tenure_years: int
    interest_rate: float

class RecentTransactions(BaseModel):
    date: str
    action: str
    asset_type: str
    quantity: int
    price: float
    remarks: str

class InvestmentProfile(BaseModel):
    risk_tolerance: str
    investment_goal: str
    time_horizon: str


class PortfolioRequest(BaseModel):
    name: str
    age: int
    Investment_profile: InvestmentProfile
    Stocks: List[Stocks]
    Mutual_funds: List[MutualFunds]
    Fixed_deposits: List[FixedDeposits]
    Recent_transactions: List[RecentTransactions]
    Crypto : List[Crypto]

class NewsResponse(BaseModel):
    news: str

class RecommendationsResponse(BaseModel):
    recommendations: str

class PortfolioSubmission(BaseModel):
    wallet_address: str
    portfolio_data: Dict[str, Any]
    
class PortfolioSectionUpdate(BaseModel):
    wallet_address: str
    section: str
    section_data: List[Dict[str, Any]]

class WalletRequest(BaseModel):
    wallet_address: str

@router.post("/news")
async def news(request: WalletRequest):
    print("Received wallet address:", request.wallet_address)
    portfolio = redis_client.get_portfolio(request.wallet_address)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    reporter.set_portfolio(portfolio)
    relevant_news = reporter.get_news()
    return NewsResponse(news=relevant_news)

@router.post("/recommendations")
async def recommendations(request: WalletRequest):
    print("Received wallet address:", request.wallet_address)
    portfolio = redis_client.get_portfolio(request.wallet_address)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    reporter.set_portfolio(portfolio)
    recommendations = reporter.generate_recommendations()
    return RecommendationsResponse(recommendations=recommendations)

@router.post("/portfolio")
async def create_portfolio(portfolio: PortfolioSubmission):
    success = redis_client.set_portfolio(portfolio.wallet_address, portfolio.portfolio_data)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save portfolio")
    return {"message": "Portfolio saved successfully"}

@router.get("/portfolio/{wallet_address}")
async def get_portfolio(wallet_address: str):
    portfolio = redis_client.get_portfolio(wallet_address)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio

@router.put("/portfolio/section")
async def update_portfolio_section(update: PortfolioSectionUpdate):
    success = redis_client.update_portfolio_section(
        update.wallet_address,
        update.section,
        update.section_data
    )
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update portfolio section")
    return {"message": "Portfolio section updated successfully"}