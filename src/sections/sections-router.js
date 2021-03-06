const express = require("express");
const SectionsService = require("./sections-service");
const jsonParser = express.json();
const sectionsRouter = express.Router();
const { json } = require("express");
const { requireLoggedInUser, requireAuth } = require("../middleware/jwt-auth");

const setType = (req, res, next) => {
  const urlArray = req.originalUrl.split("/");
  const db = req.app.get("db");
  if (urlArray.includes("sub")) {
    res.tableName = "subs";
    res.parent = "section";
  } else {
    res.tableName = "sections";
    res.parent = "installment";
  }
  next();
};

sectionsRouter
  .route(["/section/parent/:installmentId", "/sub/parent/:sectionId"])
  .all(setType)
  .post(requireAuth, requireLoggedInUser, jsonParser, (req, res, next) => {
    const db = req.app.get("db");
    const parentId = req.params[`${res.parent}Id`];
    const sections = [];
    for (section of req.body) {
      const { title, order } = section;
      if (!title)
        return res
          .status(400)
          .json({ error: "Must provide title for section" });
      if (!order || !Number.isInteger(Number(order)) || order < 0)
        return res
          .status(400)
          .json({ error: "Order is required and must be an integer above 0" });
      const sectionEl = { title, order, [`${res.parent}Id`]: parentId };
      sections.push(sectionEl);
    }
    SectionsService.insertSections(db, sections, res.tableName)
      .then((sections) => res.status(201).json(sections))
      .catch(next);
  })
  .get((req, res, next) => {
    const db = req.app.get("db");
    const parentId = req.params[`${res.parent}Id`];
    SectionsService.getSectionsByParent(
      db,
      [res.parent, parentId],
      res.tableName
    )
      .then((sections) => {
        return res.status(200).json(sections);
      })
      .catch(next);
  });

sectionsRouter
  .route(["/section/:sectionId", "/sub/:subId"])
  .all(setType)
  .all(checkSectionExists)
  .delete(requireAuth, requireLoggedInUser, (req, res, next) => {
    const db = req.app.get("db");
    const { id } = res.section;
    SectionsService.deleteSection(db, id, res.tableName)
      .then(() => res.status(204).end())
      .catch(next);
  })
  .patch(requireAuth, requireLoggedInUser, jsonParser, (req, res, next) => {
    const db = req.app.get("db");
    const { title, order, reviewId } = req.body;
    const newInfo = { title, order, reviewId };
    if (!title && !order && !reviewId)
      return res.status(400).json({ error: "Missing a required field(s)" });

    if (!!order && (!Number.isInteger(Number(order)) || order < 0))
      return res
        .status(400)
        .json({ error: "Order is required and must be an integer above 0" });
    SectionsService.updateSection(db, res.section.id, newInfo, res.tableName)
      .then((section) => {
        return res.status(200).json(section);
      })
      .catch(next);
  })
  .get((req, res, next) => {
    return res.status(200).json(res.section);
  });

async function checkSectionExists(req, res, next) {
  try {
    const db = req.app.get("db");
    const id = req.params.sectionId || req.params.subId;
    const section = await SectionsService.getSectionById(db, id, res.tableName);
    if (!section) return res.status(400).json({ error: "Section not found" });
    res.section = section;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = sectionsRouter;
