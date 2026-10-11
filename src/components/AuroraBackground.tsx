// Pseudo-random but deterministic, so the server and browser render the same stars
const rand = (i: number) => {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const stars = Array.from({ length: 80 }, (_, i) => ({
  top: (rand(i) * 100).toFixed(2),
  left: (rand(i + 100) * 100).toFixed(2),
  size: (1 + rand(i + 200) * 2).toFixed(1),
  delay: (rand(i + 300) * 6).toFixed(2),
  dur: (3 + rand(i + 400) * 4).toFixed(2),
}));

export default function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--aurora-bg)]">
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />

      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={
            {
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              "--delay": `${s.delay}s`,
              "--dur": `${s.dur}s`,
            } as React.CSSProperties
          }
        />
      ))}

      <div className="shooting-star" />
      <div className="shooting-star second" />

      {/* Soft dark edges so the content stays readable */}
            <div className="absolute inset-0 opacity-90 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--aurora-bg)_100%)]" />
    </div>
  );
}