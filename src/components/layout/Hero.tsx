
function Hero() {
  return (
    <section className="max-w-5xl px-8 py-16">
      <p className="text-sm font-semibold tracking-widest text-terracotta">
        YOUR CITY, YOUR MOOD, YOUR PLAN.
      </p>

      <h1 className="mt-6 max-w-3xl font-display text-5xl leading-tight text-charcoal">
        Somewhere worth going. Something worth discovering.
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
        Find places in Jabalpur that match your mood, your company and your kind of day.
      </p>

      <div className="mt-8 flex items-center gap-6">
        <a
          href="#discover"
          className="rounded-md bg-terracotta px-6 py-3 text-white"
        >
          Find my place
        </a>

        <a
          href="#explore"
          className="text-charcoal underline underline-offset-4"
        >
          Explore places
        </a>
      </div>
    </section>
  )
}

export default Hero
