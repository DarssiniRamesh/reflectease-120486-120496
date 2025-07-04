import React, { useState } from 'react';

// PUBLIC_INTERFACE
function AuthForm({ mode, onAuthenticate, error, loading, switchMode }) {
  /** AuthForm renders login or register form.
   *  mode: "login" | "register"
   *  onAuthenticate: function(username, password)
   *  error: error message
   *  loading: bool
   *  switchMode: function to change between login/register
   */
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // PUBLIC_INTERFACE
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      return;
    }
    onAuthenticate(username, password);
  };

  return (
    <div className="journal-entry" style={{ maxWidth: 400, margin: '2rem auto' }}>
      <div className="entry-header">
        <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      </div>
      <form onSubmit={handleSubmit} className="entry-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            disabled={loading}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label htmlFor="pwd">Password:</label>
          <input
            id="pwd"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Register')}
          </button>
          <button className="btn btn-secondary" type="button" onClick={switchMode} disabled={loading}>
            {mode === 'login' ? 'Need an account?' : 'Have an account?'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthForm;
