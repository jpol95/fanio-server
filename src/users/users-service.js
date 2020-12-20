const xss = require('xss')
const bcrypt = require('bcryptjs')

const UsersService = {
    getUserById(db, id) {
        return db("users")
        .select("*")
        .where({ id })
        .first()
        .then(user => UsersService.serializeUser(user))
      },
    insertUser(db, user) {
        return db
          .insert(user)
          .into("users")
          .returning("*")
          .then((rows) => rows[0])
          .then((user) => UsersService.getUserById(db, user.id));
      }, 
      hashPassword(password) {
        return bcrypt.hash(password, 12)
      },
      serializeUser(user){
        return {
            ...user, 
            username: xss(user.username), 
            name: xss(user.name), 
            interests: xss(user.interests), 
            city: xss(user.city), 
            education: xss(user.education),     
        }

      }
}

module.exports = UsersService