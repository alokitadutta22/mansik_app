import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mansik from "./Mansik";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Mansik />
              </ProtectedRoute>
            } 
          />
          {/* Catch-all: redirect unknown paths to landing */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

