const express = require("express");
const SectionsService = require("./sections-service");
const jsonParser = express.json();
const sectionsRouter = express.Router();
const InstallmentsService = require("../installments/installments-service");
const typeList = require("../../type-list");
const { json } = require("express");

const loggedInUser = 1; //this field will disappear once you introduce login

const setType = (req, res, next) => {
  const db = req.app.get("db");
  const installmentId = req.params.installmentId;
  InstallmentsService.getInstallmentType(db, installmentId).then((type) => {
    res.type = typeList[type];
    if (req.params.sectionId) {
      res.tableName = typeList[type].subName + "s";
      res.parent = typeList[type].sectionName;
    } else {
      res.tableName = typeList[type].sectionName +"s";
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
    SectionsService.getSectionsByParent(db, [res.parent, parentId], res.tableName)
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
    if (!order || !Number.isInteger(order) || order < 0 )
        return res.status(400)/json({ error: 'Order is required and must be an integer above 0'})
    const section = { title, type, [`${res.parent}Id`]: parentId };
    SectionsService.insertSection(db, section, res.tableName)
      .then((section) => res.status(201).json(section))
      .catch(next);
  });

sectionsRouter
  .route("/:elementId")
  .all(checkSectionExists)
  .all(setType)
  .get((req, res, next) => {
    return res.status(200).json(res.section);
  })
  .delete((req, res, next) => {
    const db = req.app.get("db");
    const { id } = req.section;
    SectionsService.deleteSection(db, id, res.tableName)
      .then(() => res.status(204).end())
      .catch(next);
  })
  .patch((req, res, next) => {
    const db = req.app.get("db");
    const { title, type } = req.body;
    const newInfo = { title };
    if (!title && !type)
      return res.status(400).json({ error: "Missing a required field(s)" });
    SectionsService.updateSection(db, res.section.id, newInfo, res.tableName)
      .then((section) => {
        return res.status(200).json(section);
      })
      .catch(next);
  });

//check if you should be returning the thing you're updating

async function checkSectionExists(req, res, next) {
  try {
    const db = req.app.get("db")
    const id = req.params.elementId
    const section = await SectionsService.getSectionById(db, id, res.tableName);
    if (!section) return res.status(400).json({ error: "Section not found" });
    res.section = section;
    next();
  } catch (error) {
    next(error);
  }
}
