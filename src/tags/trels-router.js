const express = require("express");
const TrelsService = require("./trels-service");
const jsonParser = express.json();
const trelsRouter = express.Router();
const path = require("path");
const { requireLoggedInUser, requireAuth } = require("../middleware/jwt-auth");

trelsRouter.route("/").get((req, res, next) => {
  const db = req.app.get("db");
  TrelsService.getTrels(db)
    .then((trel) => {
      return res.status(200).json(trel);
    })
    .catch(next);
});

trelsRouter.route("/:tagId/:reviewId").get((req, res, next) => {
  const db = req.app.get("db");
  const { tagId, reviewId } = req.params;
  TrelsService.getTrelById(db, tagId, reviewId)
    .then((trel) => {
      if (!trel)
        return res
          .status(400)
          .json({ error: "Tag-review relationship not found" });
      return res.status(200).json(trel);
    })
    .catch(next);
});

trelsRouter
  .route("/:reviewId")
  .post(requireAuth, requireLoggedInUser, jsonParser, (req, res, next) => {
    const db = req.app.get("db");
    const trels = req.body;
    const trelArr = [];
    const reviewId = req.params.reviewId;
    for (let trel of trels) {
      const { tagId } = trel;
      if (!tagId || !reviewId)
        return res
          .status(400)
          .json({ error: "Must provide tagId and reviewId" });
      const singleTag = { tagId, reviewId };
      trelArr.push(singleTag);
    }
    TrelsService.insertTrels(db, trelArr)
      .then((trel) => res.status(201).json(trel))
      .catch(next);
  })
  .delete(requireAuth, requireLoggedInUser, (req, res, next) => {
    const db = req.app.get("db");
    const { reviewId } = req.params;
    TrelsService.getTrelsByReviewId(db, reviewId).then((trels) => {
      if (trels.length === 0)
        return res
          .status(400)
          .json({
            error: "No tag-review relationships for given review found",
          });

      TrelsService.deleteTrelsByReviewId(db, reviewId).then(() => {
        return res.status(204).end();
      });
    });
  });

module.exports = trelsRouter;
