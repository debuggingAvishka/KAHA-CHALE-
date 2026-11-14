
import { Link } from 'react-router'

function NotFoundPage() {
    return (
        <main className="flex min-h-[75vh] items-center justify-center bg-ivory px-6 py-16">
            <div className="max-w-xl text-center">
                <p className="text-sm font-semibold tracking-[0.2em] text-terracotta">
                    404 — WRONG TURN?
                </p>

                <h1 className="mt-5 font-display text-6xl text-charcoal md:text-8xl">
                    Lost somewhere?
                </h1>

                <p className="mt-6 text-lg leading-relaxed text-muted">
                    Looks like this place isn't on our map.
                    Let's get you back to somewhere familiar.
                </p>

                <Link
                    to="/"
                    className="mt-8 inline-block rounded-md bg-terracotta px-6 py-3 font-medium text-white transition hover:opacity-90"
                >
                    Back to home
                </Link>
            </div>
        </main>
    )
}

export default NotFoundPage
