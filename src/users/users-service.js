const xss = require('xss')
const bcrypt = require('bcryptjs')

const UsersService = {
  async getUserByReviewId(db, id){
    const secInfo = await UsersService.getSecByReviewId(db, id)
    // console.log(secInfo)
    const user = await UsersService[`getUserBy${secInfo.functionName}`](db, secInfo.result.id)
    return user
  },
  async getSecByReviewId(db, reviewId){
    const sub = await db("subs")
    .select('*')
    .where({reviewId})
    
    const section = await db("sections")
    .select('*')
    .where({reviewId})
    
    const result = section.length === 0 ? sub[0] : section[0]
    const functionName = section.length === 0 ? "SubId" : "SectionId"
    return {result, functionName}
  },
  async getUserBySubId(db, id){
    const sub = await db("subs")
    .select("*")
    .where({id})
    .first()
   console.log(sub)
    const user = await UsersService.getUserBySectionId(db, sub.sectionId)
    return user
  },
    async getUserBySectionId(db, id){
      const section = await db("sections")
      .select("*")
      .where({id})
      .first()
      console.log(section)
      const user = await UsersService.getUserByInstallmentId(db, section.installmentId)
      return user
    },
    async getUserByInstallmentId(db, id){
      const installment = await db("installments")
      .select("*")
      .where({id})
      .first()
      const user = await UsersService.getUserByFandomId(db, installment.fandomId)
      return user
    },
    async getUserByFandomId (db, id){
      const fandom = await db("fandoms")
      .select("*")
      .where({id})
      .first()
      const user = await UsersService.getUserByUserId(db, fandom.userId)
      return user;
    },
    getUserByUserId(db, id) {
        return db("users")
        .select("*")
        .where({ id })
        .first()
        .then(user => {
          if (!!user)
          return UsersService.serializeUser(user)
          else return user
        })
      },
    deleteUserById(db, id){
      return db("users")
      .where({id})
      .delete()
      
    },
    updateUser(db, id, newInfo){
      return db("users")
      .where({id})
      .update({...newInfo})
      .returning('*')
      .then(rows => rows[0])
      .then(user => {
        return UsersService.serializeUser(user)
      })
    },
    insertUser(db, user) {
        return db
          .insert(user)
          .into("users")
          .returning("*")
          .then((rows) => rows[0])
          .then((user) => UsersService.getUserByUserId(db, user.id));
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