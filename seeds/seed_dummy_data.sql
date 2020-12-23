begin;

truncate users,
fandoms,
installments,
sections,
subs,
reviews,
tags,
review_tag_rels;

select setval('users_id_seq', 1, false);
select setval('fandoms_id_seq', 1, false);
select setval('installments_id_seq', 1, false);
select setval('sections_id_seq', 1, false);
select setval('subs_id_seq', 1, false);
select setval('reviews_id_seq', 1, false);
select setval('tags_id_seq', 1, false);


insert into
    users(
        username,
        password,
        fullname,
        education,
        interests,
        city
    )
values
    (
        'kingbumii',
        '$2y$12$4R1JkopQ4LgjXH27bUAV5OwezOQLoBP6Yv7mbd.Nv7V67yBSmepZq',
        'Jesse Pollack',
        'Purple University',
        array ['skating', 'softball', 'listending to show tunes', 'knitting'],
        'Gallifrey'
    );

insert into
    reviews(title, content, rating)
values
    (
        'Doctor Who season 3 Episode 5 Review',
        'Omg this is the best episode ever!',
        4
    ),
    (
      
        'Doctor Who season 4 Episode 7 Review',
        'Omg this is the worst episode ever!',
        1
    ),
    (
        
        'Supernatural season 2 Episode 3 Review',
        'Omg this is the worst episode ever!',
        1
    ),
    (
    
        'Supernatural season 3 Episode 4 Review',
        'Omg this is the best episode ever!',
        2
    ),
    (
        
        'Parks and Recreation season 5 Episode 19 Review',
        'Omg this is the worst episode ever!',
        3
    ),
    (
        
        'Parks and Recreation season 3 Episode 12 Review',
        'Omg this is the best episode ever!',
        4
    ),
    (
        
        'Buffy the Vampire Slayer season 2 Episode 4 Review',
        'Inca mummy girl???? More like LAME-KA mummy girl amirite haha im depressed please send meds',
        5
    ),
    (
        
        'Buffy the Vampire Slayer season 5 Episode 9 Review',
        'Omg this is the best episode ever!',
        2
    ),
    (
        
        'Doctor Who season 2 Episode 9 Review',
        'Omg this is the worst episode ever!',
        4
    ),
    (
        
        'Doctor Who season 1 Episode 2 Review',
        'Omg this is the best episode ever!',
        1
    ),
    (
        
        'Parks and Recreation season 5 Episode 18 Review',
        'Omg this is the worst episode ever!',
        2
    ),
    (
        
        'Parks and Recreation season 5 Episode 17 Review',
        'Omg this is the best episode ever!',
        3
    ),
    (
        
        'Supernatural season 2 Episode 7 Review',
        'Omg this is the worst episode ever!',
        4
    ),
    (
        
        'Supernatural season 1 Episode 9 Review',
        'Omg this is the best episode ever!',
        5
    ),
    (
        
        'Buffy the Vampire Slayer season 1 Episode 7 Review',
        'Omg this is the worst episode ever!',
        1
    ),
    (
        
        'Buffy the Vampire Slayer season 1 Episode 9 Review',
        'Omg this is the best episode ever!',
        2
    ),
    (
        
        'Buffy the Vampire Slayer season 5 Review',
        'Omg this is the worst season ever!',
        3
    ),
    (
        
        'Parks and Recreation season 3 Review',
        'Omg this is the worst season ever!',
        3
    ),
    (
        
        'Supernatural season 3 Review',
        'Omg this is the worst season ever!',
        3
    ),
    (
        
        'Doctor Who season 2 Review',
        'Omg this is the worst season ever!',
        3
    ),
    (
        
        'HP1 Review',
        'fuck JK Rowling fuck JK Rowlingfuck JK Rowlingfuck JK Rowlingfuck JK Rowlingfuck JK Rowlingfuck JK Rowling',
        3
    ),
    (
        
        'HP2 Review',
        'fuck JK Rowling fuck JK Rowlingfuck JK Rowling fuck JK Rowlingfuck JK Rowlingfuck JK Rowlingfuck JK Rowlingfuck JK Rowling',
        3
    ),
    (
        
        'Buffy Comics season 8 Review',
        'This is a cool comic book series!',
        3
    ),
    (
        
        'Buffy Comics season 8 Issue 1 Review',
        'Look at what I can do! I can create stuff',
        3
    );

insert into
    fandoms(title, "userId")
values
    ('Doctor Who', 1),
    ('Supernatural', 1),
    ('Parks and Recreation', 1),
    ('Buffy the Vampire Slayer', 1),
    ('Harry Potter', 1);

insert into
    installments(title, "type", "fandomId")
values
    ('Doctor Who TV Series', 'Show', 1),
    ('Parks and Rec TV Series', 'Show', 3),
    ('Buffy TV Series', 'Show', 4),
    ('Buffy Comic Series', 'Comic series', 4),
    ('Supernatural TV Series', 'Show', 2),
    ('Harry Potter Books', 'Book series', 5);

insert into
    sections(title, "order", "reviewId", "installmentId")
values
    (
        'Harry Potter and the Prisoner of Azkaban',
        3,
        21,
        6
    ),
    (
        'Harry Potter and the Philosophers Stone ',
        1,
        22,
        6
    ),
    (
        ' Harry Potter
            and the Chamber of Secrets ',
        2,
        null,
        6
    ),
    (
        ' Harry Potter
            and the Case
                of Jesses Missing Serotonin',
        1,
        null,
        6
    ),
    ('Buffy Season 8', 8, 23, 4),
    ('Season 2 Doctor Who', 2, null, 1),
    ('Season 3 Doctor Who', 3, null, 1),
    ('Season 1 Doctor Who', 1, null, 1),
    ('Season 4 Doctor Who', 4, null, 1),
    ('Season 5 Parks and Recreation', 5, null, 2),
    ('Season 1 Buffy', 1, null, 3),
    ('Season 2 Buffy', 2, null, 3),
    ('Season 1 Supernatural', 1, 20, 5),
    ('Season 2 Supernatural', 2, 20, 5),
    ('Season 3 Parks and Recreation', 3, 18, 2),
    ('Season 3 Supernatural', 3, 19, 5),
    ('Season 5 Buffy', 5, 17, 3);

insert into
    subs(title, "order", "reviewId", "sectionId")
values
    ('Doctor Who s3e5', 5, 1, 7),
    ('Doctor Who s4e7', 7, 2, 9),
    ('Supernatural s2e3', 3, null, 14),
    ('Supernatural s3e4', 4, 4, 16),
    ('PR s5e19', 19, 5, 10),
    ('PR s3e12', 12, 6, 15),
    ('Buffy s2e4', 4, 7, 12),
    ('Buffy s5e9', 9, null, 17),
    ('Doctor Who s2e9', 9, 9, 6),
    ('Doctor Who s1e2', 2, 10, 8),
    ('PR s5e18', 18, null, 10),
    ('PR s5e17', 17, 12, 10),
    ('Supernatural s2e7', 7, 13, 14),
    ('Supernatural s1e9', 9, 14, 13),
    ('Buffy s1e7', 7, 15, 11),
    ('Buffy s1e9', 9, null, 11),
    ('Buffy section 8 issue 1', 1, 24, 5);

insert into
    tags(title)
values
    ('science-fiction'),
    ('comedy'),
    ('drama'),
    ('period'),
    ('romance'),
    ('historical-fiction'),
    ('fantasy'),
    ('raunchy'),
    ('family'),
    ('corny'),
    ('violent'),
    ('horror');

insert into
    review_tag_rels("tagId", "reviewId")
values
    (1, 10),
    (2, 12),
    (3, 17),
    (4, 12),
    (5, 18),
    (6, 12),
    (8, 3),
    (9, 9),
    (10, 10),
    (11, 12),
    (12, 3);

commit;