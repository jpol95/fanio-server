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
    });
  });


//create db
//after destroy
//before truncate db
//aftereach truncate data
//beforeeach insert data(in context of data present)
//context data present --> get specific fandom(should
//return 400 if fandom not there), get all fandoms(should
//return empty array if empty), delete fandom(should
//return 404 if fandom not there), patch fandom(should return 400 if fandom not there,
//should return 400 if no required data present, should return 200 if some required data present)
//if no data present --> post, get empty array if no data present, get should return 404
