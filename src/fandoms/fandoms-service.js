const xss = require("xss");

const FandomsService = {
  getFandomsByUser(db, userId){
    db('fandoms')
    .select('*')
    .where({userId})
    .map(fandom => this.serializeFandom(fandom))
  },
  getFandomById(db, id){
    db('fandoms')
    .select('*')
    .where({id})
  },
  insertFandom(db, fandom){
      db
      .insert(fandom)
      .into('fandoms')
      .returning('*')
      .then(rows => rows[0])
      .then(fandom => FandomsService.getFandomById(db, fandom.id)) 
    },
    deleteFandom(db, id){
        db('fandoms')
        .where({id})
        .delete()
    },
    updateFandom(db, id, newInfo){
        db('fandoms')
        .where({id})
        .update({...newInfo})
        .returning('*')
        .then(fandom => FandomsService.getFandomById(db, fandom.id))

    },
  serializeFandom(fandom) {
    return { id: fandom.id, 
    title: xss(fandom.title), 
    userId: fandom.userId }
  },
};

module.exports = FandomsService