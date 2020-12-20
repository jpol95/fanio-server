const express = require("express");
const InstallmentsService = require("./installments-service");
const jsonParser = express.json();
const installmentsRouter = express.Router();
const path = require('path')
const loggedInUser = 1; //this field will disappear once you introduce login
const {requireAuth} = require("../middleware/jwt-auth")

const validTypes = [ 'Book series', 'Comic series', 'Movie series', 'Show']
installmentsRouter
  .route("/users/:userId/:fandomId")
  .post(requireAuth, jsonParser, (req, res, next) => {
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

  installmentsRouter
  .route("/:fandomId")
  .get((req, res, next) => {
    const db = req.app.get("db");
    const fandomId = req.params.fandomId
    InstallmentsService.getInstallmentsByFandom(db, fandomId)
      .then((installments) => {
        return res.status(200).json(installments);
      })
      .catch(next);
  })
    //debug posting sections, then on to posting reviews! think about that search functionality, if you dare, and how you plan to implement it

    // console.log(installmentsList)
    InstallmentsService.insertInstallments(db, installmentsList)
      .then((installments) => res.status(201).json(installments))
      .catch(next);
  });
  //it was ok to delete the location thing in here right? since it was a list

installmentsRouter.route("/users/:userId/:fandomId/:installmentId")
.all(checkInstallmentExists)
.delete(requireAuth, (req, res, next) => {
    const db = req.app.get("db")
    const {id} = res.installment
    InstallmentsService.deleteInstallment(db, id)
    .then(() => res.status(204).end())
    .catch(next)
})
.patch(requireAuth, jsonParser, (req, res, next) => {
    const db = req.app.get("db")
    const {title, type} = req.body
    const newInfo = {title, type}
    if (!title && !type) return res.status(400).json({error: 'Missing a required field(s)'})
    InstallmentsService.updateInstallment(db, res.installment.id, newInfo)
    .then(installment => {
        return res.status(200).json(installment)
    }).catch(next)
})

installmentsRouter.route("/:fandomId/:installmentId")
.all(checkInstallmentExists)
.get((req, res, next) => {
    return res.status(200).json(res.installment)
})

//check if you should be returning the thing you're updating

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