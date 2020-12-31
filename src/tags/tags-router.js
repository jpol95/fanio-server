const express = require("express");
const TagsService = require("./tags-service");
const jsonParser = express.json();
const tagsRouter = express.Router();
const path = require('path')
const {requireLoggedInUser, requireAuth} = require('../middleware/jwt-auth')


tagsRouter
  .route("/")
  .get((req, res, next) => {
    const db = req.app.get("db");
    TagsService.getTags(db)
      .then((tags) => {
        return res.status(200).json(tags);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const db = req.app.get("db");
    const tags = req.body
    const tagArr = []
    for (let tag of tags){
    const { title } = tag;
    if (!title)
      return res.status(400).json({ error: "Must provide title for tag" });
    const singleTag = { title };
    tagArr.push(singleTag)
    }
    TagsService.insertTags(db, tagArr)
      .then((tag) => res.status(201).location(path.posix.join(req.originalUrl, `/${tag.id}`)).json(tag))
      .catch(next);
  });

tagsRouter
  .route("/:tagId")
  .get((req, res, next) => {
      const db = req.app.get("db")
      const {tagId} = req.params
      TagsService.getTagById(db, tagId)
      .then(tag => {
          if (!tag) return res.status(400).json({error: 'Tag not found'})
          return res.status(200).json(tag)
      }).catch(next)
  })



module.exports = tagsRouter