# 🧠 Mansik (Sthir-Mann)
> *A gentle digital sanctuary for your mental wellness.*

Mansik is a mindful wellness application designed to help users track their emotional landscape, assess their stress levels, and find balance through gentle, personalized guidance and AI companionship. It offers a safe, unhurried space to reflect on the invisible weight we carry every day.

## ✨ Key Features

* **📊 PSS-14 Assessment:** A standardized, 14-question psychometric assessment to measure your perceived stress levels over the past month.
* **🧘🏽 Life Pillars (Persona):** Map out the core pillars of your life (Health, Habits, Relationships, Occupation, Entertainment, and Liabilities) to receive context-aware guidance.
* **📈 Longitudinal Insights:** Beautiful, calming charts built with Recharts to visualize your emotional journey and stress trends over time.
* **🤖 Manas — AI Companion:** An empathetic, unhurried AI companion built to listen deeply, help you reflect, and suggest gentle coping strategies (powered by advanced LLMs).

## 🛠️ Tech Stack

**Frontend:**
* **Framework:** React 18 with Vite
* **Routing:** React Router DOM (v7)
* **Styling:** Tailwind CSS (v4) & Custom CSS/Animations
* **Data Visualization:** Recharts

**Backend & Services:**
* **Backend:** Express.js (`server.js`)
* **Authentication:** Firebase Auth
* **AI Integration:** Gemini (via `/chat` endpoint) / Anthropic SDK

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) and npm installed on your machine.

### 📦 Installation

1. **Clone the repository:**
   git clone https://github.com/alokitadutta22/mansik_app.git
   cd mansik-app

2. **Install the dependencies**
npm install

3. **Environment Setup:**
Create a .env file in the root directory and add your Firebase and AI API keys:
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
# Add your specific AI provider keys (e.g., GEMINI_API_KEY or ANTHROPIC_API_KEY) required by your server.js

4. **Run the Application:**
To run the frontend client (Vite development server):
npm run dev

To run the backend server (which handles the /chat AI proxy):
npm start

## 📁 Project Structure
mansik_app/
├── public/                 # Static assets (Favicons, SVGs)
├── src/
│   ├── assets/             # Images and local media
│   ├── components/         # Reusable UI components
│   │   ├── AuthPage.jsx    # Firebase Authentication interface
│   │   ├── LandingPage.jsx # Beautiful scroll-animated intro
│   │   └── ProtectedRoute.jsx # Route guarding for authenticated users
│   ├── App.jsx             # Main router configuration
│   ├── Mansik.jsx          # Core Dashboard, Analytics, AI Chat & Logic
│   ├── firebase.js         # Firebase configuration and initialization
│   ├── index.css           # Global Tailwind imports
│   └── main.jsx            # React mounting point
├── server.js               # Express backend for secure API/AI calls
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
└── vite.config.js          # Vite build configuration

## 📜 Available Scripts
npm run dev - Starts the Vite development server.
npm start - Starts the Node.js Express backend server.
npm run build - Builds the app for production.
npm run preview - Locally preview the production build.
npm run lint - Lints the codebase using ESLint.

## 🤝 Contributing
Contributions to make Mansik a safer, more effective sanctuary are welcome.

1.Fork the Project
2.Create your Feature Branch (git checkout -b feature/AmazingFeature)
3.Commit your Changes (git commit -m 'Add some AmazingFeature')
4.Push to the Branch (git push origin feature/AmazingFeature)
5.Open a Pull Request

📄 License
This project is licensed under the MIT License.

"In the midst of movement and chaos, keep stillness inside of you."