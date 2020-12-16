const express = require("express");
const InstallmentsService = require("./installments-service");
const jsonParser = express.json();
const installmentsRouter = express.Router();

const loggedInUser = 1; //this field will disappear once you introduce login

const validTypes = [ 'Book series', 'Comic series', 'Movie series', 'Show']
installmentsRouter
  .route("/")
  .get((req, res, next) => {
    const db = req.app.get("db");
    const fandomId = req.params.fandomId
    InstallmentsService.getInstallmentsByFandom(db, fandomId)
      .then((installments) => {
        return res.status(200).json(installments);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const db = req.app.get("db");
    const { title, type } = req.body;
    if (!title)
      return res.status(400).json({ error: "Must provide title for installment" });
    if (!type || !validTypes.includes(type))
        return res.status(400).json({error: 'Invalid Type'})
    const installment = { title, type, fandomId: req.params.fandomId };
    InstallmentsService.insertInstallment(db, fandomId, installment)
      .then((installment) => res.status(201).json(installment))
      .catch(next);
  });

installmentsRouter.route("/:installmentId")
.all(checkInstallmentExists)
.get((req, res, next) => {
    return res.status(200).json(res.installment)
})
.delete((req, res, next) => {
    const db = req.app.get("db")
    const {id} = req.installment
    InstallmentsService.deleteInstallment(db, id)
    .then(() => res.status(204).end())
    .catch(next)
})
.patch((req, res, next) => {
    const db = req.app.get("db")
    const {title, type} = req.body
    const newInfo = {title}
    if (!title && !type) return res.status(400).json({error: 'Missing a required field(s)'})
    InstallmentsService.updateInstallment(db, res.installment.id, newInfo)
    .then(installment => {
        return res.status(200).json(installment)
    }).catch(next)
})

//check if you should be returning the thing you're updating

async function checkInstallmentExists(req, res, next) {
  try {
    const installmentId = req.params.installmentId;
    const installment = await InstallmentsService.getInstallmentById(installmentId);

    if (!installment) return res.status(400).json({ error: "Installment not found" });
    res.installment = installment;
    next();
  } catch (error) {
    next(error);
  }
}
