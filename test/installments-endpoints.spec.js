//create db
//after destroy
//before truncate db
//aftereach truncate data
//beforeeach insert data(in context of data present)
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
  context("installments table has data in it", () => {
    beforeEach("insert installments into db", () => testHelper.seedDataBase(db));
    it("GET /api/installments/:installmentId should return 200 when installment present", () => {
        const testInstallmentId = 4 
        const expected = { id: 4, title: "Buffy Comic Series", type: "Comic series", fandomId: 4 }
        return supertest(app)
        .get(`/api/installments/${testInstallmentId}`)
        .expect(200, expected)
    })
    it("GET /api/installments/parent/:fandomId should return 200 with installment list", () => {
        const testFandomId = 4
        const expected = [{ id: 3, title: "Buffy TV Series", type: "Show", fandomId: 4 },
        { id: 4, title: "Buffy Comic Series", type: "Comic series", fandomId: 4 }]
        return supertest(app)
        .get(`/api/installments/parent/${testFandomId}`)
        .expect(200, expected)
    })
    it("DELETE /api/installments/:installmentId should return 204 and delete installment from database", () => {
        const testInstallmentId = 4
        const testFandomId = 4
        const expected = [{ id: 3, title: "Buffy TV Series", type: "Show", fandomId: 4 }]
        return supertest(app)
        .delete(`/api/installments/${testInstallmentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204)
        .then(() => {
            return supertest(app)
            .get(`/api/installments/parent/${testFandomId}`)
            .expect(200, expected)
        })
    })
    it("DELETE /api/installments/:installmentId should return 401 if user is unauthorized", () => {
        const testInstallmentId = 4
        return supertest(app)
        .delete(`/api/installments/${testInstallmentId}`)
        .set('Authorization', `Bearer ${wrongAuthToken}`)
        .expect(401)
    })
    it("PATCH /api/installments/:installmentId should return 200 and updated installment", () => {
        const testInstallmentId = 4
        const editedInstallment = {title: "Buffy Comic Series Updated", type: "Movie series" }
        const expected = {id: 4, title: "Buffy Comic Series Updated", type: "Movie series", fandomId: 4}
        return supertest(app)
        .patch(`/api/installments/${testInstallmentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(editedInstallment)
        .expect(200)
        .then(() => {
            return supertest(app)
            .get(`/api/installments/${testInstallmentId}`)
            .expect(200, expected)

        })
    })
  })
})

//context data present --> 
//get specific installment 200, check
//get all installments 200, check
//delete installment 200, check
//should return 401 if user unauthorized check
//patch should return 200 if all required data present
//patch should return 400 if no required data present, 
//patch should return 400 if invalid type submitted
//patch should return 200 if some required data present
//patch should return 401 if user is unauthorized

//if no data present --> 
//get specific installment should return 400 if installment not there, 
//get all installments 400 if parent fandom does not exist
//delete should return 400 if installment not found, 
//post should return 200 if required fields present,
//post should return 400 if installment type is invalid
//post should return 400 if required field missing, 
//post should return 401 if user is unauthorized
//get empty array if no data present,
//get, delete, and patch should return 400
//don't forget to test for auth too, and to test for xss
