import React, { useState } from 'react';
import axios from "axios";

import './signin.css';

const SignInPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in both fields');
        } else if (!validateEmail(email)) {
            setError('Please enter a valid email address');
        } else {
            setError('');
            try {
                const response = await axios.post('http://localhost:8080/users/login', { email, password });

                if (response.status === 200) {
                    onLogin(true);
                } else {
                    setError(response.data.message || 'Login failed');
                }
            } catch (error) {
                console.log(error);
                if (error.response) {
                    setError(error.response.data.message || 'Login failed');
                } else {
                    // Network error or other issues
                    setError('An error occurred. Please try again.');
                }
            }
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
