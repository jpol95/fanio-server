const express = require("express");
const FandomsService = require("./users-service");
const jsonParser = express.json();
const usersRouter = express.Router();
const path = require('path')
const {requireAuth} = require("../middleware/jwt-auth")

//this field will disappear once you introduce login

  usersRouter
  .route("/loggedIn")
  .get(requireAuth, (req, res, next) => {
    return res.status(200).json({userId: req.user.id})
  })

  module.exports = usersRouter