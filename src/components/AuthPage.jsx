import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthPage = () => {
  const [mode, setMode] = useState("login"); // login, register, mfa-setup, mfa-verify
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); // +1XXXXXXXXXX format
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resolver, setResolver] = useState(null); // MFA resolver
  const [verificationId, setVerificationId] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/multi-factor-auth-required") {
        setResolver(err.resolver);
        const phoneHint = err.resolver.hints[0];
        const phoneProvider = new PhoneAuthProvider(auth);
        const vId = await phoneProvider.verifyPhoneNumber(
          { multiFactorHint: phoneHint, session: err.resolver.session },
          window.recaptchaVerifier
        );
        setVerificationId(vId);
        setMode("mfa-verify");
      } else {
        setError(err.message || "Google Sign-In failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      setError(err.message || "Failed to send password reset email. Ensure the email is formatted correctly.");
    } finally {
      setLoading(false);
    }
  };

  const resendMfaCode = async () => {
    setError("");
    setLoading(true);
    try {
      if (resolver) {
        const phoneHint = resolver.hints[0];
        const provider = new PhoneAuthProvider(auth);
        const vId = await provider.verifyPhoneNumber(
          { multiFactorHint: phoneHint, session: resolver.session },
          window.recaptchaVerifier
        );
        setVerificationId(vId);
      } else {
        const user = auth.currentUser;
        const session = await multiFactor(user).getSession();
        const provider = new PhoneAuthProvider(auth);
        const vId = await provider.verifyPhoneNumber(
          { phoneNumber: phone, session },
          window.recaptchaVerifier
        );
        setVerificationId(vId);
      }
      alert("A new code has been sent.");
    } catch (err) {
      setError(err.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize standard RecaptchaVerifier for MFA operations
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
      } catch (e) {
        console.error("Recaptcha error", e);
      }
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      if (mode === "register") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // After registration, enforce MFA setup!
        setMode("mfa-setup");
      } else if (mode === "login") {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          navigate("/dashboard");
        } catch (err) {
          if (err.code === "auth/multi-factor-auth-required") {
            setResolver(err.resolver);
            // We assume phone auth is the only configured factor for simplicity
            const phoneHint = err.resolver.hints[0];
            
            // Send verification code to the registered phone
            const provider = new PhoneAuthProvider(auth);
            const vId = await provider.verifyPhoneNumber(
              { multiFactorHint: phoneHint, session: err.resolver.session },
              window.recaptchaVerifier
            );
            setVerificationId(vId);
            setMode("mfa-verify");
          } else {
            throw err;
          }
        }
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const setupMFA = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = auth.currentUser;
      const session = await multiFactor(user).getSession();
      const provider = new PhoneAuthProvider(auth);
      // Ask firebase to send an SMS
      const vId = await provider.verifyPhoneNumber(
        { phoneNumber: phone, session },
        window.recaptchaVerifier
      );
      setVerificationId(vId);
      setMode("mfa-verify"); // Now verify the code they just received
    } catch (err) {
      setError(err.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const verifyMFA = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = PhoneAuthProvider.credential(verificationId, code);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

      if (resolver) {
        // Logging in flow complete
        await resolver.resolveSignIn(multiFactorAssertion);
        navigate("/dashboard");
      } else {
        // Enrolling MFA flow complete
        const user = auth.currentUser;
        await multiFactor(user).enroll(multiFactorAssertion, "Primary Phone");
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid code or verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f7] font-['Lora',serif]">
      <div id="recaptcha-container"></div>
      
      <div className="max-w-md w-full p-8 border border-[#e2e3e1] bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-['Playfair_Display'] text-[#041b0b] font-semibold mb-2 text-center">
          {mode === "login" && "Enter Sanctuary"}
          {mode === "register" && "Begin Your Journey"}
          {mode === "mfa-setup" && "Secure Your Account"}
          {mode === "mfa-verify" && "Verify Your Identity"}
          {mode === "forgot-password" && "Reset Password"}
        </h2>
        
        <p className="text-sm text-[#737972] italic mb-6 text-center">
          {mode === "login" && "Welcome back to your quiet space."}
          {mode === "register" && "Create your sanctuary credentials."}
          {mode === "mfa-setup" && "Add a phone number for 2-Factor Authentication."}
          {mode === "mfa-verify" && "Enter the 6-digit code sent via SMS."}
          {mode === "forgot-password" && "Enter your email to receive a reset link."}
        </p>

        {error && (
          <div className="bg-[#ffdad6] text-[#93000a] p-3 text-sm rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {(mode === "login" || mode === "register") && (
          <form onSubmit={handleAuth} className="space-y-4 font-['Inter']">
            <div>
              <label className="block text-xs text-[#737972] mb-1 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl border border-[#c3c8c0] focus:ring-2 focus:ring-[#b2ceb3] outline-none transition bg-[#f9f9f7]"
                required 
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs text-[#737972] uppercase tracking-wider">Password</label>
                {mode === "login" && (
                  <button 
                    type="button" 
                    onClick={() => { setMode("forgot-password"); setError(""); setResetSent(false); }}
                    className="text-xs text-[#516600] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-[#c3c8c0] focus:ring-2 focus:ring-[#b2ceb3] outline-none transition bg-[#f9f9f7]"
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#041b0b] text-white py-3.5 rounded-full font-medium hover:bg-[#344c38] transition shadow-md disabled:opacity-50 mt-4 font-['Lora']"
            >
              {loading ? "Please wait..." : (mode === "login" ? "Enter" : "Continue")}
            </button>
            
            <div className="relative mt-6 flex items-center justify-center">
              <span className="absolute bg-white px-3 text-xs text-[#737972] z-10 font-['Inter']">OR</span>
              <div className="w-full border-t border-[#e2e3e1]"></div>
            </div>
            
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border border-[#e2e3e1] text-[#041b0b] py-3.5 rounded-full font-medium hover:bg-[#f9f9f7] transition shadow-sm disabled:opacity-50 mt-4 flex items-center justify-center gap-2 font-['Inter']"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </form>
        )}

        {mode === "forgot-password" && (
          <form onSubmit={handleForgotPassword} className="space-y-4 font-['Inter']">
            {resetSent ? (
              <div className="bg-[#e6f4ea] text-[#137333] p-4 rounded-xl text-sm text-center border border-[#bce2cc]">
                A password reset link has been sent to your email. Please check your inbox.
              </div>
            ) : (
              <div>
                <label className="block text-xs text-[#737972] mb-1 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  autoComplete="off"
                  className="w-full px-4 py-3 rounded-xl border border-[#c3c8c0] focus:ring-2 focus:ring-[#b2ceb3] outline-none transition bg-[#f9f9f7]"
                  required 
                />
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#041b0b] text-white py-3.5 rounded-full font-medium hover:bg-[#344c38] transition shadow-md disabled:opacity-50 mt-4 font-['Lora']"
            >
              {loading ? "Please wait..." : (resetSent ? "Resend Reset Link" : "Send Reset Link")}
            </button>
            
            <div className="mt-4 text-center">
              <button 
                type="button"
                onClick={() => { setMode("login"); setError(""); setResetSent(false); }}
                className="text-sm text-[#516600] font-medium hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {mode === "mfa-setup" && (
          <form onSubmit={setupMFA} className="space-y-4 font-['Inter']">
            <div>
              <label className="block text-xs text-[#737972] mb-1 uppercase tracking-wider">Phone Number (with country code)</label>
              <input 
                type="tel" 
                placeholder="+12345678900"
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#c3c8c0] focus:ring-2 focus:ring-[#b2ceb3] outline-none transition bg-[#f9f9f7]"
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#041b0b] text-white py-3.5 rounded-full font-medium hover:bg-[#344c38] transition shadow-md disabled:opacity-50 mt-4 font-['Lora']"
            >
              {loading ? "Sending SMS..." : "Send Code"}
            </button>
          </form>
        )}

        {mode === "mfa-verify" && (
          <form onSubmit={verifyMFA} className="space-y-4 font-['Inter']">
            <div>
              <label className="block text-xs text-[#737972] mb-1 uppercase tracking-wider">SMS Authentication Code</label>
              <input 
                type="text" 
                value={code} 
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#c3c8c0] focus:ring-2 focus:ring-[#b2ceb3] outline-none transition bg-[#f9f9f7] text-center text-lg tracking-widest"
                maxLength={6}
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#041b0b] text-white py-3.5 rounded-full font-medium hover:bg-[#344c38] transition shadow-md disabled:opacity-50 mt-4 font-['Lora']"
            >
              {loading ? "Verifying..." : "Verify & Enter"}
            </button>
            <div className="mt-4 text-center">
              <button 
                type="button"
                onClick={resendMfaCode}
                disabled={loading}
                className="text-sm text-[#516600] font-medium hover:underline disabled:opacity-50 disabled:no-underline"
              >
                Didn't receive the code? Resend Code
              </button>
            </div>
          </form>
        )}

        {/* Toggle Login/Register */}
        {(mode === "login" || mode === "register") && (
          <div className="mt-6 text-center text-sm font-['Inter']">
            <span className="text-[#737972]">
              {mode === "login" ? "New to Mansik?" : "Already have an account?"}
            </span>{" "}
            <button 
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[#516600] font-medium hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign In instead"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
