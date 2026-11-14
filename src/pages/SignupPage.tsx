
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../features/auth/AuthProvider'

function SignupPage() {
    const { signUp, signInWithGoogle } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const authenticated = await signUp(email, password)

            if (authenticated) {
                navigate('/')
            } else {
                setSuccess(
                    'Account created! Please check your email and click the confirmation link to activate your account.',
                )
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to create your account.')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignup = async () => {
        setError('')
        setLoading(true)

        try {
            await signInWithGoogle()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Google sign-up failed.')
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-ivory px-6 py-12">
            <div className="w-full max-w-md rounded-xl border border-sand bg-white p-8">
                <h1 className="font-display text-3xl text-charcoal">
                    Find your next favourite place.
                </h1>

                <p className="mt-2 text-muted">
                    Create an account and make every discovery personal.
                </p>

                {error && (
                    <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                {success && (
                    <p role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-800">
                        {success}
                    </p>
                )}

                <form onSubmit={handleSignup} className="mt-7 space-y-5">
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
                            autoComplete="new-password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-lg border border-sand bg-ivory px-4 py-3 text-charcoal outline-none focus:border-charcoal"
                            placeholder="At least 8 characters"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-charcoal px-4 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-sand" />
                    <span className="text-sm text-muted">or</span>
                    <div className="h-px flex-1 bg-sand" />
                </div>

                <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={loading}
                    className="w-full rounded-lg border border-sand px-4 py-3 text-charcoal transition hover:bg-ivory disabled:opacity-50"
                >
                    Continue with Google
                </button>

                <p className="mt-7 text-center text-sm text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-charcoal underline">
                        Sign in
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

export default SignupPage
