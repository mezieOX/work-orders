/** Decorative ambient motion — purely visual, aria-hidden. */
export function AmbientBackdrop() {
  return (
    <div className="ambient-root" aria-hidden>
      <div className="ambient-orb ambient-orb-a" />
      <div className="ambient-orb ambient-orb-b" />
      <div className="ambient-orb ambient-orb-c" />
      <div className="ambient-grid" />
      <div className="ambient-sheen" />
    </div>
  );
}
