const xss = require('xss')

const TagsService = {
    getTagById : (db) => {
        return db("tags")
        .select('*')
        .first()
        .then(tag => TagsService.serializeTag(tag))
    },
    getTags : (db) => {
        return db('tags')
        .select('*')
        .then(tags => tags.map(tag => TagsService.serializeTag(tag)))
    }, 
    insertTags : (db, tagList) => {
        return db
        .into('tags')
        .insert(tagList)
        .returning('*')
        .then(tags => tags.map(tag => TagsService.serializeTag(tag)))
    },
    serializeTag : (tag) => {
        return { ...tag, title: xss(tag.title) };
    } 
}

module.exports = TagsService