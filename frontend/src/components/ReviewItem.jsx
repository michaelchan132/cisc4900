function ReviewItem({ review }) {
  return (
    <div>
      <p>
        <strong>{review.author_name || `User ${review.author}`}:</strong> {review.comment}
      </p>
      <p>Rating: {review.rating}</p>
    </div>
  )
}

export default ReviewItem
