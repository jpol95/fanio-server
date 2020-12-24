const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../src/app");
const knex = require("knex");
const testHelper = require("./fandoms.fixtures")

describe("fandoms-endpoints", () => {
  db = knex({
    client: "pg",
    connection: process.env.TEST_DB_URL,
  });
  app.set("db", db);
  before("delete fandoms before starting", () => db.raw("truncate fandoms, installments, sections, subs;"));
  afterEach("clean up database after each test", () => {
    return db.raw("truncate users, fandoms, installments, sections, subs, reviews, tags, review_tag_rels;");
  })
    after("destroy database", () => db.destroy())
    context("fandoms table has data in it", () => {
      beforeEach("insert fandoms into db", () => testHelper.seedDataBase(db))
      it("GET /api/fandoms/:fandomId should return 200 with specific fandom", () => {
        const testId = 4;
        const result = { id: 4, title: "Buffy the Vampire Slayer", userId: 1 };
        return supertest(app)
        .get(`/api/fandoms/${testId}`)
        .expect(200, result);
      });
      it("GET /api/fandoms/users/:userId should return 200 with full fandomList", () => {
            const testUser = 1
            const expected = testHelper.fandomList.slice(0,5)
            return supertest(app)
            .get(`/api/fandoms/users/${testUser}`)
            .expect(200, expected)
      })
      it("GET /api/fandoms/users/:userId should return 400 if requested user does not exist", () => {
        const testUser = 5
        return supertest(app)
        .get(`/api/fandoms/users/${testUser}`)
        .expect(400)
  })
    });
  });


//create db
//after destroy
//before truncate db
//aftereach truncate data
//beforeeach insert data(in context of data present)
//context data present --> get specific fandom, get all fandoms 200, should return 400 if user not there, delete fandom 200, patch should return 400 if no required data present, should return 200 if some required data present)
//if no data present --> post should return 200 if required fields present, should return 400 if required field missing, get empty array if no data present, get, delete, and patch should return 400
//don't forget to test for auth too !