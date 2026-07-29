// Signup page — creates a new Supabase user and handles both email confirmation and instant login flows
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import { LogoIcon, MailIcon } from "../components/Icons";
import "../styles/auth.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { username: username.trim() },
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    // If session exists (Confirm Email is OFF in Supabase) -> go straight to dashboard
    if (data?.session) {
      navigate("/dashboard", { replace: true });
    } else {
      // If session is null (Confirm Email is ON in Supabase) -> show confirmation card
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <LogoIcon size={24} />
            </div>
            <span className="auth-logo-text">TrackLearn</span>
          </div>

          <div className="confirm-icon">
            <MailIcon size={52} />
          </div>
          <h1 className="auth-title">Check your email!</h1>
          <p className="auth-subtitle confirm-subtitle">
            We&apos;ve sent a confirmation link to
          </p>
          <p className="confirm-email">{email}</p>
          <p className="confirm-note">
            Click the link in the email to verify your account and start learning.
            Check your spam folder if you don&apos;t see it.
          </p>

          <p className="auth-switch" style={{ marginTop: "28px" }}>
            Already confirmed?{" "}
            <Link to="/login" id="go-to-login-after-confirm">Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <LogoIcon size={24} />
          </div>
          <span className="auth-logo-text">TrackLearn</span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start tracking your learning today</p>

        <form className="auth-form" onSubmit={handleSignup} id="signup-form">
          <div className="form-group">
            <label className="form-label" htmlFor="signup-username">Username</label>
            <input
              id="signup-username"
              className="form-input"
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              className="form-input"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            className="btn-primary"
            type="submit"
            id="signup-submit-btn"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" id="go-to-login-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
