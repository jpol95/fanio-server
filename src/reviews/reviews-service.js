const xss = require("xss");

const ReviewsService = {
  getReviewById(db, id) {
    return db("reviews")
      .select("*")
      .where({ id })
      .first()
      .then((review) => {
        if (!!review) return ReviewsService.serializeReview(review);
        else return review;
      });
  },
  insertReview(db, review) {
    return db
      .insert(review)
      .into("reviews")
      .returning("*")
      .then((rows) => rows[0])
      .then((review) => ReviewsService.getReviewById(db, review.id));
  },
  deleteReview(db, id) {
    return db("reviews").where({ id }).delete();
  },
  updateReview(db, id, newReviewInfo) {
    return db("reviews")
      .where({ id })
      .update({ ...newReviewInfo })
      .returning("*")
      .then((rows) => rows[0])
      .then((review) => ReviewsService.getReviewById(db, review.id));
  },
  serializeReview(review) {
    return {
      ...review,
      title: xss(review.title),
      content: xss(review.content),
    };
  },
};

module.exports = ReviewsService;
