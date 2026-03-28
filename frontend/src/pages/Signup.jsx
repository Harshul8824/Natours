import { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementation to connect Backend will go here
    console.log(name, email, password, passwordConfirm);
  };

  return (
    <main className="main auth-container">
      <div className="auth-form glass">
        <h2 className="heading-secondary ma-bt-lg title-gradient">Create your account</h2>
        <form className="form form--signup" onSubmit={handleSubmit}>
          <div className="form__group">
            <label className="form__label" htmlFor="name">Your name</label>
            <input
              className="form__input"
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="passwordConfirm">Confirm password</label>
            <input
              className="form__input"
              id="passwordConfirm"
              type="password"
              placeholder="••••••••"
              required
              minLength="8"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
          <div className="form__group">
            <button className="btn btn--green">Sign up</button>
          </div>
          <div className="auth-redirect">
            <p>Already have an account? <Link to="/login" className="auth-link">Login</Link></p>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Signup;
