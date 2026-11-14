
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../features/auth/AuthProvider'

function LoginPage() {
    const { signIn, signInWithGoogle } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signIn(email, password)
            navigate('/')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to log in.')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setError('')
        setLoading(true)

        try {
            await signInWithGoogle()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Google sign-in failed.')
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-ivory px-6 py-12">
            <div className="w-full max-w-md rounded-xl border border-sand bg-white p-8">
                <h1 className="font-display text-3xl text-charcoal">
                    Welcome back.
                </h1>

                <p className="mt-2 text-muted">
                    Sign in to continue discovering places.
                </p>

                {error && (
                    <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                <form onSubmit={handleLogin} className="mt-7 space-y-5">
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm text-charcoal">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full rounded-lg border border-sand bg-ivory px-4 py-3 text-charcoal outline-none focus:border-charcoal"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm text-charcoal">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-lg border border-sand bg-ivory px-4 py-3 text-charcoal outline-none focus:border-charcoal"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-charcoal px-4 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-sand" />
                    <span className="text-sm text-muted">or</span>
                    <div className="h-px flex-1 bg-sand" />
                </div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full rounded-lg border border-sand px-4 py-3 text-charcoal transition hover:bg-ivory disabled:opacity-50"
                >
                    Continue with Google
                </button>

                <p className="mt-7 text-center text-sm text-muted">
                    New to Kaha Chale?{' '}
                    <Link to="/signup" className="font-medium text-charcoal underline">
                        Create an account
                    </Link>
                </p>

                <p className="mt-4 text-center text-sm">
                    <Link to="/explore" className="text-muted hover:text-charcoal">
                        Continue as guest →
                    </Link>
                </p>
            </div>
        </main>
    )
}

export default LoginPage
