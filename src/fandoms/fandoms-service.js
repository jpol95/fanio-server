const xss = require("xss");

const FandomsService = {
  getFandomsByUser(db, userId) {
    return db("fandoms")
      .select("*")
      .where({ userId })
      .then((fandoms) => fandoms.map((fandom) => this.serializeFandom(fandom)));
  },
  getFandomById(db, id) {
    return db("fandoms")
    .select("*")
    .where({ id })
    .first()
    .then(fandom => {
      if (!!fandom)
      return FandomsService.serializeFandom(fandom)
      else return fandom
    })
  },
  insertFandom(db, fandom) {
    return db
      .insert(fandom)
      .into("fandoms")
      .returning("*")
      .then((rows) => rows[0])
      .then((fandom) => FandomsService.getFandomById(db, fandom.id));
  },
  deleteFandom(db, id) {
    return db("fandoms").where({ id }).delete();
  },
  updateFandom(db, id, newInfo) {
    return db("fandoms")
      .where({ id })
      .update({ ...newInfo })
      .returning("*")
      .then((rows) => rows[0])
      .then((fandom) => {
        return FandomsService.getFandomById(db, fandom.id);
      });
  },
  serializeFandom(fandom) {
    return { ...fandom, title: xss(fandom.title) };
  },
};

module.exports = FandomsService;
