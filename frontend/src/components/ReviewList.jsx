import ReviewItem from "./ReviewItem"

function ReviewList({ reviews }) {
    return (
    <div className="review-list">
      <h2 className="review-list__title">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="review-list__empty">No reviews yet. Be the first to share your experience.</p>
      ) : (
        reviews.map((review) => <ReviewItem key={review.id} review={review} />)
      )}
    </div>
  )
}

export default ReviewList