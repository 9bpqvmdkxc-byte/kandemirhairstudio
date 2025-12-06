import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("Uygulama hatası:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          maxWidth: 600,
          margin: "2rem auto",
          background: "#455a64",
          color: "#ecf0f1",
          borderRadius: 8,
          padding: "1rem",
          border: "1px solid #e74c3c"
        }}>
          <h3 style={{marginTop:0}}>Bir hata oluştu</h3>
          <pre style={{whiteSpace: 'pre-wrap'}}>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);