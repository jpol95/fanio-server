//context data present --> 
//get specific installment 200, check
//get all installments 200, check
//delete installment 200, check
//should return 401 if user unauthorized check
//patch should return 200 if all required data present check 
//patch should return 400 if no required data present check
//patch should return 400 if invalid type submitted check
//patch should return 200 if some required data present check
//patch should return 401 if user is unauthorized check
const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../src/app");
const knex = require("knex");
const testHelper = require("./fandoms.fixtures");

const authToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MDg3NjAyNjIsInN1YiI6ImtpbmdidW1paSJ9.H6qR3kpROuueininbMukdIjzA00Af5Q-PcTh_c59O1Q`;
const wrongAuthToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2MDg4NDQ4NTYsInN1YiI6ImFkbWlyYWx6aGFvbyJ9.PT5qFdrnfZItlDC9T0jyS3b40HeefCKcnM5xXXISfUA`;

describe("fandoms-endpoints", () => {
  let db = knex({
    client: "pg",
    connection: process.env.TEST_DB_URL,
  });
  app.set("db", db);
  before("delete reviews before starting", () => {
    return testHelper.cleanUp(db);
  });
  afterEach("clean up database after each test", () => {
    return testHelper.cleanUp(db);
  });
  after("destroy database", () => db.destroy());
  context("reviews table has data in it", () => {
    beforeEach("insert reviews into db", () => testHelper.seedDataBase(db));
    it("GET /api/reviews/:reviewId should return 200 with specific review", () => {
      const testReviewId = 4;
      const result = {
        id: 4,
        title: `Supernatural season 3 Episode 4 Review`,
        content: `Omg this is the best episode ever!`,
        rating: 2,
      }
      return supertest(app)
      .get(`/api/reviews/${testReviewId}`)
      .expect(200, result);
    });
    it("DELETE /api/reviews/:reviewId should return 200 if requested review exists and user is authrorized", () => {
      const testReviewId = 9
      const expected = [...testHelper.reviewList];
      expected.splice(7, 1);
      return supertest(app)
        .delete(`/api/reviews/${testReviewId}`)
        .set(`Authorization`, `Bearer ${authToken}`)
        .expect(204)
    });
    it("DELETE /api/reviews/:reviewId should return 401 if user is unauthorized", () => {
      const testReviewId = 9;
      return supertest(app)
        .delete(`/api/reviews/${testReviewId}`)
        .set(`Authorization`, `Bearer ${wrongAuthToken}`)
        .expect(401);
    });
    it("PATCH /api/reviews/:reviewId should return 200 with updated fandom if user is authorized", () => {
      const testReview = 9;
      const updatedReview = {
        title: `Doctor Who Updated`,
        content: `Omg this is the worst episode! I am updating!`,
        rating: 5,
      }
      const expected = {
        id: 9,
        title: `Doctor Who Updated`,
        content: `Omg this is the worst episode! I am updating!`,
        rating: 5,
      };
      return supertest(app)
        .patch(`/api/reviews/${testReview}`)
        .set(`Authorization`, `Bearer ${authToken}`)
        .send(updatedReview)
        .expect(200, expected);
    });
    it("PATCH /api/reviews/:reviewId should return 400 if required data is not present", () => {
      const testReview = 9;
      const updatedReview = { wrongField: "This is not the right field!" };
      return supertest(app)
        .patch(`/api/reviews/${testReview}`)
        .set(`Authorization`, `Bearer ${authToken}`)
        .send(updatedReview)
        .expect(400);
    });
    it("PATCH /api/reviews/:reviewId should return 401 if the user is not authorized", () => {
        const testReview = 9;
         const updatedReview = {
        title: `Doctor Who Updated`,
        content: `Omg this is the worst episode! I am updating!`,
        rating: 5,
      }
      return supertest(app)
        .patch(`/api/reviews/${testReview}`)
        .set(`Authorization`, `Bearer ${wrongAuthToken}`)
        .send(updatedReview)
        .expect(401);
    });
  });
  context("No data present", () => {
    // beforeEach("insert users", () => testHelper.seedReviews(db));
    it("POST /api/reviews should return 201 if fields are provided and user is authorized", () => {
        const reviewToInsert = {
            title: `New Review`,
            content: `Omg this is the worst episode ever!`,
            rating: 2,
          } //should adding the userId be handled in the server?
      const expected = { ...reviewToInsert, id: 1 };
      return supertest(app)
        .post(`/api/reviews`)
        .set(`Authorization`, `Bearer ${authToken}`)
        .send(reviewToInsert)
        .expect(201)
        .then((fandom) => {
          return supertest(app)
            .get(`/api/reviews/1`)
            .expect(200, expected);
        });
    });
    const requiredFields = ["title", "content", "rating"]
    for (let field of requiredFields){
    const newReview = {
        title: `New review season 3 Review`,
        content: `New Reviewv!`,
        rating: 6,
      }
    delete newReview[field]
    it("POST /api/reviews/:reviewId should return 400 if a required field is missing", () => {
        return supertest(app)
        .post(`/api/reviews`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(newReview)
        .expect(400)
    })
}
      it("GET /api/reviews/:reviewId should return 400 when no data present", () => {
        const testReviewId = 9;
        return supertest(app)
        .get(`/api/fandoms/${testReviewId}`)
        .expect(400);
      }),
      it("DELETE /api/reviews/:reviewId should return 400 when no data present", () => {
        const testReviewId = 9
        return supertest(app)
        .delete(`/api/reviews/${testReviewId}`)
        .set(`Authorization`, `Bearer ${authToken}`)
        .expect(400);
      }),
      it.only("PATCH /api/reviews/:reviewId should return 400 when no data present", () => {
        const testReviewId = 9
        const newReview = {
            title: `New review season 3 Review`,
            content: `New Reviewv!`,
            rating: 3,
          }
        return supertest(app)
        .patch(`/api/reviews/${testReviewId}`)
        .set(`Authorization`, `Bearer ${authToken}`)
        .send(newReview)
        .expect(400);
      });
      it("POST /fandoms sanitizes inputs that contain xss", () => {
        const testUserId = 1
        const xssFandom = {
          title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        };
        return supertest(app)
          .post(`/api/fandoms/users/${testUserId}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send(xssFandom)
          .then((_) => {
            return supertest(app)
              .get("/api/fandoms/1")
              .then((result) => {
                expect(result.body.title).to.eql(
                  'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
                );
              });
          });
      });
  });
});

//if no data present --> 
//get specific installment should return 400 if installment not there check
//get all installments 400 if parent fandom does not exist check
//delete should return 400 if installment not found check 
//post should return 200 if required fields present check
//post should return 400 if installment type is invalid check
//post should return 400 if required field missing check
//post should return 401 if user is unauthorized check
//get empty array if no data present check
//get, delete, and patch should return 400 check
//test for xss


//REMEBER TO USE LOOP FOR PATCH