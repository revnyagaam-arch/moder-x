import { useEffect, useState } from 'react'
import './App.css'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void
        initData: string
      }
    }
  }
}

type Tab = 'home' | 'games' | 'groups' | 'achievements' | 'finance' | 'profile'

type Achievement = {
  id: string
  name: string
  description: string
  progress: number
  target: number
  unlocked: boolean
}

type UserStats = {
  user: {
    id: number
    first_name: string
  }
  messages: number
  streak: number
  achievements: Achievement[]
}

const API_URL = 'http://127.0.0.1:8000'

const navigation: { id: Tab; icon: string; label: string }[] = [
  { id: 'home', icon: '⌂', label: 'Главная' },
  { id: 'games', icon: '🎮', label: 'Игры' },
  { id: 'groups', icon: '👥', label: 'Группы' },
  { id: 'achievements', icon: '🏆', label: 'Награды' },
  { id: 'finance', icon: '⭐', label: 'Финансы' },
  { id: 'profile', icon: '◉', label: 'Профиль' },
]

function HomePage({
  setActiveTab,
  stats,
}: {
  setActiveTab: (tab: Tab) => void
  stats: UserStats | null
}) {
  return (
    <div className="page-content">
      <h1>Добро пожаловать в MODER X</h1>
      <p className="page-subtitle">Твоя экосистема для Telegram</p>

      <div className="profile-card">
        <span>ТВОЙ УРОВЕНЬ</span>
        <h2>Новичок 🚀</h2>
        <p>
          {stats
            ? `Привет, ${stats.user.first_name}!`
            : 'Начни пользоваться MODER X'}
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <strong>{stats?.messages ?? 0}</strong>
          <span>Сообщения</span>
        </div>
        <div className="stat-card">
          <strong>{stats?.streak ?? 0}</strong>
          <span>Дней активности</span>
        </div>
      </div>

      <h2>Быстрый доступ</h2>
      <div className="page-list">
        <button className="list-card" onClick={() => setActiveTab('games')}>
          🎮 Игры <span className="list-arrow">›</span>
        </button>
        <button className="list-card" onClick={() => setActiveTab('groups')}>
          👥 Мои группы <span className="list-arrow">›</span>
        </button>
        <button className="list-card" onClick={() => setActiveTab('finance')}>
          ⭐ Тарифы <span className="list-arrow">›</span>
        </button>
      </div>
    </div>
  )
}

function GamesPage() {
  const games = [
    ['❌', 'Крестики-нолики', 'Соревнование с друзьями'],
    ['✊', 'Камень, ножницы, бумага', 'Классическая игра'],
    ['♟️', 'Шашки', 'Проверь свою стратегию'],
    ['🔢', 'Угадай число', 'Испытай удачу'],
    ['🧠', 'Викторина', 'Проверь знания'],
    ['⚡', 'Дуэль реакции', 'Кто быстрее?'],
  ]

  return (
    <div className="page-content">
      <h1>Игры 🎮</h1>
      <p className="page-subtitle">
        Развлечения для участников твоей группы
      </p>
      <div className="page-list">
        {games.map(([icon, name, description]) => (
          <div className="list-card" key={name}>
            <span className="list-icon">{icon}</span>
            <div className="list-info">
              <h3>{name}</h3>
              <p>{description}</p>
            </div>
            <span className="list-arrow">›</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function GroupsPage() {
  return (
    <div className="page-content">
      <h1>Мои группы 👥</h1>
      <p className="page-subtitle">
        Управляй своими Telegram-сообществами
      </p>

      <div className="empty-card">
        <div className="empty-icon">🌌</div>
        <h3>Пока нет подключённых групп</h3>
        <p>
          Добавь бота MODER X в Telegram-группу, чтобы начать управление.
        </p>
      </div>

      <h2>Возможности</h2>
      <div className="page-list">
        <div className="list-card">🛡️ Модерация</div>
        <div className="list-card">🚫 Антиспам</div>
        <div className="list-card">⚠️ Предупреждения</div>
        <div className="list-card">📊 Статистика</div>
      </div>
    </div>
  )
}

function AchievementsPage({
  stats,
}: {
  stats: UserStats | null
}) {
  const achievements = stats?.achievements ?? [
    {
      id: 'first_message',
      name: 'Первый запуск',
      description: 'Первое сообщение',
      progress: 0,
      target: 1,
      unlocked: false,
    },
    {
      id: 'social',
      name: 'Общительный',
      description: '100 сообщений в группе',
      progress: 0,
      target: 100,
      unlocked: false,
    },
    {
      id: 'streak_3',
      name: 'Начало серии',
      description: '3 дня активности подряд',
      progress: 0,
      target: 3,
      unlocked: false,
    },
    {
      id: 'streak_7',
      name: 'Неделя активности',
      description: '7 дней подряд',
      progress: 0,
      target: 7,
      unlocked: false,
    },
    {
      id: 'streak_30',
      name: 'Неостановимый',
      description: '30 дней подряд',
      progress: 0,
      target: 30,
      unlocked: false,
    },
    {
      id: 'game_first',
      name: 'Игрок',
      description: 'Сыграть первую игру',
      progress: 0,
      target: 1,
      unlocked: false,
    },
    {
      id: 'game_wins',
      name: 'Победитель',
      description: '10 побед в играх',
      progress: 0,
      target: 10,
      unlocked: false,
    },
    {
      id: 'messages_1000',
      name: 'Легенда',
      description: '1000 сообщений',
      progress: 0,
      target: 1000,
      unlocked: false,
    },
  ]

  const icons: Record<string, string> = {
    first_message: '🚀',
    social: '💬',
    streak_3: '🔥',
    streak_7: '🌟',
    streak_30: '⚡',
    game_first: '🎮',
    game_wins: '🏆',
    messages_1000: '👑',
  }

  const unlockedCount = achievements.filter(
    (item) => item.unlocked,
  ).length

  const total = achievements.length
  const percent = total
    ? Math.round((unlockedCount / total) * 100)
    : 0

  return (
    <div className="page-content">
      <div className="section-heading">
        <div>
          <h1>Достижения</h1>
          <p className="page-subtitle">Твой путь к вершине MODER X</p>
        </div>
        <div className="heading-icon">🏆</div>
      </div>

      <div className="streak-card">
        <div className="streak-glow">🔥</div>
        <div className="streak-content">
          <span>ТВОЯ АКТИВНОСТЬ</span>
          <strong>
            {stats?.streak ?? 0} <small>дней</small>
          </strong>
          <p>
            {stats?.streak
              ? 'Продолжай серию активности!'
              : 'Начни серию и зажги свой первый огонёк!'}
          </p>
        </div>
        <div className="streak-decoration">✦</div>
      </div>

      <div className="achievement-summary">
        <div>
          <span>Получено наград</span>
          <strong>
            {unlockedCount} <small>/ {total}</small>
          </strong>
        </div>
        <div className="summary-progress">
          <div
            className="summary-progress-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="summary-percent">{percent}%</span>
      </div>

      <div className="achievement-section-title">
        <h2>Коллекция наград</h2>
        <span>{total} наград</span>
      </div>

      <div className="achievement-grid">
        {achievements.map((item) => {
          const progress = Math.min(item.progress, item.target)
          const itemPercent = item.target
            ? Math.round((progress / item.target) * 100)
            : 0

          return (
            <div
              className={`achievement-tile ${
                item.unlocked ? 'earned' : 'not-earned'
              }`}
              key={item.id}
            >
              <div className="tile-top">
                <div className="tile-icon">
                  {icons[item.id] ?? '🏅'}
                </div>
                <span className="tile-status">
                  {item.unlocked ? '✓' : '🔒'}
                </span>
              </div>

              <h3>{item.name}</h3>
              <p>{item.description}</p>

              <div className="tile-progress">
                <div className="tile-progress-track">
                  <div
                    style={{ width: `${itemPercent}%` }}
                  />
                </div>
                <span>
                  {progress} / {item.target}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FinancePage() {
  return (
    <div className="page-content">
      <h1>Финансы ⭐</h1>
      <p className="page-subtitle">
        Твой баланс и возможности MODER X
      </p>

      <div className="balance-card">
        <span>ТВОЙ БАЛАНС</span>
        <strong>0 ⭐</strong>
        <p>Здесь будет отображаться баланс</p>
      </div>

      <h2>Тарифы</h2>
      <div className="page-list">
        <div className="list-card">💜 PLUS — 100 ⭐ / месяц</div>
        <div className="list-card">🚀 PRO — 300 ⭐ / месяц</div>
        <div className="list-card">🚀 PRO — 800 ⭐ / 3 месяца</div>
        <div className="list-card">🚀 PRO — 2500 ⭐ / 12 месяцев</div>
        <div className="list-card">♾️ PRO LIFETIME — 2000 ⭐</div>
      </div>
    </div>
  )
}

function ProfilePage({
  stats,
}: {
  stats: UserStats | null
}) {
  return (
    <div className="page-content">
      <h1>Профиль ◉</h1>
      <p className="page-subtitle">
        Твоя статистика и настройки
      </p>

      <div className="profile-card">
        <h2>
          {stats?.user.first_name ?? 'Пользователь MODER X'}
        </h2>
        <p>Добро пожаловать!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <strong>{stats?.messages ?? 0}</strong>
          <span>Сообщения</span>
        </div>
        <div className="stat-card">
          <strong>{stats?.streak ?? 0}</strong>
          <span>Дней активности</span>
        </div>
        <div className="stat-card">
          <strong>0</strong>
          <span>Победы</span>
        </div>
        <div className="stat-card">
          <strong>FREE</strong>
          <span>Тариф</span>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [stats, setStats] = useState<UserStats | null>(null)
  const [statsError, setStatsError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const telegramWebApp = window.Telegram?.WebApp

    telegramWebApp?.ready()

    const initData = telegramWebApp?.initData ?? ''

    if (!initData) {
      setStatsError('Открой MODER X через Telegram')
      setLoading(false)
      return
    }

    fetch(`${API_URL}/api/stats`, {
      headers: {
        Authorization: `tma ${initData}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Ошибка загрузки статистики: ${response.status}`,
          )
        }

        return response.json()
      })
      .then((data: UserStats) => {
        setStats(data)
        setStatsError('')
      })
      .catch((error: Error) => {
        setStatsError(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const pages: Record<Tab, React.ReactNode> = {
    home: (
      <HomePage
        setActiveTab={setActiveTab}
        stats={stats}
      />
    ),
    games: <GamesPage />,
    groups: <GroupsPage />,
    achievements: <AchievementsPage stats={stats} />,
    finance: <FinancePage />,
    profile: <ProfilePage stats={stats} />,
  }

  return (
    <main className="app">
      <header className="topbar">
        <div className="logo">
          MODER <span>X</span>
        </div>
        <div className="online-status">● ONLINE</div>
      </header>

      {loading && (
        <div className="page-content">
          <p className="page-subtitle">
            Загружаем данные MODER X...
          </p>
        </div>
      )}

      {!loading && statsError && (
        <div className="page-content">
          <div className="empty-card">
            <div className="empty-icon">🌌</div>
            <h3>Статистика пока недоступна</h3>
            <p>{statsError}</p>
          </div>
        </div>
      )}

      {pages[activeTab]}

      <nav className="bottom-nav">
        {navigation.map((item) => (
          <button
            key={item.id}
            className={
              activeTab === item.id
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() => setActiveTab(item.id)}
          >
            <span>{item.icon}</span>
            <small>{item.label}</small>
          </button>
        ))}
      </nav>
    </main>
  )
}

export default App