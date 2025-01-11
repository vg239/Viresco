import yfinance as yf
import json
from phi.agent import Agent, RunResponse
from phi.model.google import Gemini
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class NewsReporter:
    def __init__(self):
        self.news_data = {}
        self.agent = Agent(
            model=Gemini(id="gemini-2.0-flash-exp", api_key=os.getenv("GEMINI_API_KEY"))
        )

    def set_portfolio(self, portfolio):
        """
        Set the portfolio data for the user.
        :param portfolio: Portfolio data as a dictionary
        """
        self.portfolio = portfolio

    def fetch_news(self, indexes):
        """
        Fetches the latest news for a list of stock indexes.
        :param indexes: List of ticker symbols for stock indexes
        :return: News data as a JSON object
        """

        for ticker_symbol in indexes:
            try:
                ticker = yf.Ticker(ticker_symbol)
                news = ticker.news or []

                index_news = []
                for article in news:
                    try:
                        index_news.append({
                            "Title": article["content"]["title"],
                            "Summary": article["content"]["summary"],
                            "Link": article["content"]["clickThroughUrl"]["url"]
                        })
                    except KeyError:
                        continue

                if not index_news:
                    index_news.append({
                        "Title": "No news found",
                        "Summary": "",
                        "Link": ""
                    })

                self.news_data[ticker_symbol.upper()] = index_news
            except Exception as e:
                print(f"Error fetching news for {ticker_symbol.upper()}: {e}")

    def generate_recommendations(self):
        """
        Generates AI-driven recommendations based on the portfolio and news data.
        :return: AI-generated response as a string.
        """
        prompt = (
            f"Analyze the following:\n\n"
            f"News data:\n{json.dumps(self.news_data, indent=2)}\n\n"
            f"Portfolio details:\n{json.dumps(self.portfolio, indent=2)}\n\n"
            f"Considering the user's portfolio allocation and goals, how might the latest news impact their holdings? "
            f"Provide actionable insights and suggest potential strategies the user could adopt."
            "The structured news should be in the following format: \n"
            "Portfolio Optimisation: <portfolio_optimisation>\n"
            "ESG Oppurtunities: <Environmental, Social, and Governance._opportunities>\n"
            "Market Trends: <market_trends>\n"
            "Performance Analysis: <performance_analysis>\n"
            "The portfolio optimisation should contain the current risk score and diversification score."
            "The ESG oppurtunities should contain the current ESG score and the oppurtunities for improvement."
            "The market trends should contain the current market trends and the oppurtunities for improvement."
            "The performance analysis should contain the current return rate, current performance analysis and the oppurtunities for improvement."
        )
        run: RunResponse = self.agent.run(prompt)
        return run.content
    
    def get_news(self):
        """
        Generates a structured summary of the fetched news.
        :return: AI-generated news summary as a string.
        """
        prompt = (
            f"The following is the latest news: {json.dumps(self.news_data, indent=2)}. Your task is to summarize the top 6 news items overall. "
            "Follow these instructions carefully:\n\n"
            
            "1. **Summary Style**:\n"
            "   - Use professional and concise language.\n"
            "   - Highlight key points, providing sufficient detail to make the context and implications clear.\n"
            "   - Avoid vague statements or unnecessary filler words.\n"
            "   - Ensure each summary is detailed and not overly brief.\n\n"
            
            "2. **Structured Format**: Present each news item in the following format:\n"
            "   Headline: <headline>\n"
            "   Content: <detailed and elaborate summary>\n"
            "   Link: <source link>\n\n"
            
            "3. **Context & Implications**: Where applicable, include additional context to explain why the news matters, "
            "potential effects on industries, companies, or markets, and any relevant background or recent developments.\n\n"
            
            "4. **Exclusions**: Do not include:\n"
            "   - Duplicate or repetitive news items.\n"
            "   - Irrelevant information not tied to significant trends or events.\n"
            "   - Any indexing or numbering from the original data provided.\n\n"
            
            "5. **Edge Case Handling**:\n"
            "   - If fewer than 6 news items are available, summarize only the ones provided.\n"
            "   - If a link is missing, omit the 'Link' field for that specific news item.\n\n"
            
            "Carefully review the provided data and ensure your structured summary adheres to these guidelines."
        )

        run: RunResponse = self.agent.run(prompt)
        return run.content


# Example usage
if __name__ == "__main__":
    portfolio = {
        "investor": {
            "name": "Rajesh Kumar",
            "age": 34,
            "email": "rajesh.kumar@example.com",
            "contact": "+91-9876543210",
            "city": "Bangalore",
            "investment_profile": {
                "risk_tolerance": "Moderate",
                "investment_goal": "Long-term wealth creation",
                "time_horizon": "10+ years"
            }
        },
        "portfolio": {
            "stocks": [
                {
                    "symbol": "RELIANCE",
                    "name": "Reliance Industries Ltd",
                    "quantity": 50,
                    "average_buy_price": 2400.00,
                    "current_price": 2480.00,
                    "allocation_percentage": 25,
                    "sector": "Energy",
                    "investment_value": 120000.00,
                    "current_value": 124000.00
                },
                {
                    "symbol": "INFY",
                    "name": "Infosys Ltd",
                    "quantity": 30,
                    "average_buy_price": 1450.00,
                    "current_price": 1495.00,
                    "allocation_percentage": 15,
                    "sector": "Information Technology",
                    "investment_value": 43500.00,
                    "current_value": 44850.00
                },
                {
                    "symbol": "HDFCBANK",
                    "name": "HDFC Bank Ltd",
                    "quantity": 40,
                    "average_buy_price": 1600.00,
                    "current_price": 1650.00,
                    "allocation_percentage": 20,
                    "sector": "Banking",
                    "investment_value": 64000.00,
                    "current_value": 66000.00
                }
            ],
            "mutual_funds": [
                {
                    "scheme": "SBI Bluechip Fund",
                    "investment_amount": 50000.00,
                    "current_value": 54000.00,
                    "allocation_percentage": 20,
                    "type": "Equity Large Cap"
                },
                {
                    "scheme": "Axis Midcap Fund",
                    "investment_amount": 30000.00,
                    "current_value": 33000.00,
                    "allocation_percentage": 10,
                    "type": "Equity Mid Cap"
                }
            ],
            "fixed_deposits": [
                {
                    "bank_name": "State Bank of India",
                    "investment_amount": 100000.00,
                    "maturity_value": 120000.00,
                    "tenure_years": 5,
                    "interest_rate": 6.5,
                    "allocation_percentage": 10
                }
            ],
            "overall_summary": {
                "total_investment_value": 387500.00,
                "total_current_value": 411850.00,
                "total_profit_loss": 24350.00,
                "allocation": {
                    "stocks": 60,
                    "mutual_funds": 30,
                    "fixed_deposits": 10
                }
            }
        },
        "recent_activities": [
            {
                "date": "2025-01-05",
                "action": "Bought",
                "asset_type": "Stock",
                "symbol": "TCS",
                "quantity": 10,
                "price": 3500.00,
                "remarks": "Long-term investment"
            },
            {
                "date": "2025-01-02",
                "action": "Sold",
                "asset_type": "Stock",
                "symbol": "ITC",
                "quantity": 20,
                "price": 300.00,
                "remarks": "Profit booking"
            },
            {
                "date": "2024-12-28",
                "action": "Invested",
                "asset_type": "Mutual Fund",
                "scheme": "HDFC Flexi Cap Fund",
                "amount": 20000.00,
                "remarks": "Diversification"
            }
        ]
    }

    reporter = NewsReporter()
    reporter.set_portfolio(portfolio)
    reporter.fetch_news(['^BSESN', "TCS.NS"])
    
    # Generate structured news summary
    relevant_news = reporter.get_news()
    print("Structured News Summary:")
    print(relevant_news)
    
    # Generate portfolio recommendations
    recommendations = reporter.generate_recommendations()
    print("\nPortfolio Recommendations:")
    print(recommendations)