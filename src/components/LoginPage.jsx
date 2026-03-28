import { useState } from "react";

// Demo credentials
const DEMO_USERS = [
  { username: "admin",   password: "admin123",   role: "Admin",   name: "Admin User" },
  { username: "teacher", password: "teacher123", role: "Teacher", name: "Prof. Johnson" },
  { username: "student", password: "student123", role: "Student", name: "Alex Smith" },
];

/**
 * LoginPage — credential-based login with demo accounts.
 *
 * Props:
 *   onLogin {Function} - Called with { name, role } on success
 */
export function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!username || !password) { setError("Please enter username and password."); return; }

    setLoading(true);
    setError("");

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const match = DEMO_USERS.find(
      (u) => u.username === username.trim() && u.password === password
    );

    if (match) {
      onLogin({ name: match.name, role: match.role, username: match.username });
    } else {
      setError("Invalid username or password.");
      setLoading(false);
    }
  };

  const fillDemo = (user) => {
    setUsername(user.username);
    setPassword(user.password);
    setError("");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo / Brand */}
        <div className="login-brand">
          <div className="login-logo">🎓</div>
          <h1>Student Management</h1>
          <p>Sign in to your account</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className={`input${error ? " error" : ""}`}
              placeholder="Enter username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="pass-wrap">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                className={`input${error ? " error" : ""}`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pass-toggle"
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? (
              <><span className="btn-spinner" /> Signing in…</>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Demo accounts */}
        <div className="demo-section">
          <p className="demo-label">Demo accounts — click to fill:</p>
          <div className="demo-chips">
            {DEMO_USERS.map((u) => (
              <button
                key={u.username}
                className="demo-chip"
                onClick={() => fillDemo(u)}
                type="button"
              >
                <span className="chip-role">{u.role}</span>
                <span className="chip-user">{u.username}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="login-bg">
        <div className="bg-circle bg-circle-1" />
        <div className="bg-circle bg-circle-2" />
        <div className="bg-circle bg-circle-3" />
      </div>
    </div>
  );
}
