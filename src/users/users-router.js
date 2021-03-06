const express = require("express");
const UsersService = require("./users-service");
const jsonParser = express.json();
const usersRouter = express.Router();
const path = require("path");
const { requireAuth, requireLoggedInUser } = require("../middleware/jwt-auth");

const invalidPassword = (password) => {
  if (password.length < 8) {
    return "Password must be longer than 8 characters";
  }
  if (password.length > 72) {
    return "Password must be less than 72 characters";
  }
  if (password.startsWith(" ")) {
    return "Password must not start or end with empty spaces";
  }
  if (
    !password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/)
  )
    return `Password must contain a lower case character, an upper case character, a number and a special character`;
};

usersRouter.route("/loggedIn").get(requireAuth, (req, res, next) => {
  return res.status(200).json({ userId: req.user.id });
});

usersRouter
  .route("/user/:userId")
  .get(checkUserExists, (req, res, next) => {
    const db = req.app.get("db");
    UsersService.getUserByUserId(db, req.userUrl.id)
      .then((user) => {
        const {
          id,
          username,
          fullname,
          birthday,
          education,
          interests,
          city,
        } = user;
        const userToReturn = {
          id,
          username,
          fullname,
          birthday,
          education,
          interests,
          city,
        };
        return res.status(200).json(userToReturn);
      })
      .catch(next);
  })
  .patch(
    requireAuth,
    requireLoggedInUser,
    checkUserExists,
    jsonParser,
    (req, res, next) => {
      const db = req.app.get("db");
      const { fullname, interests, city, education } = req.body;
      if (!fullname && !interests && !city && education)
        return res
          .status(400)
          .json({ error: { message: "Must provide data to update" } });
      const newInfo = { fullname, interests, city, education };
      for (let field in newInfo) {
        if (!newInfo[field]) delete newInfo[field];
      }
      UsersService.updateUser(db, req.userUrl.id, newInfo)
        .then((user) => {
          delete user.password;
          return res.status(200).json(user);
        })
        .catch(next);
    }
  )
  .delete(
    requireAuth,
    requireLoggedInUser,
    checkUserExists,
    (req, res, next) => {
      const db = req.app.get("db");
      UsersService.deleteUserById(db, req.userUrl.id)
        .then(() => {
          return res.status(204).end();
        })
        .catch(next);
    }
  );

function checkUserExists(req, res, next) {
  const db = req.app.get("db");
  UsersService.getUserByUserId(db, req.params.userId)
    .then((user) => {
      if (!user) return res.status(400).json({ error: "User not found" });
      req.userUrl = user;
      next();
    })
    .catch(next);
}

usersRouter.route("/").post(jsonParser, (req, res, next) => {
  const db = req.app.get("db");
  const { username, password } = req.body;
  const requiredFields = { username, password };
  for (let field of Object.keys(requiredFields)) {
    if (!requiredFields[field])
      return res.status(400).json({ error: `Must provide a ${field}` });
  }
  if (invalidPassword(password))
    return res.status(400).json({ error: invalidPassword(password) });
  const { name, interests, city, education, fullname } = req.body;
  let optionalFields = { name, interests, city, education, fullname };
  for (let field in optionalFields)
    if (!optionalFields[field]) delete optionalFields[field];
  const user = { ...optionalFields, ...requiredFields };
  UsersService.hashPassword(password)
    .then((password) => {
      user.password = password;
      UsersService.insertUser(db, user)
        .then((userResult) => {
          return res.status(201).json(userResult);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = {
  usersRouter,
  checkUserExists,
};
