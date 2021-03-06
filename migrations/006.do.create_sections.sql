create table sections(
    id integer primary key generated by default as identity, 
    title text not null, 
    "order" integer not null, 
    "reviewId" integer references reviews(id) on delete set null, 
    "installmentId" integer not null references installments(id) on delete cascade
);

