import { assetUrl } from "../assets/assets";

/**
 * SceneBackground
 *
 * fit="contain"  -> NEVER crops the artwork. This is the default.
 * fit="cover"    -> fills the whole screen but may crop.
 * fit="stretch"  -> no crop but may distort the art.
 */
export default function SceneBackground({
  src,
  fit = "contain",
  className = "",
  children,
  position = "center",
}) {
  const fitClass =
    fit === "cover"
      ? "nwq-scene--cover"
      : fit === "stretch"
        ? "nwq-scene--stretch"
        : "nwq-scene--contain";

  return (
    <div className={`nwq-scene ${fitClass} ${className}`}>
      <img
        className="nwq-scene__image"
        src={assetUrl(src)}
        alt=""
        aria-hidden="true"
        style={{ objectPosition: position }}
        draggable="false"
      />

      <div className="nwq-scene__content">
        {children}
      </div>
    </div>
  );
}
