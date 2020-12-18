const xss = require('xss')

const TagsService = {
    getTagById : (db) => {
        return db("tags")
        .select('*')
        .first()
        .then(tag => this.serializeTag(tag))
    },
    getTags : (db) => {
        return db('tags')
        .select('*')
        .then(tags => tags.map(tag => this.serializeTag(tag)))
    }, 
    insertTags : (db, tagList) => {
        return db
        .into('tags')
        .insert(tagList)
        .returning('*')
        .then(tags => tags.map(tag => this.serializeTag(tag)))
    },
    serializeTag : (tag) => {
        return { ...tag, title: xss(tag.title) };
    } 
}

module.exports = TagsService