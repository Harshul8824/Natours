import { Link } from "react-router-dom";

export default function Header({ user, onLogout }) {
    return (
        <header className="header">
            {/* LEFT NAV */}
            <nav className="nav nav--tours">
                <Link className="nav__el" to="/">
                    All tours
                </Link>

                <form className="nav__search">
                    <button className="nav__search-btn" type="submit">
                        <svg>
                            <use xlinkHref="/img/icons.svg#icon-search" />
                        </svg>
                    </button>

                    <input
                        className="nav__search-input"
                        type="text"
                        placeholder="Search tours"
                    />
                </form>
            </nav>

            {/* LOGO */}
            <div className="header__logo">
                <img src="/img/logo-white.png" alt="Natours logo" />
            </div>

            {/* RIGHT NAV */}
            <nav className="nav nav--user">
                {user ? (
                    <>
                        <button className="nav__el nav__el--logout" onClick={onLogout}>
                            Logout
                        </button>

                        <Link className="nav__el" to="/me">
                            <img
                                className="nav__user-img"
                                src={`/img/users/${user.photo}`}
                                alt={`Photo of ${user.name}`}
                            />
                            <span>{user.name.split(" ")[0]}</span>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link className="nav__el" to="/login">
                            Log in
                        </Link>

                        <Link className="nav__el nav__el--cta" to="/signup">
                            Sign up
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}
