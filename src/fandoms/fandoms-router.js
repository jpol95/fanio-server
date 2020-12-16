const express = require("express");
const FandomsService = require("./fandoms-service");
const jsonParser = express.json();
const fandomsRouter = express.Router();

const loggedInUser = 1; //this field will disappear once you introduce login

fandomsRouter
  .route("/")
  .get((req, res, next) => {
    const db = req.app.get("db");
    FandomsService.getFandomsByUser(db, loggedInUser)
      .then((fandoms) => {
        return res.status(200).json(fandoms);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const db = req.app.get("db");
    const { title } = req.body;
    if (!title)
      return res.status(400).json({ error: "Must provide title for fandom" });
    const fandom = { title };
    fandom.userId = loggedInUser;
    FandomsService.insertFandom(db, userId)
      .then((fandom) => res.status(201).json(fandom))
      .catch(next);
  });

fandomsRouter.route("/:fandomId")
.all(checkFandomExists)
.get((req, res, next) => {
    return res.status(200).json(res.fandom)
})
.delete((req, res, next) => {
    const db = req.app.get("db")
    const {id} = req.fandom
    FandomsService.deleteFandom()
    .then(() => res.status(204).end())
    .catch(next)
})
.patch((req, res, next) => {
    const db = req.app.get("db")
    const {title} = req.body
    const newInfo = {title}
    if (!title) return res.status(400).json({error: 'Missing required fields'})
    FandomsService.updateFandom(db, res.fandom.id, newInfo)
    .then(fandom => {
        return res.status(200).json(fandom)
    }).catch(next)
})

//check if you should be returning the thing you're updating

async function checkFandomExists(req, res, next) {
  try {
    const fandomId = req.params.fandomId;
    const fandom = await FandomsService.getFandomById(fandomId);

    if (!fandom) return res.status(400).json({ error: "Fandom not found" });
    res.fandom = fandom;
    next();
  } catch (error) {
    next(error);
  }
}
