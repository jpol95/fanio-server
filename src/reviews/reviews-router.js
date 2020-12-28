const express = require("express");
const ReviewsService = require("./reviews-service");
const jsonParser = express.json();
const reviewsRouter = express.Router();
const path = require('path')
const loggedInUser = 1; //this field will disappear once you introduce login
const {requireLoggedInUser, requireAuth} = require("../middleware/jwt-auth")

const validRating = (rating) => {
    if (rating > 5 || rating < 0 || !Number.isInteger(Number(rating))) return false
    return true;
}

const validTypes = [ 'Book series', 'Comic series', 'Movie series', 'Show']


reviewsRouter
  .route("/")
  .post(jsonParser, (req, res, next) => {
    const db = req.app.get("db");
    const { title, content, rating } = req.body;
    if (!title || !content || !rating)
      return res.status(400).json({ error: "Missing required fields" });
    if (!validRating(rating)) res.status(400).json({ error: "Rating must be an integer between 0 and 5" });
    const review = { title, content, rating};
    ReviewsService.insertReview(db, review)
      .then((review) => res.status(201).location(path.posix.join(req.originalUrl, `/${review.id}`)).json(review))
      .catch(next);
  });

  //deal with error here

reviewsRouter.route("/:reviewId")
.all(checkInstallmentExists)
.get((req, res, next) => {
  return res.status(200).json(res.review)
})
.delete(requireAuth, requireLoggedInUser, (req, res, next) => {
    const db = req.app.get("db")
    const {id} = res.review
    //YOU ARE HERE
    ReviewsService.deleteReview(db, id)
    .then(() => res.status(204).end())
    .catch(next)
})
.patch(requireAuth, requireLoggedInUser, jsonParser, (req, res, next) => {
    const db = req.app.get("db")
    const {title, content, rating} = req.body
    const newInfo = {title, content, rating}
    if (!title && !content && !rating) return res.status(400).json({error: 'Must update either review, title, or content'})
    if (rating && !validRating(rating)) res.status(400).json({ error: "Rating must be an integer between 0 and 5" });
    // console.log(title, content, rating, validRating(rating))
    ReviewsService.updateReview(db, res.review.id, newInfo)
    .then(review => {
        return res.status(200).json(review)
    }).catch(next)
})



//check if you should be returning the thing you're updating

async function checkInstallmentExists(req, res, next) {
  try {
    const reviewId = req.params.reviewId;
    const db = req.app.get("db")
    // console.log(reviewId)
    const review = await ReviewsService.getReviewById(db, reviewId);
    if (!review) return res.status(400).json({ error: "Installment not found" });
    res.review = review;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = reviewsRouter