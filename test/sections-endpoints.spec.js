const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../src/app");
const knex = require("knex");
const testHelper = require("./fandoms.fixtures");

const authToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MDg3NjAyNjIsInN1YiI6ImtpbmdidW1paSJ9.H6qR3kpROuueininbMukdIjzA00Af5Q-PcTh_c59O1Q`;
const wrongAuthToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE2MDg4NDQ4NTYsInN1YiI6ImFkbWlyYWx6aGFvbyJ9.PT5qFdrnfZItlDC9T0jyS3b40HeefCKcnM5xXXISfUA`;

describe("sections-endpoints", () => {
  let db = knex({
    client: "pg",
    connection: process.env.TEST_DATABASE_URL,
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
    beforeEach("insert installments into db", () =>
      testHelper.seedDataBase(db)
    );
    it("GET /api/sections/section/:sectionId should return 200 and specific section", () => {
      const testSectionId = 4;
      const expected = {
        id: 4,
        title: `Harry Potter and the Case of Jesse's Missing Serotonin`,
        order: 1,
        installmentId: 6,
        reviewId: null,
      };
      return supertest(app)
        .get(`/api/sections/section/${testSectionId}`)
        .expect(200, expected);
    });
    it("GET /api/sections/section/parent/:installmentId should return 200 and delete specified section", () => {
      const testInstallmentId = 4;
      const expected = testHelper.sectionList.filter(
        (section) => section.installmentId === testInstallmentId
      );
      return supertest(app)
        .get(`/api/sections/section/parent/${testInstallmentId}`)
        .expect(200, expected);
    });
    it("DELETE /api/sections/section/:sectionId should return 204 and delete section in database", () => {
      const testSectionId = 4;
      const testInstallmentId = 6;
      const expected = testHelper.sectionList.filter(
        (section) =>
          section.id !== testSectionId &&
          section.installmentId === testInstallmentId
      );
      return supertest(app)
        .delete(`/api/sections/section/${testSectionId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204)
        .then(() => {
          return supertest(app)
            .get(`/api/sections/section/parent/${testInstallmentId}`)
            .expect(expected);
        });
    });
    it("DELETE /api/sections/section/:sectionId should return 401 if user is unauthorized", () => {
      const testSectionId = 4;
      return supertest(app)
        .delete(`/api/sections/section/${testSectionId}`)
        .set("Authorization", `Bearer ${wrongAuthToken}`)
        .expect(401);
    });
    it("PATCH /api/sections/section/:sectionId should return 200 and updated section", () => {
      const testSectionId = 4;
      const updatedSection = {
        title: `This is updated`,
        order: 10,
        reviewId: 19,
      };
      const expected = {
        ...testHelper.sectionList[3],
        ...updatedSection,
      };
      return supertest(app)
        .patch(`/api/sections/section/${testSectionId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedSection)
        .expect(200)
        .then(() => {
          return supertest(app)
            .get(`/api/sections/section/${testSectionId}`)
            .expect(expected);
        });
    });
    it("PATCH /api/sections/section/:sectionId should return 400 if no required sections are provided", () => {
      const testSectionId = 4;
      const updatedSection = {
        wrongSection1: `This is updated`,
        wrongSection2: 10,
        wrongSection3: 19,
      };
      return supertest(app)
        .patch(`/api/sections/section/${testSectionId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedSection)
        .expect(400);
    });
    it("PATCH /api/sections/section/:sectionId should return 400 if order is not valid", () => {
      const testSectionId = 4;
      const updatedSection = {
        title: `This is updated`,
        order: -5,
        reviewId: 19,
      };
      return supertest(app)
        .patch(`/api/sections/section/${testSectionId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedSection)
        .expect(400);
    });
    const requiredFields = ["title", "order", "reviewId"];
    for (let field of requiredFields) {
      const editedSection = {
        title: `This is updated`,
        order: 10,
        reviewId: 19,
      };
      delete editedSection[field];
      const expected = {
        ...testHelper.sectionList[3],
        ...editedSection,
      };
      it("PATCH /api/sections/:sectionId should return 200 and updated section if at least one required field is provided", () => {
        const testSectionId = 4;
        return supertest(app)
          .patch(`/api/sections/section/${testSectionId}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send(editedSection)
          .expect(200)
          .then((result) => {
            return supertest(app)
              .get(`/api/sections/section/${testSectionId}`)
              .expect(expected);
          });
      });
    }
    it("PATCH /api/sections/section/:sectionId should return 401 if user is not authorized", () => {
      const testSectionId = 4;
      const updatedSection = {
        title: `This is updated`,
        order: 5,
        reviewId: 19,
      };
      return supertest(app)
        .patch(`/api/sections/section/${testSectionId}`)
        .set("Authorization", `Bearer ${wrongAuthToken}`)
        .send(updatedSection)
        .expect(401);
    });
  });
  context("sections table contains no data", () => {
    beforeEach("insert installments", () => testHelper.seedInstallments(db));
    it("GET /api/sections/section/:sectionId should return 400 when no data is present", () => {
      const testSectionId = 4;
      return supertest(app)
        .get(`/api/sections/section/${testSectionId}`)
        .expect(400);
    });
    it("GET /api/sections/section/parent/:installmentId should return 400 when no data is present", () => {
      const testInstallmentId = 4;
      return supertest(app)
        .get(`/api/sections/section/parent/${testInstallmentId}`)
        .expect(200, []);
    });
    it("DELETE /api/sections/section/:sectionId should return 400 when no data is present", () => {
      const testSectionId = 4;
      return supertest(app)
        .delete(`/api/sections/section/${testSectionId}`)
        .expect(400);
    });
    it("POST /api/sections/section/:sectionId should return 200 and inserted section", () => {
      const testInstallmentId = 4;
      const sectionToInsert = [
        {
          title: `This is updated`,
          order: 10,
        },
      ];
      const expected = {
        ...sectionToInsert[0],
        id: 1,
        installmentId: 4,
        reviewId: null,
      };
      return supertest(app)
        .post(`/api/sections/section/parent/${testInstallmentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(sectionToInsert)
        .expect(201)
        .then(() => {
          return supertest(app).get(`/api/sections/section/1`).expect(expected);
        });
    });
    const requiredFields = ["title", "order"];
    for (let field of requiredFields) {
      const testInstallmentId = 4;
      const sectionToInsert = [
        {
          title: `This is updated`,
          order: 10,
        },
      ];
      delete sectionToInsert[0][field];
      it("POST /api/sections/:sectionId should return 400 when a required field is missing", () => {
        const testSectionId = 4;
        return supertest(app)
          .post(`/api/sections/section/parent/${testInstallmentId}`)
          .set("Authorization", `Bearer ${authToken}`)
          .send(sectionToInsert)
          .expect(400);
      });
    }
    it("POST /api/sections/section/:sectionId should return 200 and inserted section", () => {
      const testInstallmentId = 4;
      const sectionToInsert = [
        {
          title: `This is updated`,
          order: -5,
        },
      ];
      return supertest(app)
        .post(`/api/sections/section/parent/${testInstallmentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(sectionToInsert)
        .expect(400);
    });
    it("POST /api/sections/section/:sectionId should return 200 and inserted section", () => {
      const testInstallmentId = 4;
      const sectionToInsert = [
        {
          title: `This is updated`,
          order: 10,
        },
      ];
      return supertest(app)
        .post(`/api/sections/section/parent/${testInstallmentId}`)
        .set("Authorization", `Bearer ${wrongAuthToken}`)
        .send(sectionToInsert)
        .expect(401);
    });
    it("PATCH /api/sections/section/:sectionId should return 400 when no data is present", () => {
      const testSectionId = 4;
      const updatedSection = {
        title: `This is updated`,
        order: 5,
        reviewId: 19,
      };
      return supertest(app)
        .delete(`/api/sections/section/${testSectionId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedSection)
        .expect(400);
    });
    it("POST /sections/parent/:installmentId sanitizes inputs that contain xss", () => {
      const testInstallmentId = 4;
      const xssFandom = [
        {
          title: 'Naughty naughty very naughty <script>alert("xss");</script>',
          order: 10,
        },
      ];
      return supertest(app)
        .post(`/api/sections/section/parent/${testInstallmentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(xssFandom)
        .expect(201)
        .then((_) => {
          return supertest(app)
            .get("/api/sections/section/1")
            .then((result) => {
              expect(result.body.title).to.eql(
                'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
              );
            });
        });
    });
  });
});
