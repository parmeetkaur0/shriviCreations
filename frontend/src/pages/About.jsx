const highlights = [
  {
    title: 'Small Batch, Human Made',
    text: 'Each piece is shaped slowly by hand, with attention to texture, color, and finish that feels deeply personal.',
  },
  {
    title: 'Natural Materials First',
    text: 'We choose yarns and fibers that feel soft, breathable, and meaningful — made for everyday use and long-loved keeping.',
  },
  {
    title: 'Design That Stays Close',
    text: 'Nothing is rushed. Our collections are built around original patterns, warm tones, and little details that make every item feel special.',
  },
];

const AboutPage = () => (
  <div className="container-custom py-14 sm:py-18 bg-cream">
    <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
      <div>
        <p className="section-eyebrow mb-3">Our Story</p>
        <h1 className="section-title">A handmade brand born from patience, color, and detail.</h1>
        <p className="mt-5 text-ink/70 leading-relaxed max-w-2xl">
          Shrivi Creations began as a quiet creative practice and has grown into a boutique label focused on
          joyful, handcrafted pieces. Every design reflects a blend of softness, craftsmanship, and modern
          detail that makes the everyday feel a little more beautiful.
        </p>
        <p className="mt-4 text-ink/70 leading-relaxed max-w-2xl">
          We believe thoughtful design should feel warm and personal. That is why each collection is created
          with intention — from the yarn choice to the final finishing touch.
        </p>
      </div>

      <div className="rounded-[28px] bg-[#F8EEF2] border border-ink/10 p-6 sm:p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.24em] text-ink/50 mb-4">Why We Make</p>
        <blockquote className="font-display text-2xl sm:text-3xl leading-snug text-ink">
          “We make pieces that slow the pace, soften the room, and carry a little handmade soul.”
        </blockquote>
        <div className="mt-6 grid gap-3 text-sm text-ink/70">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-gold" />
            Thoughtful textures and colors for everyday living
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-gold" />
            Crafted in small quantities to maintain quality
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-gold" />
            Designed to feel meaningful, not mass-produced
          </div>
        </div>
      </div>
    </section>

    <section className="mt-14 grid gap-5 md:grid-cols-3">
      {highlights.map((item) => (
        <div key={item.title} className="rounded-2xl bg-white border border-ink/10 p-6 shadow-sm">
          <h2 className="font-display text-xl text-ink mb-3">{item.title}</h2>
          <p className="text-sm leading-relaxed text-ink/70">{item.text}</p>
        </div>
      ))}
    </section>
  </div>
);

export default AboutPage;
