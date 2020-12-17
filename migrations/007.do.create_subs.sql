create table subs(
    id integer primary key generated by default as identity, 
    title text not null,
    "order" integer not null, 
    "reviewId" integer references reviews(id) on delete set null, 
    "sectionId" integer references sections(id) on delete cascade 
);
