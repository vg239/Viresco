
import os
import uuid
from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

class TextToSpeech:
    def __init__(self):
        self.client = ElevenLabs(
            api_key=ELEVENLABS_API_KEY,
        )

    def text_to_speech_file(self, text: str) -> str:
        # Calling the text_to_speech conversion API with detailed parameters
        response = self.client.text_to_speech.convert(
            voice_id="EXAVITQu4vr4xnSDxMaL", # Adam pre-made voice
            output_format="mp3_22050_32",
            text=text,
            model_id="eleven_turbo_v2_5", # use the turbo model for low latency
            voice_settings=VoiceSettings(
            stability=0.0,
            similarity_boost=1.0,
            style=0.0,
            use_speaker_boost=False,
        ),
    )

        # uncomment the line below to play the audio back
        # play(response)

        # Generating a unique file name for the output MP3 file
        save_file_path = f"{uuid.uuid4()}.mp3"

        # Writing the audio to a file
        with open(save_file_path, "wb") as f:
            for chunk in response:
                if chunk:
                    f.write(chunk)

        print(f"{save_file_path}: A new audio file was saved successfully!")

        # Return the path of the saved audio file
        return save_file_path