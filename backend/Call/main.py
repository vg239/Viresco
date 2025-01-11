import os
from dotenv import load_dotenv
from twilio.rest import Client
from flask import Flask, request, send_file
from twilio.twiml.voice_response import VoiceResponse
from ElevenLabs import TextToSpeech
from Response import ResponseAgent

# Load environment variables from .env file
load_dotenv()

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

# Initialize Flask app and TTS
app = Flask(__name__)
tts = TextToSpeech()
response_agent = ResponseAgent()
response_agent.fetch_news(['^BSESN', "TCS.NS"])
response_agent.set_portfolio(portfolio)

# Get environment variables
account_sid = os.environ["TWILIO_ACCOUNT_SID"]
auth_token = os.environ["TWILIO_AUTH_TOKEN"]
client = Client(account_sid, auth_token)

NGROK_URL = ""  # Your ngrok URL

@app.route("/start-call", methods=['GET'])
def make_call():
    call = client.calls.create(
        url=f"{NGROK_URL}/welcome",
        to="+917892799071",
        from_="+16412176555",
    )
    return str(call.sid)

@app.route("/welcome", methods=['POST'])
def welcome():
    # Generate welcome message audio
    welcome_file = tts.text_to_speech_file(
        "Hello! I'm an automated assistant. How can I help you today?"
    )
    
    response = VoiceResponse()
    response.play(f"{NGROK_URL}/audio/{welcome_file}")
    
    gather = response.gather(
        input='speech',
        timeout=5,
        speech_timeout='auto',
        language='en-US',
        action='/handle-response'
    )
    
    # Generate prompt audio
    prompt_file = tts.text_to_speech_file("Please speak after the beep.")
    gather.play(f"{NGROK_URL}/audio/{prompt_file}")
    
    return str(response)

@app.route("/handle-response", methods=['POST'])
def handle_response():
    user_speech = request.values.get('SpeechResult', '')
    
    response = VoiceResponse()
    
    response_text = response_agent.generate_response(user_speech)
    
    # Generate audio file for response
    response_file = tts.text_to_speech_file(response_text)
    response.play(f"{NGROK_URL}/audio/{response_file}")
    
    gather = response.gather(
        input='speech',
        timeout=5,
        speech_timeout='auto',
        language='en-US',
        action='/handle-response'
    )
    
    # Generate prompt audio
    prompt_file = tts.text_to_speech_file("Please speak after the beep.")
    gather.play(f"{NGROK_URL}/audio/{prompt_file}")
    
    return str(response)

# Route to serve audio files
@app.route("/audio/<filename>")
def serve_audio(filename):
    try:
        return send_file(filename, mimetype="audio/mpeg")
    except Exception as e:
        print(f"Error serving audio file: {e}")
        return str(e), 404

if __name__ == "__main__":
    app.run(debug=True)