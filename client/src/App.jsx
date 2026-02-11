import { useState, useRef } from "react";
import axios from 'axios';
import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const handleMouseMove = (e) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            console.log(response.data);
            navigate("/home")
        } catch (error) {
            console.error('There was an error!', error.response?.data || error.message);
            setError(error.response?.data?.message || error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
        >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-teal-900 to-slate-900"></div>
            <div
                className="absolute inset-0 opacity-40 blur-3xl"
                style={{
                    background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(20, 184, 166, 0.2), transparent 80%)`,
                    transition: 'background 0.1s ease-out',
                }}
            ></div>

            {/* Floating Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-sm">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-2xl hover:border-white/30 transition-all duration-300 group">
                    <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/5 to-transparent pointer-events-none"></div>
                    <h1 className="text-2xl font-bold text-center mb-2 text-white relative z-10">Login</h1>
                    <p className="text-center text-slate-200 text-sm mb-6 relative z-10">Welcome back!</p>

                    {error && (
                        <p className="text-red-200 text-sm mb-4 bg-red-500/20 backdrop-blur p-3 rounded-lg border border-red-400/30 relative z-10">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleLogin} className="relative z-10">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-slate-200">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (error) setError('');
                                }}
                                className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-white/40 text-white placeholder-slate-300 transition-all hover:bg-white/15 hover:border-white/30"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium mb-2 text-slate-200">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError('');
                                }}
                                className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-white/40 text-white placeholder-slate-300 transition-all hover:bg-white/15 hover:border-white/30"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-linear-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all disabled:scale-95 scale-100 hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-300 relative z-10">
                        Don't have an account?{' '}
                        <a href="/register" className="text-teal-300 hover:text-teal-200 font-medium transition-colors hover:underline">
                            Sign up
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
