from phi.agent import Agent, RunResponse
from phi.model.google import Gemini
import os
import yfinance as yf
from dotenv import load_dotenv

load_dotenv()

class ResponseAgent:

    def __init__(self):
        self.agent = Agent(
            model=Gemini(id="gemini-2.0-flash-exp", api_key=os.getenv("GEMINI_API_KEY"))
        )
        self.news_data = {}

    def set_portfolio(self, portfolio):
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

    def generate_response(self, query):
        prompt = (
            "You are a highly intelligent, professional, and empathetic conversational assistant designed to provide accurate, "
            "context-aware, and engaging responses. Your primary goal is to assist the client effectively while maintaining "
            "a pleasant and professional tone."
            
            f"\n\nThe client's portfolio contains the following information: {self.portfolio}."
            f"\nThe latest business news relevant to the client includes: {self.news_data}."
            
            f"\n\nThe client has asked the following question: {query}."
            
            "\n\nHere are your guidelines for generating a response:"
            "\n1. If the query is directly related to the portfolio or business news, integrate the relevant details into your response."
            "\n2. Ensure all data used is accurate and properly contextualized for the query."
            "\n3. If the query is not directly related to the provided data, respond like a general conversational assistant without "
            "referencing the portfolio or news."
            "\n4. Maintain a polite, engaging, and professional tone throughout the conversation."
            "\n5. Avoid providing false or speculative information. Only use data when it is relevant and applicable."
            "\n6. If the query is ambiguous, ask clarifying questions to better understand the client’s needs."
            "\n7. For queries unrelated to the portfolio, news, or business, handle them appropriately as a general conversational bot, "
            "focusing on being helpful and pleasant."
            "\n8. If the client asks for advice or recommendations, ensure they are actionable, practical, and backed by context where applicable."
            "\n9. Handle sensitive or personal questions with empathy and discretion, ensuring the response is respectful and appropriate."
            "\n10. If the client’s query includes humor, sarcasm, or casual remarks, respond in a way that matches the client’s tone while "
            "still being professional and pleasant."
            
            "\n\nNow, based on the provided data and query, generate a response that fulfills the client’s expectations and adheres to "
            "the above guidelines. Strive for clarity, relevance, and engagement in every response."
        )
        run: RunResponse = self.agent.run(prompt)
        return run.content