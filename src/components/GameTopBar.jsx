import AssetImage from "./AssetImage";
import { NWQ_ASSETS } from "../assets/assets";

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
        <AssetImage
          src={onBack ? NWQ_ASSETS.navigation.back : NWQ_ASSETS.navigation.menu}
          decorative
          className="topbar-icon-img"
        />
      </button>

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
        <span className="avatar" aria-hidden="true">
          <AssetImage src={NWQ_ASSETS.navigation.profile} decorative className="topbar-icon-img" />
        </span>
      </div>
    </header>
  );
}
