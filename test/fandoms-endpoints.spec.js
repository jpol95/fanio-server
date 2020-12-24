const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../src/app");
const knex = require("knex");
const testHelper = require("./fandoms.fixtures");

const authToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MDg3NjAyNjIsInN1YiI6ImtpbmdidW1paSJ9.H6qR3kpROuueininbMukdIjzA00Af5Q-PcTh_c59O1Q`;
const wrongAuthToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2MDg4NDQ4NTYsInN1YiI6ImFkbWlyYWx6aGFvbyJ9.PT5qFdrnfZItlDC9T0jyS3b40HeefCKcnM5xXXISfUA`;

describe("fandoms-endpoints", () => {
  db = knex({
    client: "pg",
    connection: process.env.TEST_DB_URL,
  });
  app.set("db", db);
  before("delete fandoms before starting", () => {
    return testHelper.cleanUp(db);
  });
  afterEach("clean up database after each test", () => {
    return testHelper.cleanUp(db);
  });
  after("destroy database", () => db.destroy());
  context("fandoms table has data in it", () => {
    beforeEach("insert fandoms into db", () => testHelper.seedDataBase(db));
    it("GET /api/fandoms/:fandomId should return 200 with specific fandom", () => {
      const testId = 4;
      const result = { id: 4, title: "Buffy the Vampire Slayer", userId: 1 };
      return supertest(app).get(`/api/fandoms/${testId}`).expect(200, result);
    });
    it("GET /api/fandoms/users/:userId should return 200 with full fandomList", () => {
      const testUser = 1;
      const expected = testHelper.fandomList.slice(0, 5);
      return supertest(app)
        .get(`/api/fandoms/users/${testUser}`)
        .expect(200, expected);
    });
    it("GET /api/fandoms/users/:userId should return 400 if requested user does not exist", () => {
      const testUser = 5;
      return supertest(app).get(`/api/fandoms/users/${testUser}`).expect(400);
    });
    it("DELETE /api/fandoms/:fandomId should return 200 if requested fandom exists and user is authrorized", () => {
      const testUser = 1;
      const testFandom = 3;
      const expected = [...testHelper.fandomList.slice(0, 5)];
      expected.splice(2, 1);
      //YOU ARE HERE
      return supertest(app)
        .delete(`/api/fandoms/${testFandom}`)
        .set(`Authorization`, `Bearer ${authToken}`)
        .expect(204)
        .then(() => {
          return supertest(app)
            .get(`/api/fandoms/users/${testUser}`)
            .expect(expected);
        });
    });
    it("DELETE /api/fandoms/:fandomId should return 401 if user is unauthorized", () => {
      const testFandom = 3;
      return supertest(app)
        .delete(`/api/fandoms/${testFandom}`)
        .set(`Authorization`, `Bearer ${wrongAuthToken}`)
        .expect(401);
    });
    it("PATCH /api/fandoms/:fandomId should return 200 with updated fandom if user is authorized", () => {
      const testFandom = 3;
      const updatedFandom = { title: "This is an updated fandom" };
      const expected = { id: 3, title: "This is an updated fandom", userId: 1 };
      return supertest(app)
        .patch(`/api/fandoms/${testFandom}`)
        .set(`Authorization`, `Bearer ${authToken}`)
        .send(updatedFandom)
        .expect(200, expected);
    });
    it("PATCH /api/fandoms/:fandomId should return 400 if required data is not present", () => {
      const testFandom = 3;
      const updatedFandom = { wrongField: "This is not the right field!" };
      return supertest(app)
        .patch(`/api/fandoms/${testFandom}`)
        .set(`Authorization`, `Bearer ${authToken}`)
        .send(updatedFandom)
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
          console.log(fandom.body);
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
  });
});

//create db
//after destroy
//before truncate db
//aftereach truncate data
//beforeeach insert data(in context of data present)
//context data present --> get specific fandom, get all fandoms 200, should return 400 if user not there, delete fandom 200, patch should return 400 if no required data present, should return 200 if some required data present)
//if no data present --> post should return 200 if required fields present, should return 400 if required field missing, get empty array if no data present, get, delete, and patch should return 400
//don't forget to test for auth too, and to test for xss
