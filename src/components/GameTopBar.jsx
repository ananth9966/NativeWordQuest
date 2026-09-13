import AssetImage from "./AssetImage";
import NavMenu from "./NavMenu";
import { NWQ_ASSETS } from "../assets/assets";

export default function GameTopBar({
  title,
  streak = 0,
  stars = 0,
  onBack,
  onNavigate,
  onReset,
  activeScreen
}) {
  return (
    <header className="topbar">
      {onBack ? (
        <button
          className="round-icon-button"
          onClick={onBack}
          aria-label="Go back"
        >
          <AssetImage
            src={NWQ_ASSETS.navigation.back}
            decorative
            className="topbar-icon-img"
          />
        </button>
      ) : (
        <span />
      )}

      <div className="topbar-title">{title}</div>

      <div className="status-pills">
        <span className="status-pill">
          <AssetImage src={NWQ_ASSETS.status.streakFire} decorative className="pill-icon-img" />
          {streak}
        </span>
        <span className="status-pill">
          <AssetImage src={NWQ_ASSETS.rewardIcons.star} decorative className="pill-icon-img" />
          {stars}
        </span>

        {onNavigate && (
          <NavMenu
            onNavigate={onNavigate}
            onReset={onReset}
            activeScreen={activeScreen}
          />
        )}

        <span className="avatar" aria-hidden="true">
          <AssetImage src={NWQ_ASSETS.navigation.profile} decorative className="topbar-icon-img" />
        </span>
      </div>
    </header>
  );
}
