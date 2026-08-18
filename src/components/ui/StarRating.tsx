interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
}

export default function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const stars = [];
  const rounded = Math.round(rating * 2) / 2;
  const textSize = size === "sm" ? "text-sm" : "text-base";

  for (let i = 1; i <= 5; i++) {
    if (i <= rounded) {
      stars.push(
        <span key={i} className={`${textSize} text-accent`}>
          ★
        </span>
      );
    } else if (i - 0.5 === rounded) {
      stars.push(
        <span key={i} className={`${textSize} text-accent`}>
          ★
        </span>
      );
    } else {
      stars.push(
        <span key={i} className={`${textSize} text-border`}>
          ★
        </span>
      );
    }
  }

  return (
    <span className="inline-flex items-center gap-0.5">
      {stars}
      <span className={`${textSize} font-medium text-foreground ml-1`}>
        {rating.toFixed(1)}
      </span>
    </span>
  );
}
