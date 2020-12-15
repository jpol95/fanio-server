alter table if exists installments
    drop column if exists "type";

drop type if exists installment_type;