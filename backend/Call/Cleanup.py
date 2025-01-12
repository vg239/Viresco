import os
import time
import glob

def cleanup_audio_files(max_age_minutes=5):
    """Remove audio files older than max_age_minutes"""
    while True:
        # Get all mp3 files in current directory
        audio_files = glob.glob("*.mp3")
        
        current_time = time.time()
        for file in audio_files:
            # Get file creation time
            creation_time = os.path.getctime(file)
            age_minutes = (current_time - creation_time) / 60
            
            # Remove if older than max age
            if age_minutes > max_age_minutes:
                try:
                    os.remove(file)
                    print(f"Removed old audio file: {file}")
                except Exception as e:
                    print(f"Error removing file {file}: {e}")
        
        # Sleep for a minute before next check
        time.sleep(60)