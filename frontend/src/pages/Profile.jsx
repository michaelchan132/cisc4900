import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api"

function Profile() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [deletingReviewId, setDeletingReviewId] = useState(null)

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const response = await api.get("/api/reviews/me/")
        setReviews(Array.isArray(response.data) ? response.data : [])
      } catch (fetchError) {
        console.log(fetchError)
        setError("Could not load your profile reviews right now.")
      } finally {
        setLoading(false)
      }
    }

    fetchMyReviews()
  }, [])

  const handleDeleteReview = async (reviewId) => {
    setDeleteError("")
    setDeletingReviewId(reviewId)

    try {
      await api.delete(`/api/reviews/delete/${reviewId}/`)
      setReviews((currentReviews) =>
        currentReviews.filter((review) => review.id !== reviewId),
      )
    } catch (deleteReviewError) {
      console.log(deleteReviewError)
      setDeleteError("Could not delete this review right now. Please try again.")
    } finally {
      setDeletingReviewId(null)
    }
  }


  if (loading) {
    return <p>Loading your profile...</p>
  }

  return (
    <main>
      <h1>My Profile</h1>
      <h2>Submitted Reviews</h2>

      {error && <p>{error}</p>}
      {deleteError && <p>{deleteError}</p>}

      {!error && reviews.length === 0 && <p>You have not submitted any reviews yet.</p>}

      {reviews.map((review) => (
        <article key={review.id}>
          <h3>{review.restaurant_name}</h3>
          <p>Rating: {review.rating}</p>
          <p>{review.comment}</p>
          <small>
            Submitted on {new Date(review.created_at).toLocaleDateString()}
          </small>
          <div>
            <button
              type="button"
              onClick={() => handleDeleteReview(review.id)}
              disabled={deletingReviewId === review.id}
            >
              {deletingReviewId === review.id ? "Deleting..." : "Delete review"}
            </button>
          </div>
        </article>
      ))}

      <p>
        <Link to="/restaurants">Browse Restaurants</Link>
      </p>
    </main>
  )
}

export default Profile