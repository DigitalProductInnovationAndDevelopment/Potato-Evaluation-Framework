import React, { useState } from 'react';
import './signin.css';

const SignInPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            setError('Please fill in both fields');
        } else if (!validateEmail(email)) {
            setError('Please enter a valid email address');
        } else {
            setError('');
            // Simulate login action
            onLogin(true);
        }
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    return (
        <div className="signin-container">
            <div className="dashboard-title">Karevo Dashboard</div>
            <form className="signin-form" onSubmit={(e) => e.preventDefault()}>
                <h2 className="signin-title">Sign In</h2>
                {error && <div className="error-message">{error}</div>}
                <input
                    className="signin-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="signin-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="signin-button" type="button" onClick={handleLogin}>
                    Sign In
                </button>
            </form>
        </div>
    );
};

export default SignInPage;
