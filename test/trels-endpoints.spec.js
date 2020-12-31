const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../src/app");
const knex = require("knex");
const testHelper = require("./fandoms.fixtures");
const { post } = require("../src/app");

const authToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MDg3NjAyNjIsInN1YiI6ImtpbmdidW1paSJ9.H6qR3kpROuueininbMukdIjzA00Af5Q-PcTh_c59O1Q`;
const wrongAuthToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2MDg4NDQ4NTYsInN1YiI6ImFkbWlyYWx6aGFvbyJ9.PT5qFdrnfZItlDC9T0jyS3b40HeefCKcnM5xXXISfUA`;

describe("trels-endpoints", () => {
  let db = knex({
    client: "pg",
    connection: process.env.TEST_DATABASE_URL,
  });
  app.set("db", db);
  before("delete data before starting", () => {
    return testHelper.cleanUp(db);
  });
  afterEach("clean up database after each test", () => {
    return testHelper.cleanUp(db);
  });
  after("destroy database", () => db.destroy());
  context("trels table has data in it", () => {
      beforeEach("seed data", () => testHelper.seedDataBase(db))
      it("GET /api/trels/ should return 200 and a list of trels", () => {
          return supertest(app)
          .get(`/api/trels`)
          .expect(testHelper.reviewTagList)
      })
      it("POST /api/tags/ should return 201 and created tag", () => {
          const reviewId = 20
          const trel = [{
              tagId: 5, 
          }]
          return supertest(app)
          .post(`/api/trels/${reviewId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(trel)
          .expect(201)
          .then(trel => {
              return supertest(app)
              .get(`/api/trels`)
              .expect([...testHelper.reviewTagList, ...trel.body])
          })
      })
      it("POST /api/tags/ should return 401 when user is unauthorized", () => {
        const reviewId = 20
        const trel = [{
            tagId: 5, 
        }]
        return supertest(app)
        .post(`/api/trels/${reviewId}`)
        .set('Authorization', `Bearer ${wrongAuthToken}`)
        .send(trel)
        .expect(401)
    })
      it("GET /api/trels/:tagId/:reviewId should return 200 and the created tag", () => {
          const testTagId = 4
          const reviewId = 12
        return supertest(app)
        .get(`/api/trels/${testTagId}/${reviewId}`)
        .expect(200, testHelper.reviewTagList[3])
    })
    it("DELETE /api/trels/:reviewId should return 204 and delete all trels associated with specified review", () => {
        const reviewId = 12
        const expected = testHelper.reviewTagList.filter(trel => trel.reviewId !== reviewId)
      return supertest(app)
      .delete(`/api/trels/${reviewId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204)
      .then(() => {
          return supertest(app)
          .get(`/api/trels`)
          .expect(expected)
      })
  })
  it("DELETE /api/trels/:reviewId should return 401 if user is unauthorized", () => {
    const reviewId = 12
  return supertest(app)
  .delete(`/api/trels/${reviewId}`)
  .set('Authorization', `Bearer ${wrongAuthToken}`)
  .expect(401)
})
  
  })
})