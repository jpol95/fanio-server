const express = require("express");
const UsersService = require("./users-service");
const jsonParser = express.json();
const usersRouter = express.Router();
const path = require('path')
const {requireAuth} = require("../middleware/jwt-auth")

//this field will disappear once you introduce login

const invalidPassword = (password) => {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters'
    }
   if (password.startsWith(' ')) {
     return 'Password must not start or end with empty spaces'
   }
   if (password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/))
    return `Must provide a password with at least 8 characters`
  }

  usersRouter
  .route("/loggedIn")
  .get(requireAuth, (req, res, next) => {
    return res.status(200).json({userId: req.user.id})
  })

  usersRouter
  .route("/")
  .post(jsonParser, (req, res, next) => {
      const db = req.app.get('db')
      const {username, password} = req.body
      const requiredFields = {username, password}
      for (let field of Object.keys(requiredFields)){
          if (!requiredFields[field]) return res.status(400).json({error: `Must provide a ${field}`})
      }
      if (invalidPassword(password)) return res.status(400).json({error: invalidPassword(password)})
      const {name, interests, city, education} = req.body
      let optionalFields = {name, interests, city, education}
      for (let field in optionalFields) if (!optionalFields[field]) delete optionalFields[field]
      const user = {...optionalFields, ...requiredFields}
      UsersService.hashPassword(password)
      .then(password => {
          user.password = password
          UsersService.insertUser(db, user)
          .then(userResult => {
              return res.status(201).json(userResult)
          }).catch(next)
      }).catch(next)
  })

  module.exports = usersRouter