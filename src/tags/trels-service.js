const TrelsService = {
    getTrelById : (db) => {
        return db("review_tag_rels")
        .select('*')
        .first()
    },
    getTrels : (db) => {
        return db('review_tag_rels')
        .select('*')
    }, 
    insertTrels : (db, trelList) => {
        return db
        .into('review_tag_rels')
        .insert(trelList)
        .returning('*')
    }, 
}

module.exports = TrelsService

