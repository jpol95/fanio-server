const express = require("express");
const FandomsService = require("./fandoms-service");
const jsonParser = express.json();
const fandomsRouter = express.Router();
const path = require('path')
const {requireLoggedInUser, requireAuth} = require("../middleware/jwt-auth")

//this field will disappear once you introduce login

  fandomsRouter
  .route("/users/:userId")
  .get((req, res, next) => {
    console.log(req.params)
    const loggedInUser = req.params.userId
    const db = req.app.get("db");
    FandomsService.getFandomsByUser(db, loggedInUser)
      .then((fandoms) => {
        return res.status(200).json(fandoms);
      })
      .catch(next);
  })
  .post(requireAuth, requireLoggedInUser,  jsonParser, (req, res, next) => {
    const db = req.app.get("db");
    const { title } = req.body;
    // console.log(req.body)
    if (!title)
      return res.status(400).json({ error: "Must provide title for fandom" });
    const fandom = { title };
    fandom.userId = loggedInUser;
    // console.log(fandom)
    FandomsService.insertFandom(db, fandom)
      .then((fandom) => res.status(201).location(path.posix.join(req.originalUrl, `/${fandom.id}`)).json(fandom))
      .catch(next);
  });

fandomsRouter.route("/:fandomId")
.all(checkFandomExists)
.get((req, res, next) => {
    return res.status(200).json(res.fandom)
})

fandomsRouter.route("/users/:userId/:fandomId")
.all(checkFandomExists)
.delete(requireAuth, requireLoggedInUser, (req, res, next) => {
    const db = req.app.get("db")
    const {id} = res.fandom
    FandomsService.deleteFandom(db, id)
    .then(() => res.status(204).end())
    .catch(next)
})
.patch(requireAuth, requireLoggedInUser, jsonParser, (req, res, next) => {
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
    const db = req.app.get("db")
    const fandomId = req.params.fandomId;
    const fandom = await FandomsService.getFandomById(db, fandomId);

    if (!fandom) return res.status(400).json({ error: "Fandom not found" });
    res.fandom = fandom;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = fandomsRouter