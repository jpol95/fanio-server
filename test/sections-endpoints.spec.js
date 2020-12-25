const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../src/app");
const knex = require("knex");
const testHelper = require("./fandoms.fixtures");

const authToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MDg3NjAyNjIsInN1YiI6ImtpbmdidW1paSJ9.H6qR3kpROuueininbMukdIjzA00Af5Q-PcTh_c59O1Q`;
const wrongAuthToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2MDg4NDQ4NTYsInN1YiI6ImFkbWlyYWx6aGFvbyJ9.PT5qFdrnfZItlDC9T0jyS3b40HeefCKcnM5xXXISfUA`;

describe.only("fandoms-endpoints", () => {
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
  context("sections table has data in it", () => {
    beforeEach("insert installments into db", () => testHelper.seedDataBase(db));
    it("GET /api/sections/section/:sectionId", () => {
        const testSectionId = 4
        const expected =  {
            id: 4,
            title: `Harry Potter and the Case of Jesse's Missing Serotonin`,
            order: 1,
            installmentId: 6,
            reviewId: null,
          }
        return supertest(app)
        .get(`/api/sections/section/${testSectionId}`)
        .expect(200, expected)

    })
    it("GET /api/sections/section/parent/:installmentId", () => {
        const testInstallmentId = 4
        const expected = testHelper.sectionList.filter(section => section.installmentId === testInstallmentId)
        return supertest(app)
        .get(`/api/sections/section/parent/${testInstallmentId}`)
        .expect(200, expected)
    })
  })
})

//context data present --> 
//get specific section 200, check
//get all sections 200
//delete section 200, 
//delete section should return 401 if user unauthorized
//patch should return 200 if all required data present 
//patch should return 400 if no required data present 
//patch should return 400 if invalid type submitted 
//patch should return 200 if some required data present
//patch should return 401 if user is unauthorized 

//if no data present --> 
//get specific section should return 400 if section not ther
//get all sections 400 if parent installment does not exist
//delete should return 400 if section not found 
//post should return 200 if required fields present
//post should return 400 if section order is invalid
//post should return 400 if required field missing 
//post should return 401 if user is unauthorized 
//get empty array if no data present 
//get, delete, and patch should return 400 
//test for xss
