import yfinance as yf
import json
from phi.agent import Agent, RunResponse
from phi.model.google import Gemini
import os
from dotenv import load_dotenv
import pandas as pd
from fuzzywuzzy import process  # Import fuzzywuzzy's process module

# Load environment variables
load_dotenv()

class NewsReporter:
    def __init__(self):
        self.news_data = {}
        self.agent = Agent(
            model=Gemini(id="gemini-2.0-flash-exp", api_key=os.getenv("GEMINI_API_KEY"))
        )
        self.guide = {
            "Stocks": [
                {"name": "Reliance Industries", "ticker": "RELIANCE.NS"},
                {"name": "Tata Consultancy Services", "ticker": "TCS.NS"},
                {"name": "HDFC Bank", "ticker": "HDFCBANK.NS"},
                {"name": "Infosys", "ticker": "INFY.NS"},
                {"name": "ICICI Bank", "ticker": "ICICIBANK.NS"},
                {"name": "Bharti Airtel", "ticker": "BHARTIARTL.NS"},
                {"name": "Larsen & Toubro", "ticker": "LT.NS"},
                {"name": "Axis Bank", "ticker": "AXISBANK.NS"},
                {"name": "Hindustan Unilever", "ticker": "HINDUNILVR.NS"},
                {"name": "State Bank of India", "ticker": "SBIN.NS"},
                {"name": "Maruti Suzuki", "ticker": "MARUTI.NS"},
                {"name": "Kotak Mahindra Bank", "ticker": "KOTAKBANK.NS"},
                {"name": "Wipro", "ticker": "WIPRO.NS"},
                {"name": "ITC Limited", "ticker": "ITC.NS"},
                {"name": "Asian Paints", "ticker": "ASIANPAINT.NS"},
                {"name": "Tata Steel", "ticker": "TATASTEEL.NS"},
                {"name": "UltraTech Cement", "ticker": "ULTRACEMCO.NS"},
                {"name": "Bajaj Finance", "ticker": "BAJFINANCE.NS"},
                {"name": "Tech Mahindra", "ticker": "TECHM.NS"},
                {"name": "Mahindra & Mahindra", "ticker": "M&M.NS"},
                {"name": "Sun Pharma", "ticker": "SUNPHARMA.NS"}
            ]
        }

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
        )
        run: RunResponse = self.agent.run(prompt)
        return run.content
    
    def get_news(self):
        """
        Generates a structured summary of the fetched news.
        :return: AI-generated news summary as a string.
        """
        prompt = (
            f"The following is the latest news data:\n{json.dumps(self.news_data, indent=2)}\n\n"
            "Summarize the news by structuring it clearly under each index, highlighting key points, and adding any "
            "relevant context or implications for investors."
        )
        run: RunResponse = self.agent.run(prompt)
        return run.content
    
    def get_price(self, ticker_symbol):
        """
        Fetches the current price of a stock using its ticker symbol.
        :param ticker_symbol: Stock's ticker symbol
        :return: Current stock price
        """
        stock = yf.Ticker(ticker_symbol)
        current_price_info = stock.info.get("currentPrice")
        return current_price_info
    
    def get_stock_history(self, ticker_symbol):
        """
        Fetches the historical stock data for the past 1 month.
        :param ticker_symbol: Stock's ticker symbol
        :return: Historical data in plain string format without escape characters
        """
        stock = yf.Ticker(ticker_symbol)
        data = stock.history(period="1mo")
        
        # Create a dictionary to store the history data
        history_data = {}

        # Iterate through each row to extract Date and corresponding Open, Close, High, Low
        for index, row in data.iterrows():
            history_data[str(index.date())] = {
                "Open": row["Open"],
                "Close": row["Close"],
                "High": row["High"],
                "Low": row["Low"]
            }

        # Convert dictionary to JSON string without indentation or newlines
        json_data = json.dumps(history_data, separators=(',', ':' ))
        
        # Return the plain string without escape characters (already no escape characters)
        return json_data


    def update_portfolio_prices(self):
        """
        Updates the portfolio with the current price and stock history.
        Iterates through the portfolio and fetches data from the guide.
        :return: Updated portfolio with current prices and stock history
        """
        for stock in self.portfolio["Stocks"]:
            stock_name = stock["name"]
            
            # Use fuzzy matching to find the best matching ticker
            match = process.extractOne(stock_name, [item["name"] for item in self.guide["Stocks"]])
            
            if match and match[1] >= 80:  # Only accept matches with a high similarity score
                # Get the corresponding ticker from the guide
                ticker = next(item["ticker"] for item in self.guide["Stocks"] if item["name"] == match[0])
                
                # Fetch current price and stock history
                current_price = self.get_price(ticker)
                stock["current_price"] = current_price
                
                history = self.get_stock_history(ticker)
                stock["history"] = history
            else:
                print(f"Unable to find a close match for {stock_name}.")
        
        return self.portfolio