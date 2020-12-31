const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../src/app");
const knex = require("knex");
const testHelper = require("./fandoms.fixtures");

const authToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MDg3NjAyNjIsInN1YiI6ImtpbmdidW1paSJ9.H6qR3kpROuueininbMukdIjzA00Af5Q-PcTh_c59O1Q`;
const wrongAuthToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2MDg4NDQ4NTYsInN1YiI6ImFkbWlyYWx6aGFvbyJ9.PT5qFdrnfZItlDC9T0jyS3b40HeefCKcnM5xXXISfUA`;

describe("users-endpoints", () => {
  let db = knex({
    client: "pg",
    connection: process.env.TEST_DATABASE_URL,
  });
  app.set("db", db);
  before("delete users before starting", () => {
    return testHelper.cleanUp(db);
  });
  afterEach("clean up database after each test", () => {
    return testHelper.cleanUp(db);
  });
  after("destroy database", () => db.destroy());
  context("users table has data in it", () => {
      beforeEach("seed data", () => testHelper.seedDataBase(db))
    it("GET /api/users/user/:userId returns 200 and user information", () => {
        const testUserId = 1
        const expected = {
            id: 1,
            username: "kingbumii",
            fullname: "Jesse A Pollack",
            education: "Purple University",
            interests: "skating,softball,listending to show tunes,knitting",
            city: "Gallifrey",
          }
        return supertest(app)
        .get(`/api/users/user/${testUserId}`)
        .expect(200, expected)
    })
    it("PATCH /api/users/user/:userId returns 200 and updated user information", () => {
        const testUserId = 1
        const userToUpdate = {
            fullname: "Update Pollack",
            education: "Update University",
            interests: ["skating", "updating", "listending to updates", "knitting"],
            city: "Gallifrupdate",
          }
        const expected = {
            id: 1,
            username: "kingbumii",
            fullname: "Update Pollack",
            education: "Update University",
            interests: "skating,updating,listending to updates,knitting",
            city: "Gallifrupdate",
        }
        return supertest(app)
        .patch(`/api/users/user/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(userToUpdate)
        .expect(200, expected)
    })
    it("DELETE /api/users/user/:userId returns 204 and deletes the specified user", () => {
        const testUserId = 1
        return supertest(app)
        .delete(`/api/users/user/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204)
        .then(() => {
            return supertest(app)
            .get(`/api/users/user/${testUserId}`)
            .expect(400)
        })
    })
    
  })
  context("no data is present", () => {
    it("POST /api/users returns 201 and posts a new user", () => {
        const userToInsert = {
            username: "user3",
            fullname: "Jesse A Pollack",
            password: "Password1@",
            education: "Purple University",
            interests: ["skating", "softball", "listending to show tunes", "knitting"],
            city: "Gallifrey",
          }
        return supertest(app)
        .post(`/api/users`)
        .send(userToInsert)
        .expect(201)
        .then(user => {
            return supertest(app)
            .get(`/api/users/user/1`)
            .expect(user.body)
        })
    })
  })
})