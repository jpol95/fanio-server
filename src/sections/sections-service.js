const xss = require("xss");

const SectionsService = {
  getSectionsByParent(db, parentInfo, tableName) {
    return db(tableName)
      .select("*")
      .where({ [`${parentInfo[0]}Id`]: parentInfo[1] })
      .then((sections) => sections.map((section) => this.serializeSection(section)));
  },
  getSectionById(db, id, tableName) {
    return db(tableName).select("*").where({ id }).first();
  },
  insertSections(db, section, tableName) {
    return db.insert(section).into(tableName).returning("*");
  },
  deleteSection(db, id, tableName) {
    return db(tableName).where({ id }).delete();
  },
  updateSection(db, id, newInfo, tableName) {
    return db(tableName)
      .where({ id })
      .update({ ...newInfo })
      .returning("*")
      .then(rows => rows[0])
      .then((section) => {
          return SectionsService.getSectionById(db, section.id, tableName)});
  },
  serializeSection(section) {
    return {
      ...section, 
      title: xss(section.title),
    };
  },
};
//i bet you could standardize this for example

module.exports = SectionsService;
