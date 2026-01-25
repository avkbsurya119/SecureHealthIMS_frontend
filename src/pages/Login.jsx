import { useEffect, useMemo, useState } from 'react'
import '../App.css'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login() {
  const [mode, setMode] = useState('login')
  const [darkMode, setDarkMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [showOtp, setShowOtp] = useState(false)
  const [otpStep, setOtpStep] = useState('phone')
  const [otp, setOtp] = useState({ phone: '', email: '' })
  const [otpTimer, setOtpTimer] = useState({ phone: 45, email: 45 })

  const title = useMemo(() => {
    if (mode === 'register') return 'Register'
    if (mode === 'forgot') return 'Forgot Password'
    return 'Login'
  }, [mode])

  const subtitle = useMemo(() => {
    if (mode === 'register') return 'Create your account in seconds.'
    if (mode === 'forgot') return 'We will send you a reset link.'
    return 'If you already a member, easily log in now.'
  }, [mode])

  const resetStatus = () => setStatus({ type: '', message: '' })

  useEffect(() => {
    document.body.classList.toggle('theme-dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    if (!showOtp) return

    const key = otpStep === 'phone' ? 'phone' : 'email'
    if (otpTimer[key] === 0) return

    const interval = setInterval(() => {
      setOtpTimer(prev => ({ ...prev, [key]: Math.max(prev[key] - 1, 0) }))
    }, 1000)

    return () => clearInterval(interval)
  }, [showOtp, otpStep, otpTimer])

  const handleChange = event => {
    const { name, value } = event.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!form.email.trim() || !emailPattern.test(form.email)) {
      return 'Please enter a valid email address.'
    }

    if (mode !== 'forgot' && !form.password.trim()) {
      return 'Please enter your password.'
    }

    if (mode === 'register') {
      if (!form.name.trim()) return 'Please enter your full name.'
      if (!form.phone.trim()) return 'Please enter your phone number.'
      if (form.password.length < 6) return 'Password must be at least 6 characters.'
      if (form.password !== form.confirmPassword) return 'Passwords do not match.'
    }

    return ''
  }

  const handleSubmit = event => {
    event.preventDefault()
    const error = validate()
    if (error) {
      setStatus({ type: 'error', message: error })
      return
    }

    if (mode === 'login') {
      setStatus({
        type: 'success',
        message: 'Login successful. Welcome back!',
      })
    }

    if (mode === 'register') {
      setStatus({ type: '', message: '' })
      setShowOtp(true)
      setOtpStep('phone')
      setOtp({ phone: '', email: '' })
      setOtpTimer({ phone: 45, email: 45 })
    }

    if (mode === 'forgot') {
      setStatus({
        type: 'success',
        message: 'Reset link sent. Please check your email.',
      })
    }
  }

  const handleGoogle = () => {
    setStatus({ type: 'success', message: 'Google sign-in is ready to connect.' })
  }

  const handleOtpChange = event => {
    const { name, value } = event.target
    if (!/^\d*$/.test(value)) return
    setOtp(prev => ({ ...prev, [name]: value.slice(0, 6) }))
  }

  const handleVerifyOtp = event => {
    event.preventDefault()
    if (otpStep === 'phone') {
      if (otp.phone.length !== 6) {
        setStatus({ type: 'error', message: 'Enter the 6-digit phone OTP.' })
        return
      }
      setOtpStep('email')
      setStatus({ type: '', message: '' })
      return
    }

    if (otp.email.length !== 6) {
      setStatus({ type: 'error', message: 'Enter the 6-digit email OTP.' })
      return
    }

    setShowOtp(false)
    setMode('login')
    setStatus({ type: 'success', message: 'Verification complete. You can log in.' })
  }

  const handleResend = target => {
    setOtpTimer(prev => ({ ...prev, [target]: 45 }))
    setStatus({ type: 'success', message: 'OTP resent successfully.' })
  }

  const switchMode = next => {
    resetStatus()
    setMode(next)
    setShowPassword(false)
    setShowOtp(false)
    setOtpStep('phone')
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{title}</h1>
          <p>{subtitle}</p>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setDarkMode(prev => !prev)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                width="20"
                height="20"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
                <path d="M21.64 13a1 1 0 0 0-1.1-.27A7 7 0 0 1 11.27 3.5a1 1 0 0 0-.27-1.1 1 1 0 0 0-1.08-.25A9.5 9.5 0 1 0 21.89 14.1a1 1 0 0 0-.25-1.1z" />
              </svg>
            )}
          </button>
        </div>

        {status.message && (
          <div className={`status ${status.type}`}>{status.message}</div>
        )}

        {showOtp ? (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <div className="otp-header">
              <h2>{otpStep === 'phone' ? 'Verify Phone Number' : 'Verify Email Address'}</h2>
              <p>
                {otpStep === 'phone'
                  ? `Enter the 6-digit code sent to ${form.phone}.`
                  : `Enter the 6-digit code sent to ${form.email}.`}
              </p>
            </div>

            <label className="input-field">
              <span>{otpStep === 'phone' ? 'Phone OTP' : 'Email OTP'}</span>
              <input
                type="text"
                name={otpStep}
                placeholder="Enter 6-digit OTP"
                value={otp[otpStep]}
                onChange={handleOtpChange}
              />
            </label>

            <div className="otp-meta">
              <span>
                {otpTimer[otpStep] > 0
                  ? `Resend available in ${otpTimer[otpStep]}s`
                  : "Didn't receive the code?"}
              </span>
              <button
                type="button"
                className="otp-link"
                disabled={otpTimer[otpStep] > 0}
                onClick={() => handleResend(otpStep)}
              >
                Resend
              </button>
            </div>

            <button type="submit" className="primary-btn">
              {otpStep === 'phone' ? 'Verify Phone' : 'Verify Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <label className="input-field">
                <span>Full Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                />
              </label>
            )}

            <label className="input-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
            </label>

            {mode === 'register' && (
              <label className="input-field">
                <span>Phone Number</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={handleChange}
                />
              </label>
            )}

            {mode !== 'forgot' && (
              <label className="input-field">
                <span>Password</span>
                <div className="password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  {mode !== 'register' && (
                    <button
                      type="button"
                      className="eye-toggle"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(prev => !prev)}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 5c5 0 9.27 3.11 11 7-1.1 2.41-2.94 4.43-5.2 5.7l2.08 2.08-1.42 1.42-3.16-3.16A11.46 11.46 0 0 1 12 19c-5 0-9.27-3.11-11-7 1.1-2.41 2.94-4.43 5.2-5.7L2.7 2.7 4.12 1.3l18.38 18.38-1.42 1.42-3.23-3.23A11.26 11.26 0 0 1 12 19c-5 0-9.27-3.11-11-7a12.9 12.9 0 0 1 4.64-4.93l1.55 1.55A7 7 0 0 0 5 12c1.2 2.52 3.84 4.5 7 4.5 1.07 0 2.09-.22 3.02-.62l-1.63-1.63A3 3 0 0 1 9 12a3 3 0 0 1 .67-1.88L8.2 8.65A6.87 6.87 0 0 0 5 12c1.2 2.52 3.84 4.5 7 4.5.64 0 1.26-.08 1.86-.22l-1.56-1.56A2.99 2.99 0 0 1 9 12c0-.54.14-1.04.38-1.48L7.9 9.04A4.5 4.5 0 0 0 7.5 12a4.5 4.5 0 0 0 6.98 3.74l1.57 1.57A6.9 6.9 0 0 1 12 18.5C7.5 18.5 3.6 15.7 2 12c1.2-2.52 3.84-4.5 7-4.5.6 0 1.18.07 1.74.2L9.3 6.26A7.3 7.3 0 0 0 12 5z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 5c5 0 9.27 3.11 11 7-1.73 3.89-6 7-11 7S2.73 15.89 1 12c1.73-3.89 6-7 11-7zm0 2c-3.16 0-5.8 1.98-7 4.5 1.2 2.52 3.84 4.5 7 4.5s5.8-1.98 7-4.5C17.8 8.98 15.16 7 12 7zm0 2.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5z" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </label>
            )}

            {mode === 'register' && (
              <label className="input-field">
                <span>Confirm Password</span>
                <div className="password-wrap">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </label>
            )}

            <button type="submit" className="primary-btn">
              {mode === 'forgot'
                ? 'Send Reset Link'
                : mode === 'register'
                  ? 'Create Account'
                  : 'Login'}
            </button>

            {mode !== 'forgot' && (
              <>
                <div className="divider">
                  <span>OR</span>
                </div>
                <div className="social-stack">
                  <button type="button" className="social-btn google" onClick={handleGoogle}>
                    <span className="social-icon">
                      <span className="google-g">G</span>
                    </span>
                    Login with Google
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        <div className="auth-links">
          {mode === 'login' && (
            <button type="button" onClick={() => switchMode('forgot')}>
              Forget password?
            </button>
          )}

          {mode === 'forgot' && (
            <button type="button" onClick={() => switchMode('login')}>
              Back to login
            </button>
          )}
        </div>

        <div className="switch-row">
          {mode === 'login' && (
            <>
              <span>If you don't have an account.</span>
              <button type="button" onClick={() => switchMode('register')}>
                Register
              </button>
            </>
          )}

          {mode === 'register' && (
            <>
              <span>Already have an account?</span>
              <button type="button" onClick={() => switchMode('login')}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
