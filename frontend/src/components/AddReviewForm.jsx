import { useState } from "react"
import api from "../api"

function AddReviewForm({ restaurantId, onAddReview }) {
  const [rating, setRating] = useState("")
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!rating || !comment.trim()) {
      return
    }

    try {
      const response = await api.post("/api/reviews/", {
        restaurant: restaurantId,
        rating: Number(rating),
        comment: comment.trim(),
      })

      onAddReview(restaurantId, response.data)
      setRating("")
      setComment("")
      setError("")
    } catch {
      setError("Unable to add review. Please login and try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Review</h3>
      <div>
        <label htmlFor="rating">Rating</label>
        <input
          id="rating"
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(event) => setRating(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="comment">Comment</label>
        <input
          id="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </div>
      <button type="submit">Add Review</button>
      {error && <p>{error}</p>}
    </form>
  )
}

export default AddReviewForm
