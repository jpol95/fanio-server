const xss = require("xss");

const InstallmentsService = {
  getInstallmentsByFandom(db, fandomId){
    db('installments')
    .select('*')
    .where({fandomId})
    .map(installment => this.serializeInstallment(installment))
  },
  getInstallmentById(db, id){
    db('installments')
    .select('*')
    .where({id})
  },
  insertInstallment(db, installment){
      db
      .insert(installment)
      .into('installments')
      .returning('*')
    },
    deleteInstallment(db, id){
        db('installments')
        .where({id})
        .delete()
    },
    updateInstallment(db, id, newInfo){
        db('installments')
        .where({id})
        .update({...newInfo})
        .returning('*')
        .then(installment => InstallmentsService.getInstallmentById(db, installment.id))

    },
  serializeInstallment(installment) {
    return { id: installment.id, 
    title: xss(installment.title), 
    userId: installment.userId }
  },
};
//i bet you could standardize this for example

module.exports = InstallmentsService