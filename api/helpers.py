from dotenv import load_dotenv
import os

def get_config() -> dict:
    load_dotenv()
    env_config = {
        "openai_key": os.getenv("OPENAI_KEY")
    }
    return env_config