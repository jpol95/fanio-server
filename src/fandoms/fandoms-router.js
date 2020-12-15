const express = require("express");
const FandomsService = require("./fandoms-service");
const jsonParser = express.json()
const fandomsRouter = express.Router();

const loggedInUser = 1; //this field will disappear once you introduce login

fandomsRouter.route("/")
.get((req, res, next) => {
  const db = req.app.get("db");
  FandomsService.getFandomsByUser(db, loggedInUser)
  .then((fandoms) => {
        return res.status(200).json(fandoms)
  }).catch(next)
})
.post(jsonParser, (req, res, next) => {
    const db = req.app.get("db")
    const {title} = req.body
    if (!title) return res.status(400).json({error: 'Must provide title for fandom'})
    FandomsService
})

const checkFandomExists = (req, res, next) => {};
