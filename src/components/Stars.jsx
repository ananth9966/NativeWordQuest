export default function Stars({ count = 0, large = false }) {
  return (
    <span className={`stars ${large ? "stars-large" : ""}`} aria-label={`${count} stars`}>
      {[1, 2, 3].map((star) => (
        <span key={star} className={star <= count ? "filled-star" : "empty-star"}>
          ★
        </span>
      ))}
    </span>
  );
}
