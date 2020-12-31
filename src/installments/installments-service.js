const xss = require("xss");

const InstallmentsService = {
  getInstallmentType(db, id) {
    return db("installments").select("type").where({ id }).first().then(type => type.type)
  },
  getInstallmentsByFandom(db, fandomId) {
    return db("installments")
      .select("*")
      .where({ fandomId })
      .then((installments) => installments.map((installment) => this.serializeInstallment(installment)));
  },
  getInstallmentById(db, id) {
   return db("installments")
   .select("*")
   .where({ id })
   .first()
   .then(installment => {
    if (!!installment)
    return InstallmentsService.serializeInstallment(installment)
    else return installment
   })
  },
  insertInstallments(db, installment) {
    return db.insert(installment).into("installments").returning("*");
  },
  deleteInstallment(db, id) {
    return db("installments").where({ id }).delete();
  },
  updateInstallment(db, id, newInfo) {
    return db("installments")
      .where({ id })
      .update({ ...newInfo })
      .returning("*")
      .then((rows) => rows[0])
      .then((installment) =>
        InstallmentsService.getInstallmentById(db, installment.id)
      );
  },
  serializeInstallment(installment) {
    return { ...installment, title: xss(installment.title) };
  },
};

module.exports = InstallmentsService;
