import hashlib
import hmac
import os
import sqlite3
import time

from pathlib import Path
from urllib.parse import parse_qsl

from fastapi import FastAPI, Header, HTTPException
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("BOT_TOKEN")
DB_PATH = Path(__file__).resolve().parent / "moder_x.db"

app = FastAPI(title="MODER X API")


def verify_telegram_data(init_data: str):
    if not TOKEN or not init_data:
        raise HTTPException(status_code=401, detail="Unauthorized")

    data = dict(parse_qsl(init_data, keep_blank_values=True))
    received_hash = data.pop("hash", None)

    if not received_hash:
        raise HTTPException(status_code=401, detail="Invalid Telegram data")

    data_check_string = "\n".join(
        f"{key}={value}" for key, value in sorted(data.items())
    )

    secret_key = hmac.new(
        b"WebAppData",
        TOKEN.encode(),
        hashlib.sha256
    ).digest()

    calculated_hash = hmac.new(
        secret_key,
        data_check_string.encode(),
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(calculated_hash, received_hash):
        raise HTTPException(status_code=401, detail="Invalid signature")

    auth_date = int(data.get("auth_date", "0"))

    if time.time() - auth_date > 86400:
        raise HTTPException(status_code=401, detail="Expired Telegram data")

    user_data = data.get("user")

    if not user_data:
        raise HTTPException(status_code=401, detail="User not found")

    import json
    return json.loads(user_data)


@app.get("/api/stats")
def get_stats(authorization: str = Header(default="")):
    if not authorization.startswith("tma "):
        raise HTTPException(status_code=401, detail="Missing Telegram data")

    user = verify_telegram_data(authorization[4:])
    user_id = user.get("id")

    with sqlite3.connect(DB_PATH) as db:
        row = db.execute(
            """
            SELECT
                COALESCE(SUM(message_count), 0),
                COALESCE(MAX(streak_days), 0)
            FROM activity
            WHERE user_id = ?
            """,
            (user_id,)
        ).fetchone()

    messages, streak = row

    achievements = [
        {
            "id": "first_message",
            "name": "Первый запуск",
            "description": "Отправить первое сообщение",
            "progress": min(messages, 1),
            "target": 1
        },
        {
            "id": "social",
            "name": "Общительный",
            "description": "100 сообщений в группах",
            "progress": min(messages, 100),
            "target": 100
        },
        {
            "id": "streak_3",
            "name": "Начало серии",
            "description": "3 дня активности подряд",
            "progress": min(streak, 3),
            "target": 3
        },
        {
            "id": "streak_7",
            "name": "Неделя активности",
            "description": "7 дней активности подряд",
            "progress": min(streak, 7),
            "target": 7
        },
        {
            "id": "streak_30",
            "name": "Неостановимый",
            "description": "30 дней активности подряд",
            "progress": min(streak, 30),
            "target": 30
        },
        {
            "id": "messages_1000",
            "name": "Легенда",
            "description": "1000 сообщений",
            "progress": min(messages, 1000),
            "target": 1000
        }
    ]

    for item in achievements:
        item["unlocked"] = item["progress"] >= item["target"]

    return {
        "user": {
            "id": user_id,
            "first_name": user.get("first_name", "")
        },
        "messages": messages,
        "streak": streak,
        "achievements": achievements
    }
