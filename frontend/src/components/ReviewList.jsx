import ReviewItem from "./ReviewItem";

function ReviewList({ reviews }) {
    return (
        <div>
            <h2>Reviews</h2>
            {reviews.map((review) => (
                <ReviewItem key={review.id} review="review"/>
            ))}
        </div>
    )
}

export default ReviewList