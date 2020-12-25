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
    it.only("PATCH /api/reviews/:reviewId should return 400 if required data is not present", () => {
      const testReview = 9;
      const updatedReview = { wrongField: "This is not the right field!" };
      return supertest(app)
        .patch(`/api/reviews/${testReview}`)
        .set(`Authorization`, `Bearer ${authToken}`)
        .send(updatedReview)
        .expect(400);
    });
    it("PATCH /api/fandoms/:fandomId should return 401 if the user is not authorized", () => {
      const testFandom = 3;
      const updatedFandom = { wrongField: "This is not the right field!" };
      return supertest(app)
        .patch(`/api/fandoms/${testFandom}`)
        .set(`Authorization`, `Bearer ${wrongAuthToken}`)
        .send(updatedFandom)
        .expect(401);
    });
  });
  context("No data present", () => {
    beforeEach("insert users", () => testHelper.seedUsers(db));
    it("POST /api/fandoms/users/:userId should return 201 if fields are provided and user is authorized", () => {
      const userId = 1;
      const fandomId = 1;
      const fandomToInsert = { title: "This is a new fandom" }; //should adding the userId be handled in the server?
      const expected = { id: 1, title: "This is a new fandom", userId: 1 };
      return supertest(app)
        .post(`/api/fandoms/users/${userId}`)
        .set(`Authorization`, `Bearer ${authToken}`)
        .send(fandomToInsert)
        .expect(201)
        .then((fandom) => {
          return supertest(app)
            .get(`/api/fandoms/${fandomId}`)
            .expect(200, expected);
        });
    });
    it("POST /api/fandoms/users/:userId should return 400 if required field is not provided", () => {
      const userId = 1;
      const fandomId = 1;
      const fandomToInsert = { wrongField: "It's not right" }; //should adding the userId be handled in the server?
      return supertest(app)
        .post(`/api/fandoms/users/${userId}`)
        .set(`Authorization`, `Bearer ${authToken}`)
        .send(fandomToInsert)
        .expect(400);
    }),
      it("POST /api/fandoms/users/:userId should return 401 if user is not authorized", () => {
        const userId = 1;
        const fandomToInsert = { title: "I'm not an authorized user" }; //should adding the userId be handled in the server?
        return supertest(app)
          .post(`/api/fandoms/users/${userId}`)
          .set(`Authorization`, `Bearer ${wrongAuthToken}`)
          .send(fandomToInsert)
          .expect(401);
      }),
      it("GET /api/fandoms/users/:userId should return 201 with an empty array if no data present", () => {
        const userId = 1;
        return supertest(app)
          .get(`/api/fandoms/users/${userId}`)
          .expect(200, []);
      }),
      it("GET /api/fandoms/:fandomId should return 400 when no data present", () => {
        const fandomId = 1;
        return supertest(app)
        .get(`/api/fandoms/${fandomId}`)
        .expect(400);
      }),
      it("DELETE /api/fandoms/:fandomId should return 400 when no data present", () => {
        const fandomId = 1;
        return supertest(app)
        .get(`/api/fandoms/${fandomId}`)
        .set(`Authorization`, `Bearer ${authToken}`)
        .expect(400);
      }),
      it("PATCH /api/fandoms/:fandomId should return 400 when no data present", () => {
        const fandomId = 1;
        return supertest(app)
        .get(`/api/fandoms/${fandomId}`)
        .set(`Authorization`, `Bearer ${authToken}`)
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
