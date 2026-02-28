export function ServicesHero() {
  return (
    <section className="relative px-4 py-8 max-w-7xl mx-auto w-full">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 aspect-[4/5] md:aspect-[21/9] flex flex-col items-center justify-center text-center p-6 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/60 to-primary/20 opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0"></div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-slate-100 text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            Elevate <br className="md:hidden" />
            Your Ride
          </h1>
          <p className="text-slate-300 text-lg font-normal max-w-md mx-auto">
            Premium automotive customization services for the modern enthusiast.
            From aero styling to acoustic tuning.
          </p>
          <button className="mt-8 flex w-full max-w-[240px] mx-auto cursor-pointer items-center justify-center rounded-xl h-14 bg-primary hover:bg-primary/90 text-white text-base font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 active:scale-95 transition-all">
            Book a Consultation
          </button>
        </div>

        <div
          className="absolute inset-0 z-[-1] opacity-40 bg-cover bg-center"
          aria-label="Dark luxury sports car front view"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD84j0AQUZkjO39LDhW77lXLcTCp6yn3yZw284iyVWYcE65F721am7cdtIm0J7ealTuLRiVULJXUcpKUZ7pIPhnrjcB8c9naxM8KKiMwOYz3RfzW2YEfvjOSlr6Mfuyd8yJSLw7HAA6x9ZdwcvG1qkbvdCpFyhzX4MwhXA5c3qMQIkqI0nQ4VSkbzuuG1Qri0GaSOqoCTw8ezlx0wBp_5rVvZByM4J8pLvOJ6YD7usAHWBl3gJChabYLoKXRYCfUYSOZJcNg7S0v0zk")',
          }}
        />
      </div>
    </section>
  );
}
