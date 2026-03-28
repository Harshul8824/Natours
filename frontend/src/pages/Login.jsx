import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementation to connect Backend will go here
    console.log(email, password);
  };

  return (
    <main className="main auth-container">
      <div className="auth-form glass">
        <h2 className="heading-secondary ma-bt-lg title-gradient">Log into your account</h2>
        <form className="form form--login" onSubmit={handleSubmit}>
          <div className="form__group">
            <label className="form__label" htmlFor="email">Email address</label>
            <input
              className="form__input"
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="password">Password</label>
            <input
              className="form__input"
              id="password"
              type="password"
              placeholder="••••••••"
              required
              minLength="8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form__group">
            <button className="btn btn--green">Login</button>
          </div>
          <div className="auth-redirect">
            <p>Don&apos;t have an account? <Link to="/signup" className="auth-link">Sign up</Link></p>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
