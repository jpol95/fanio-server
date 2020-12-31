const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../src/app");
const knex = require("knex");
const testHelper = require("./fandoms.fixtures");
const { post } = require("../src/app");

const authToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MDg3NjAyNjIsInN1YiI6ImtpbmdidW1paSJ9.H6qR3kpROuueininbMukdIjzA00Af5Q-PcTh_c59O1Q`;
const wrongAuthToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2MDg4NDQ4NTYsInN1YiI6ImFkbWlyYWx6aGFvbyJ9.PT5qFdrnfZItlDC9T0jyS3b40HeefCKcnM5xXXISfUA`;

describe("auth-endpoints", () => {
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
  context("auth table has data in it", () => {
      beforeEach("seed data", () => testHelper.seedDataBase(db))
      it("POST /login should return jwt token", () => {
          const login = {
              username: 'kingbumii', 
              password: 'password'
          }
          return supertest(app)
          .post(`/api/auth/login`)
          .send(login)
          .then(response => {
              expect(response.body.authToken).to.be.a('string')
          })
      })
      it("POST /login should return 400 if password incorrect", () => {
        const login = {
            username: 'kingbumii', 
            password: 'wrongpassword'
        }
        return supertest(app)
        .post(`/api/auth/login`)
        .send(login)
        .expect(400)
    })
    })
})