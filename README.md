<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-3-FF6384?style=for-the-badge" />
</p>

<h1 align="center">🧠 Mansik — मानसिक</h1>
<h3 align="center">AI-Powered Mental Wellness Platform</h3>

<p align="center">
  <em>A gentle digital sanctuary for mental wellness — scientifically grounded, AI-enhanced, deeply personal.</em>
</p>

<p align="center">
  <a href="https://mansik-app.vercel.app"><strong>🌐 Live Demo</strong></a> ·
  <a href="#-features"><strong>Features</strong></a> ·
  <a href="#%EF%B8%8F-architecture"><strong>Architecture</strong></a> ·
  <a href="#-getting-started"><strong>Setup</strong></a>
</p>

---

## 🎯 The Problem

**200 million Indians** suffer from mental health disorders, yet India has only **0.75 psychiatrists per 100,000 people**. Existing solutions are either too clinical (cold questionnaires with no empathy) or too gamified (treating serious pain as a mobile game). There is no bridge between *"I'm fine"* and *"I need a therapist"*.

**Mansik lives in that gap** — a compassionate first touchpoint that assesses, tracks, converses, and guides.

---

## ✨ Features

### 🩺 PSS-14 Psychometric Assessment
- Scientifically validated **Perceived Stress Scale** (Cohen et al., 1983)
- 14 questions with 5-point Likert scale and **reverse scoring**
- Real-time severity classification: **Low** (0–19) · **Moderate** (20–37) · **High** (38–56)

### 🤖 Manas — AI Companion
- Powered by **Gemini 2.5 Flash** with custom therapeutic prompt engineering
- **Conversational memory** — full session history sent with each request
- Context-aware: injects user's name, latest PSS score, and session count into system prompt
- **Crisis detection** — keyword matching + 3-consecutive-high-score pattern detection
- Surfaces **Indian helpline numbers** (iCall, Vandrevala Foundation, NIMHANS) when risk is detected

### 📊 Longitudinal Analytics Dashboard
- **Area charts** — stress journey over time (last 8 sessions)
- **Line charts** — score timeline with threshold markers at 20 and 38
- **Radar charts** — multi-dimensional wellness profile (Consistency, Stability, Improvement, Awareness, Resilience, Engagement)
- **Severity distribution** — breakdown of Low/Moderate/High sessions
- **Trend detection** — Improving ↓ / Stable → / Escalating ↑

### 🧬 Six-Pillar Persona System
| Pillar | Sub-Agents |
|--------|-----------|
| 🌿 Health | Sleep, Fitness, Medication, Nutrition, Hydration |
| ✍️ Habit | Exercise, Journaling, Reading, Meditation, Social Media |
| 💜 Relationship | Friends, Family, Partner, Manager, Peers |
| 💼 Occupation | Student, IT Professional, Doctor, Engineer, Entrepreneur |
| 🎬 Entertainment | Movies, Traveling, Gaming, Music, Sports |
| 🌙 Liability | Financial Stress, Family Duties, Work Pressure, Health Worries, Debt |

- **Custom tags** — users can add their own sub-agents
- **localStorage persistence** — per-user, keyed by email

### 🌟 Personalized Guidance
- Recommendations **adapt to stress severity** (Low/Moderate/High)
- **Persona-driven** — tailored advice based on selected life pillars
- Crisis-level recommendations include **professional referrals and helpline numbers**

### 🔐 Authentication
- **Email/Password** with Firebase Auth
- **Google OAuth 2.0** — one-click sign-in via `signInWithPopup`
- **MFA scaffolding** — SMS-based two-factor via `PhoneAuthProvider`
- **Forgot password** flow with email reset
- **Route protection** — `onAuthStateChanged` listener gates the dashboard

### 🎨 Premium UI/UX
- **Glassmorphism** design with layered gradients and blur effects
- **Custom cursor** with trailing ring animation
- **Ambient music player** — 4 calming tracks with volume control
- **Micro-animations** — fade-up, float, breathe, drift, wave-bar, ripple
- **Typography** — Playfair Display + Lora + Caveat (Google Fonts)
- **SVG icon system** — 25+ hand-mapped path-based icons

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                        │
│                                                                     │
│  Landing ──► Auth ──► Protected Dashboard                           │
│  Page        Page     ┌─────────────────────────────────────────┐   │
│                       │  Sidebar Navigation                     │   │
│                       │  ├── My Sanctuary (Dashboard)           │   │
│                       │  ├── Assessment (PSS-14)               │   │
│                       │  ├── Insights (Analytics)              │   │
│                       │  ├── My Persona (6 Pillars)            │   │
│                       │  ├── Manas — AI (Chatbot)              │   │
│                       │  └── Guidance (Recommendations)        │   │
│                       └─────────────────────────────────────────┘   │
└─────────────┬──────────────────────┬────────────────────────────────┘
              │                      │
              ▼                      ▼
┌──────────────────────┐  ┌──────────────────────────────────────────┐
│   Firebase Auth      │  │     Express Backend (server.js)          │
│   • Email/Password   │  │     • POST /chat                        │
│   • Google OAuth     │  │     • API key secured in .env            │
│   • MFA (SMS)        │  │     • Role mapping (assistant → model)   │
│   • Password Reset   │  │     • Response normalization             │
└──────────────────────┘  └──────────────────┬───────────────────────┘
                                             │
                                             ▼
                          ┌──────────────────────────────────────────┐
                          │   Google Gemini 2.5 Flash API            │
                          │   • System instruction + conversation    │
                          │   • Therapeutic persona (Manas)          │
                          │   • 1M token context window              │
                          └──────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- A [Google Gemini API key](https://aistudio.google.com/apikey)
- A [Firebase project](https://console.firebase.google.com/) with Authentication enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/alokitadutta22/mansik_app.git
cd mansik_app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your Gemini API key

# 4. Start the Express backend (Terminal 1)
node server.js
# → Server running on http://localhost:5000

# 5. Start the React dev server (Terminal 2)
npm run dev
# → App running on http://localhost:5173
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini 2.5 Flash API key | ✅ |
| `PORT` | Express server port (default: 5000) | Optional |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite 8 | Component-based UI with fast HMR |
| **Styling** | Tailwind CSS 4 + Inline Styles | Utility-first CSS + glassmorphism design system |
| **Charts** | Recharts 3 | Area, Line, Radar charts for analytics |
| **Routing** | React Router 7 | Client-side routing with protected routes |
| **Authentication** | Firebase Auth | Email/Password, Google OAuth, MFA |
| **AI Engine** | Gemini 2.5 Flash | Conversational AI with therapeutic persona |
| **Backend** | Express 5 | API proxy to secure Gemini API key |
| **State** | React Hooks + localStorage | Session state + per-user persona persistence |

---

## 📁 Project Structure

```
mansik-app/
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── AuthPage.jsx       # Firebase Auth (login/register/MFA/forgot-password)
│   │   ├── LandingPage.jsx    # Public landing page with hero section
│   │   └── ProtectedRoute.jsx # Auth gate using onAuthStateChanged
│   ├── App.jsx                # React Router configuration
│   ├── Mansik.jsx             # Core application (3,600+ lines)
│   │   ├── Cursor              # Custom animated cursor
│   │   ├── Music               # Ambient sound player
│   │   ├── Sidebar             # Navigation with user context
│   │   ├── Dash                # Dashboard with stats + charts
│   │   ├── Assess              # PSS-14 assessment engine
│   │   ├── Anlyt               # Longitudinal analytics
│   │   ├── Pers                # Six-pillar persona system
│   │   ├── ChatV               # AI chatbot (Manas)
│   │   └── RecsV               # Personalized recommendations
│   ├── firebase.js             # Firebase configuration
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles (Tailwind)
├── server.js                   # Express backend (Gemini proxy)
├── .env.example                # Environment variable template
├── tailwind.config.js          # Tailwind CSS configuration
├── vite.config.js              # Vite build configuration
└── package.json                # Dependencies and scripts
```

---

## 🔮 Roadmap

- [ ] **Care Connect** — Nearby therapist/clinic discovery via Google Places API with geolocation
- [ ] **Firestore Integration** — Replace localStorage with cloud persistence for cross-device sync
- [ ] **Component Decomposition** — Break `Mansik.jsx` into feature-based modules
- [ ] **Corporate B2B Dashboard** — Anonymized org-level stress analytics for HR teams
- [ ] **Sliding Window Memory** — Summarization-based conversation memory for longer AI sessions
- [ ] **PWA Support** — Offline-capable progressive web app with push notifications

---

## 📄 License

This project is for educational and portfolio purposes.

---

<p align="center">
  <em>Built with 🤎 for the 200 million who deserve a gentle first step.</em>
</p>
