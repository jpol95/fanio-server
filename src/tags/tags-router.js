const express = require("express");
const TagsService = require("./tags-service");
const jsonParser = express.json();
const tagsRouter = express.Router();
const path = require('path')
const {requireLoggedInUser, requireAuth} = require('../middleware/jwt-auth')

//when you load the reviews you have to load the tags toooooo

tagsRouter
  .route("/")
  .get((req, res, next) => {
    // console.log("hello")
    const db = req.app.get("db");
    TagsService.getTags(db)
      .then((tags) => {
        return res.status(200).json(tags);
      })
      .catch(next);
  })
  .post(requireAuth, requireLoggedInUser, jsonParser, (req, res, next) => {
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
    FandomsService.insertTags(db, tagArr)
      .then((tag) => res.status(201).location(path.posix.join(req.originalUrl, `/${tag.id}`)).json(tag))
      .catch(next);
  });

tagsRouter
  .route("/:tagId")
  .get((req, res, next) => {
      const db = req.app.get("db")
      const {tagId} = req.params.tagId
      TagsService.getTagById(tagId)
      .then(tag => {
          if (!tag) return res.status(400).json({error: 'Tag not found'})
          return res.status(200).json(tag)
      }).catch(next)
  })

//check if you should be returning the thing you're updating


module.exports = tagsRouter