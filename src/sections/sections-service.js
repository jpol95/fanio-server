const xss = require("xss");

const SectionsService = {
  getSectionsByFandom(db, fandomId, tableName){
    db(tableName)
    .select('*')
    .where({fandomId})
    .map(section => this.serializeSection(section))
  },
  getSectionById(db, id, tableName){
    db(tableName)
    .select('*')
    .where({id})
  },
  insertSection(db, section, tableName){
      db
      .insert(section)
      .into(tableName)
      .returning('*')
    },
    deleteSection(db, id, tableName){
        db(tableName)
        .where({id})
        .delete()
    },
    updateSection(db, id, newInfo, tableName){
        db(tableName)
        .where({id})
        .update({...newInfo})
        .returning('*')
        .then(section => SectionsService.getSectionById(db, section.id))

    },
  serializeSection(section) {
    return { id: section.id, 
    title: xss(section.title), 
    userId: section.userId }
  },
};
//i bet you could standardize this for example

module.exports = SectionsService