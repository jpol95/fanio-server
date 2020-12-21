create table review_tag_rels(
    "tagId" integer not null references tags(id) on delete cascade, 
    "reviewId" integer not null references reviews(id) on delete cascade, 
    primary key ("tagId", "reviewId")
);
