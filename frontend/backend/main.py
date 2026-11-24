import asyncio
import os
import sqlite3
from datetime import date, timedelta
from pathlib import Path

from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart
from aiogram.types import Message
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("BOT_TOKEN")

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "moder_x.db"

bot = Bot(token=TOKEN) if TOKEN else None
dp = Dispatcher()


def init_database():
    with sqlite3.connect(DB_PATH) as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS activity (
                chat_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                username TEXT,
                first_name TEXT,
                message_count INTEGER NOT NULL DEFAULT 0,
                streak_days INTEGER NOT NULL DEFAULT 0,
                last_active_date TEXT,
                PRIMARY KEY (chat_id, user_id)
            )
        """)
        db.commit()


@dp.message(CommandStart())
async def start_handler(message: Message):
    await message.answer(
        "🚀 Добро пожаловать в MODER X!\n\n"
        "Твоя космическая панель управления.\n"
        "Скоро здесь появятся игры, модерация "
        "и множество других функций!"
    )


@dp.message(F.chat.type.in_({"group", "supergroup"}))
async def track_activity(message: Message):
    if message.from_user is None or message.from_user.is_bot:
        return

    today = date.today()
    today_str = today.isoformat()
    yesterday_str = (today - timedelta(days=1)).isoformat()

    with sqlite3.connect(DB_PATH) as db:
        row = db.execute(
            """
            SELECT streak_days, last_active_date
            FROM activity
            WHERE chat_id = ? AND user_id = ?
            """,
            (message.chat.id, message.from_user.id)
        ).fetchone()

        if row is None:
            streak = 1
        else:
            old_streak, last_date = row

            if last_date == today_str:
                streak = old_streak
            elif last_date == yesterday_str:
                streak = old_streak + 1
            else:
                streak = 1

        db.execute(
            """
            INSERT INTO activity (
                chat_id, user_id, username, first_name,
                message_count, streak_days, last_active_date
            )
            VALUES (?, ?, ?, ?, 1, ?, ?)
            ON CONFLICT(chat_id, user_id) DO UPDATE SET
                username = excluded.username,
                first_name = excluded.first_name,
                message_count = message_count + 1,
                streak_days = excluded.streak_days,
                last_active_date = excluded.last_active_date
            """,
            (
                message.chat.id,
                message.from_user.id,
                message.from_user.username,
                message.from_user.first_name,
                streak,
                today_str
            )
        )
        db.commit()


async def main():
    if not TOKEN:
        raise ValueError("Не найден BOT_TOKEN в файле .env")

    init_database()

    print("MODER X запущен!")
    print(f"База данных: {DB_PATH}")

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
