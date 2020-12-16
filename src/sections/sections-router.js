const express = require("express");
const SectionsService = require("./sections-service");
const jsonParser = express.json();
const sectionsRouter = express.Router();
const InstallmentsService = require("../installments/installments-service");
const typeList = require("../../type-list");

const loggedInUser = 1; //this field will disappear once you introduce login

const setType = (req, res, next) => {
  const db = req.app.get("db");
  const installmentId = req.params.installmentId;
  InstallmentsService.getInstallmentType(db, installmentId).then((type) => {
    res.type = typeList[type];
    if (req.params.sectionId) {
      res.tableName = typeList[type].subName;
      res.parent = "section";
    } else {
      res.tableName = typeList[type].sectionName;
      res.parent = "installment";
    }
  });
};

sectionsRouter
  .route("/")
  .all(setType)
  .get((req, res, next) => {
    const db = req.app.get("db");
    const parentId = req.params[`${res.parent}Id`];
    SectionsService.getSectionsByInstallment(db, parentId, res.tableName)
      .then((sections) => {
        return res.status(200).json(sections);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const db = req.app.get("db");
    const { title, type } = req.body;
    const parentId = req.params[`${res.parent}Id`];
    if (!title)
      return res.status(400).json({ error: "Must provide title for section" });
    if (!type || !validTypes.includes(type))
      return res.status(400).json({ error: "Invalid Type" });
    const section = { title, type, [`${res.parent}Id`]: parentId };
    SectionsService.insertSection(db, parentId, section)
      .then((section) => res.status(201).json(section))
      .catch(next);
  });

sectionsRouter
  .route("/:sectionId")
  .all(checkSectionExists)
  .get((req, res, next) => {
    return res.status(200).json(res.section);
  })
  .delete((req, res, next) => {
    const db = req.app.get("db");
    const { id } = req.section;
    SectionsService.deleteSection(db, id)
      .then(() => res.status(204).end())
      .catch(next);
  })
  .patch((req, res, next) => {
    const db = req.app.get("db");
    const { title, type } = req.body;
    const newInfo = { title };
    if (!title && !type)
      return res.status(400).json({ error: "Missing a required field(s)" });
    SectionsService.updateSection(db, res.section.id, newInfo)
      .then((section) => {
        return res.status(200).json(section);
      })
      .catch(next);
  });

//check if you should be returning the thing you're updating

async function checkSectionExists(req, res, next) {
  try {
    const sectionId = req.params.sectionId;
    const section = await SectionsService.getSectionById(sectionId);

    if (!section) return res.status(400).json({ error: "Section not found" });
    res.section = section;
    next();
  } catch (error) {
    next(error);
  }
}
