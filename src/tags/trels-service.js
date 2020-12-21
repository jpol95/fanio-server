const TrelsService = {
    getTrelById : (db, tagId, reviewId) => {
        return db("review_tag_rels")
        .where({tagId, reviewId})
        .select('*')
        .first()
    },
    getTrelsByReviewId : (db, reviewId) => {
        return db('review_tag_rels')
        .select('*')
        .where({reviewId})
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
    delete : (db, reviewId) => {
        return db("review_tag_rels")
        .where({reviewId})
        .delete()
    }
}

module.exports = TrelsService

