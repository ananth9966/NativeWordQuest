export default function GameTopBar({
  title,
  streak = 0,
  stars = 0,
  onBack,
  onMenu
}) {
  return (
    <header className="topbar">
      <button
        className="round-icon-button"
        onClick={onBack || onMenu}
        aria-label={onBack ? "Go back" : "Open menu"}
      >
        {onBack ? "←" : "☰"}
      </button>

      <div className="topbar-title">{title}</div>

      <div className="status-pills">
        <span className="status-pill">🔥 {streak}</span>
        <span className="status-pill">★ {stars}</span>
        <span className="avatar" aria-hidden="true">
          ●
        </span>
      </div>
    </header>
  );
}
