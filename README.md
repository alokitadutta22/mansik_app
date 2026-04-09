<div align="center">

<br/>

# 🧠 MANSik
### *A gentle digital sanctuary for your mental wellness.*

[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

<br/>

> *"In the midst of movement and chaos, keep stillness inside of you."*

<br/>

MANSik is a mindful wellness application designed to help users track their emotional landscape, assess stress levels, and find balance through personalized guidance and AI companionship — a safe, unhurried space to reflect on the invisible weight we carry every day.

<br/>

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **PSS-14 Assessment** | A standardized 14-question psychometric test to measure perceived stress levels over the past month |
| 🧘 **Life Pillars (Persona)** | Map your core life pillars — Health, Habits, Relationships, Occupation, Entertainment & Liabilities — for context-aware guidance |
| 📈 **Longitudinal Insights** | Beautiful, calming charts built with Recharts to visualize your emotional journey and stress trends over time |
| 🤖 **Manas — AI Companion** | An empathetic, unhurried AI companion built to listen deeply, help you reflect, and suggest gentle coping strategies |

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- ⚛️ React 18 with Vite
- 🔀 React Router DOM (v7)
- 🎨 Tailwind CSS (v4) + Custom Animations
- 📉 Recharts for Data Visualization

</td>
<td valign="top" width="50%">

**Backend & Services**
- 🚀 Express.js (`server.js`)
- 🔐 Firebase Authentication
- 🤖 Gemini / Anthropic SDK for AI

</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js v18+** and **npm** installed.

### 📦 Installation

**1. Clone the repository**
```bash
git clone https://github.com/alokitadutta22/mansik_app.git
cd mansik_app
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the root directory:

```env
# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id

# AI Provider (pick one)
GEMINI_API_KEY=your_gemini_api_key
# or
ANTHROPIC_API_KEY=your_anthropic_api_key
```

**4. Run the application**

```bash
# Start the frontend (Vite dev server)
npm run dev

# Start the backend (Express AI proxy)
npm start
```

---

## 📁 Project Structure

```
mansik_app/
├── public/                    # Static assets (favicons, SVGs)
├── src/
│   ├── assets/                # Images and local media
│   ├── components/
│   │   ├── AuthPage.jsx       # Firebase authentication interface
│   │   ├── LandingPage.jsx    # Scroll-animated landing page
│   │   └── ProtectedRoute.jsx # Auth-guarded route wrapper
│   ├── App.jsx                # Main router configuration
│   ├── Mansik.jsx             # Core dashboard, analytics & AI chat
│   ├── firebase.js            # Firebase config & initialization
│   ├── index.css              # Global Tailwind imports
│   └── main.jsx               # React entry point
├── server.js                  # Express backend for AI/API calls
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 📜 Scripts

```bash
npm run dev       # Start Vite development server
npm start         # Start Express backend server
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # Lint with ESLint
```

---

## 🔗 Live Demo

```
https://mansik-app.vercel.app/
```


## 🤝 Contributing

Contributions to make MANSik a safer, more effective sanctuary are always welcome.

```bash
# 1. Fork the project
# 2. Create your feature branch
git checkout -b feature/YourFeature

# 3. Commit your changes
git commit -m "Add: YourFeature"

# 4. Push and open a Pull Request
git push origin feature/YourFeature
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with 💚 for mental wellness &nbsp;·&nbsp; 

</div>