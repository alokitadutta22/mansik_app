import { Component } from "react";

/* ErrorBoundary — catches render-time JS errors so the whole app
   never goes blank. Shows a friendly recovery card instead.        */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Mansik ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100dvh",
            padding: "40px 24px",
            background: "linear-gradient(135deg,#fafaf8,#f5ede5)",
            fontFamily: "'Lora',Georgia,serif",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              background:
                "linear-gradient(135deg,rgba(232,200,194,.55),rgba(194,208,220,.45))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
              fontSize: 28,
            }}
          >
            🌿
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 26,
              color: "#0f2b16",
              marginBottom: 10,
            }}
          >
            A moment of stillness
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#7e8b7d",
              fontStyle: "italic",
              maxWidth: 340,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            Something unexpected happened. Take a breath — your data is safe.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              background:
                "linear-gradient(135deg,rgba(196,205,184,.9),rgba(143,160,138,.8))",
              color: "#0f2b16",
              border: "none",
              borderRadius: 40,
              padding: "12px 32px",
              fontFamily: "'Lora',serif",
              fontSize: 14,
              cursor: "pointer",
              boxShadow: "0 4px 18px rgba(100,140,80,.2)",
            }}
          >
            Return to Mansik
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
