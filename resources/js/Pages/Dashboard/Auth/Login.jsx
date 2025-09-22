import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import '../../../styles/auth.css';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="auth-bg">
            <Head title="Log in" />

            <div className="auth-card">
                {/* Header */}
                <div className="auth-header">
                    <svg className="auth-logo" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <h1 className="auth-title">Dashtrans Admin</h1>
                    <p className="auth-subtitle">Please log in to your account</p>
                </div>

                {/* Status Message */}
                {status && <div className="auth-status">{status}</div>}

                {/* Form */}
                <form onSubmit={submit} className="auth-form">
                    {/* Email Field */}
                    <div className="auth-field">
                        <label htmlFor="email" className="auth-label">Email</label>
                        <div className="auth-input-wrapper">
                            <i className="bi bi-envelope auth-icon-left"></i>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="auth-input"
                                placeholder="jhon@example.com"
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                aria-label="Email address"
                            />
                        </div>
                        {errors.email && <span className="auth-error">{errors.email}</span>}
                    </div>

                    {/* Password Field */}
                    <div className="auth-field">
                        <label htmlFor="password" className="auth-label">Password</label>
                        <div className="auth-input-wrapper">
                            <i className="bi bi-lock auth-icon-left"></i>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="auth-input"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                aria-label="Password"
                            />
                            <i
                                className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} auth-icon-right`}
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                role="button"
                                tabIndex="0"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        togglePasswordVisibility();
                                    }
                                }}
                            ></i>
                        </div>
                        {errors.password && <span className="auth-error">{errors.password}</span>}
                    </div>

                    {/* Remember Me / Forgot Password */}
                    <div className="auth-remember-forgot">
                        <div className="auth-remember">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <label htmlFor="remember">Remember Me</label>
                        </div>
                        {canResetPassword && (
                            <Link href={route('password.request')} className="auth-forgot">
                                Forgot Password ?
                            </Link>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="auth-button"
                        disabled={processing}
                        aria-label="Sign in to your account"
                    >
                        {processing ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
}
