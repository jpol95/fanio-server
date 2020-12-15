create table review_tag_rels(
    "tagId" integer not null, 
    "reviewId" integer not null, 
    primary key ("tagId", "reviewId")
);
