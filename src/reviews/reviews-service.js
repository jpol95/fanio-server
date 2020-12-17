const xss = require("xss");

const ReviewsService = {
  getReviewById(db, id) {
    return db("reviews").select("*").where({ id }).first();
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
  serializeInstallment(review) {
    return { ...review, title: xss(review), content: xss(review) };
  },
};
//i bet you could standardize this for example

module.exports = ReviewsService;
