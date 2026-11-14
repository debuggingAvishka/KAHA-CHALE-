
import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../features/auth/AuthProvider'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const { user, loading, signOut } = useAuth()
    const [signingOut, setSigningOut] = useState(false)

    const closeMenu = () => setMenuOpen(false)

    const handleSignOut = async () => {
        setSigningOut(true)

        try {
            await signOut()
            closeMenu()
        } catch (error) {
            console.error('Sign out failed:', error)
        } finally {
            setSigningOut(false)
        }
    }

    const authLinks = (
        <>
            {loading ? null : user ? (
                <>
                    <span className="max-w-40 truncate text-sm text-muted">
                        {user.email}
                    </span>
                    <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="font-medium text-terracotta disabled:opacity-50"
                    >
                        {signingOut ? 'Signing out...' : 'Sign Out'}
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login" onClick={closeMenu}>Login</Link>
                    <Link
                        to="/signup"
                        onClick={closeMenu}
                        className="font-medium text-terracotta"
                    >
                        Sign Up
                    </Link>
                </>
            )}
        </>
    )

    return (
        <header className="relative z-50 bg-ivory text-charcoal">
            <nav
                className="flex items-center justify-between px-6 py-5 md:px-8"
                aria-label="Main navigation"
            >
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="font-display text-xl font-semibold tracking-wide"
                >
                    KAHA CHALE
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    <Link to="/">Home</Link>
                    <Link to="/explore">Explore</Link>
                    <Link to="/about">About</Link>
                </div>

                <div className="hidden items-center gap-8 md:flex">
                    {authLinks}
                </div>

                <button
                    type="button"
                    onClick={() => setMenuOpen((current) => !current)}
                    className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-sand md:hidden"
                    aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                >
                    <span className={`h-0.5 w-5 bg-charcoal transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
                    <span className={`h-0.5 w-5 bg-charcoal transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`h-0.5 w-5 bg-charcoal transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
                </button>
            </nav>

            {menuOpen && (
                <div
                    id="mobile-navigation"
                    className="border-t border-sand bg-ivory px-6 py-6 shadow-lg md:hidden"
                >
                    <div className="flex flex-col gap-5">
                        <Link to="/" onClick={closeMenu}>Home</Link>
                        <Link to="/explore" onClick={closeMenu}>Explore</Link>
                        <Link to="/about" onClick={closeMenu}>About</Link>

                        <div className="border-t border-sand" />

                        {loading ? null : user ? (
                            <>
                                <span className="break-all text-sm text-muted">
                                    {user.email}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    disabled={signingOut}
                                    className="text-left font-medium text-terracotta"
                                >
                                    {signingOut ? 'Signing out...' : 'Sign Out'}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={closeMenu}>Login</Link>
                                <Link
                                    to="/signup"
                                    onClick={closeMenu}
                                    className="font-semibold text-terracotta"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
