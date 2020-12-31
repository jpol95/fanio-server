const AuthService = require("../auth/auth-service");
const UsersService = require("../users/users-service");

async function requireLoggedInUser(req, res, next) {
  try {
    for (let field in req.params) {
      if (!req.params[field]) delete req.params[field];
    }
    const db = req.app.get("db");
    const accessedId = Object.values(req.params)[0];
    const funcName =
      Object.keys(req.params)[0].charAt(0).toUpperCase() +
      Object.keys(req.params)[0].slice(1);
    const accessedUser = await UsersService[`getUserBy${funcName}`](
      db,
      accessedId
    );
    if (accessedUser.id !== req.user.id)
      return res.status(401).json({ error: "Unauthorized Request" });
    next();
  } catch (error) {
    next(error);
  }
}

function requireAuth(req, res, next) {
  const authToken = req.get("Authorization") || "";
  let bearerToken;
  if (!authToken.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "Missing bearer token" });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }
  try {
    const payload = AuthService.verifyJwt(bearerToken);

    AuthService.getUserWithUserName(req.app.get("db"), payload.sub)
      .then((user) => {
        if (!user)
          return res.status(401).json({ error: "Unauthorized request" });
        req.user = user;
        next();
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized request" });
  }
}

module.exports = {
  requireAuth,
  requireLoggedInUser,
};
