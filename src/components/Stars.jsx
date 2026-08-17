import AssetImage from "./AssetImage";
import { NWQ_ASSETS } from "../assets/assets";

export default function Stars({ count = 0, large = false }) {
  return (
    <span className={`stars ${large ? "stars-large" : ""}`} aria-label={`${count} stars`}>
      {[1, 2, 3].map((star) => (
        <AssetImage
          key={star}
          src={star <= count ? NWQ_ASSETS.rewards.starGold : NWQ_ASSETS.rewards.starLocked}
          decorative
          className="star-icon"
        />
      ))}
    </span>
  );
}
