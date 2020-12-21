const xss = require('xss')
const bcrypt = require('bcryptjs')

const UsersService = {
  async getUserByReview(db, id){
    const secInfo = await getSecByReview(db, id)
    const user = await UsersService[`getUserBy${secInfo.functionName}`]
    return user
  },
  async getSecByReview(db, reviewId){
    const sub = await db("subs")
    .select('*')
    .where({reviewId})
    
    const section = await db("sections")
    .select('*')
    .where({reviewId})
    
    const result = section.length === 0 ? sub[0] : section[0]
    const functionName = section.length === 0 ? "Sub" : "Section"
    return {result, functionName}
  },
  async getUserBySub(db, id){
    const sub = await db("subId")
    .select("*")
    .where({id})
    .first()
    const user = await UsersService.getUserBySection(db, user.sectionId)
    return user
  },
    async getUserBySection(db, id){
      const section = await db("sections")
      .select("*")
      .where({id})
      .first()
      const user = await UsersService.getUserByInstallment(db, section.installmentId)
      return user
    },
    async getUserInstallment(db, id){
      const installment = await db("installments")
      .select("*")
      .where({id})
      .first()
      const user = await UsersService.getUserByFandom(db, installment.fandomId)
      return user
    },
    async getUserByFandom (db, id){
      const fandom = await db("fandoms")
      .select("*")
      .where({id})
      .first()
      const user = await UsersService.getUserById(db, fandom.userId)
      return user;
    },
    getUserById(db, id) {
        return db("users")
        .select("*")
        .where({ id })
        .first()
        .then(user => UsersService.serializeUser(user))
      },
    deleteUserById(db, id){
      return db("users")
      .where({id})
      .delete()
      
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