import { assetUrl } from "../assets/assets";

export default function AssetImage({
  src,
  alt = "",
  className = "",
  decorative = false,
  ...props
}) {
  return (
    <img
      src={assetUrl(src)}
      alt={decorative ? "" : alt}
      aria-hidden={decorative ? "true" : undefined}
      className={className}
      loading="lazy"
      draggable="false"
      {...props}
    />
  );
}
