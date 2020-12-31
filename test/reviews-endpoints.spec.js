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
    connection: process.env.TEST_DATABASE_URL,
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
    const requiredFields = ["title", "content", "rating"]
    const originalReview = {
        id: 19,
        title: `Supernatural season 3 Review`,
        content: `Omg this is the worst season ever!`,
        rating: 3,
      }
    for (let field of requiredFields){
        const editedReview = {
            title: `This is an edit`,
            content: `This is an edit again`,
            rating: 4,
          }
        delete editedReview[field]
        it("PATCH /api/reviews/:reviewId should return 200 and updated review if at least one required field is present", () => {
            const testReviewId = 19
            return supertest(app)
            .patch(`/api/reviews/${testReviewId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(editedReview)
            .expect(200)
            .then(() => {
                return supertest(app)
                .get(`/api/reviews/${testReviewId}`)
                .expect(200, {...originalReview, ...editedReview})       
            })
        })
    }
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
    it("POST /api/reviews should return 201 if fields are provided and user is authorized", () => {
        const reviewToInsert = {
            title: `New Review`,
            content: `Omg this is the worst episode ever!`,
            rating: 2,
          } 
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
      it("PATCH /api/reviews/:reviewId should return 400 when no data present", () => {
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
      it("POST /reviews sanitizes inputs that contain xss", () => {
        const xssFandom = {
          title: 'Naughty naughty very naughty <script>alert("xss");</script>',
          content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`, 
          rating: 4
        };
        return supertest(app)
          .post(`/api/reviews`)
          .set("Authorization", `Bearer ${authToken}`)
          .send(xssFandom)
          .then((_) => {
            return supertest(app)
              .get("/api/reviews/1")
              .then((result) => {
                expect(result.body.title).to.eql(
                  'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
                );
                expect(result.body.content).to.eql(
                    `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
              )});
          });
      });
  });
});
