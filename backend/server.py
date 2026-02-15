from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
import uuid
from datetime import datetime, timezone
import httpx


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Telegram configuration
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_CHAT_IDS = os.environ.get('TELEGRAM_CHAT_IDS', '').split(',')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Contact Form Model
class ContactFormCreate(BaseModel):
    name: str
    phone: str
    message: Optional[str] = None

class ContactForm(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    message: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


# Telegram helper function
async def send_telegram_message(text: str):
    """Send message to all configured Telegram chats"""
    if not TELEGRAM_BOT_TOKEN:
        logger.error("Telegram bot token not configured")
        return False
    
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    success = True
    
    async with httpx.AsyncClient() as client:
        for chat_id in TELEGRAM_CHAT_IDS:
            chat_id = chat_id.strip()
            if not chat_id:
                continue
            try:
                response = await client.post(url, json={
                    "chat_id": chat_id,
                    "text": text,
                    "parse_mode": "HTML"
                })
                if response.status_code != 200:
                    logger.error(f"Failed to send Telegram message to {chat_id}: {response.text}")
                    success = False
                else:
                    logger.info(f"Telegram message sent to {chat_id}")
            except Exception as e:
                logger.error(f"Error sending Telegram message to {chat_id}: {e}")
                success = False
    
    return success


@api_router.post("/contact", response_model=ContactForm)
async def submit_contact_form(form_data: ContactFormCreate):
    """Submit contact form and send notification to Telegram (without database)"""
    try:
        # Create contact form object (for response)
        contact = ContactForm(**form_data.model_dump())
        
        # Format message for Telegram
        timestamp_str = datetime.now(timezone.utc).strftime("%d.%m.%Y %H:%M")
        
        telegram_message = f"""
🏋️ <b>Нова заявка з сайту!</b>

👤 <b>Ім'я:</b> {contact.name}
📞 <b>Телефон:</b> {contact.phone}
💬 <b>Повідомлення:</b> {contact.message or '—'}

🕐 <b>Час:</b> {timestamp_str} UTC
        """.strip()
        
        # Send to Telegram
        await send_telegram_message(telegram_message)
        
        logger.info(f"Contact form submitted: {contact.name}, {contact.phone}")
        return contact
        
    except Exception as e:
        logger.error(f"Error submitting contact form: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit form")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)