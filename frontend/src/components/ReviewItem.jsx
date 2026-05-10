function ReviewItem({ review }) {
  return (
    <article className="review-item">
      <div className="review-item__header">
        <strong>{review.author_name || `User ${review.author}`}</strong>
        <span className="review-item__rating">⭐ {review.rating}</span>
      </div>
      <p className="review-item__comment">{review.comment}</p>
    </article>
  )
}

export default ReviewItem
