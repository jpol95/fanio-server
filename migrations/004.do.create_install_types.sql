create type installment_type as enum(
    'Book series', 
    'Comic series', 
    'Movie series', 
    'Show'
);

alter table installments 
    add column 
        "type" installment_type;