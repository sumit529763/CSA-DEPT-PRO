// src/components/ErrorBoundary/ErrorBoundary.jsx
import React from "react";
import "./ErrorBoundary.css";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { this.setState({ info }); console.error("ErrorBoundary caught:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding:24}}>
          <h2>Something went wrong</h2>
          <p>The app failed to render. See error details below (console also contains stack).</p>
          <details style={{whiteSpace:"pre-wrap"}}>
            <summary>Show error</summary>
            <div><strong>Error:</strong> {String(this.state.error)}</div>
            {this.state.info && <div><strong>Stack:</strong>{this.state.info.componentStack}</div>}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
