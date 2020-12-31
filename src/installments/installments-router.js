const express = require("express");
const InstallmentsService = require("./installments-service");
const jsonParser = express.json();
const installmentsRouter = express.Router();
const path = require('path')
const {checkFandomExists} = require('../fandoms/fandoms-router')

const {requireLoggedInUser, requireAuth} = require("../middleware/jwt-auth")

const validTypes = [ 'Book series', 'Comic series', 'Movie series', 'Show']
installmentsRouter
  .route("/parent/:fandomId")
  .post(requireAuth, requireLoggedInUser,  jsonParser, (req, res, next) => {
    const db = req.app.get("db");
    const installmentsList = []
    for (let installment of req.body){
    const { title, type } = installment;
    if (!title)
      return res.status(400).json({ error: "Must provide title for installment" });
    if (!type || !validTypes.includes(type))
        return res.status(400).json({error: 'Invalid Type'})
    
    const installmentSingle = { title, type, fandomId: req.params.fandomId };
    installmentsList.push(installmentSingle)
    }


    InstallmentsService.insertInstallments(db, installmentsList)
      .then((installments) => res.status(201).json(installments))
      .catch(next);
  })
  .get(checkFandomExists, (req, res, next) => {
    const db = req.app.get("db");
    const fandomId = req.params.fandomId
    InstallmentsService.getInstallmentsByFandom(db, fandomId)
      .then((installments) => {
        return res.status(200).json(installments);
      })
      .catch(next);
  })

installmentsRouter.route("/:installmentId")
.all(checkInstallmentExists)
.get((req, res, next) => {
  return res.status(200).json(res.installment)
})
.delete(requireAuth, requireLoggedInUser, (req, res, next) => {
    const db = req.app.get("db")
    const {id} = res.installment
    InstallmentsService.deleteInstallment(db, id)
    .then(() => res.status(204).end())
    .catch(next)
})
.patch(requireAuth, requireLoggedInUser, jsonParser, (req, res, next) => {
    const db = req.app.get("db")
    const {title, type} = req.body
    const newInfo = {title, type}
    if (!title && !type) return res.status(400).json({error: 'Missing a required field(s)'})
    if (type && !validTypes.includes(type)) return res.status(400).json({error: 'Invalid type'})
    InstallmentsService.updateInstallment(db, res.installment.id, newInfo)
    .then(installment => {
        return res.status(200).json(installment)
    }).catch(next)
})


async function checkInstallmentExists(req, res, next) {
  try {
    const db = req.app.get("db")
    const installmentId = req.params.installmentId;
    const installment = await InstallmentsService.getInstallmentById(db, installmentId);

    if (!installment) return res.status(400).json({ error: "Installment not found" });
    res.installment = installment;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = installmentsRouter
