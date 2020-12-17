begin;

truncate users,
fandoms,
installments,
sections,
subs,
reviews,
tags,
review_tag_rels;

insert into
    users(
        id,
        username,
        password,
        education,
        interests,
        city
    )
values
    (
        1,
        'kingbumii',
        '$2y$12$4R1JkopQ4LgjXH27bUAV5OwezOQLoBP6Yv7mbd.Nv7V67yBSmepZq',
        'Purple University',
        array ['skating', 'softball', 'listending to show tunes', 'knitting'],
        'Gallifrey'
    );

        SELECT setval('fanio_users_id_seq', [users[users.length - 1].id]),
      );

insert into
    reviews(id, title, content, rating)
values
    (
        1,
        'Doctor Who season 3 Episode 5 Review',
        'Omg this is the best episode ever!',
        4
    ),
    (
        2,
        'Doctor Who season 4 Episode 7 Review',
        'Omg this is the worst episode ever!',
        1
    ),
    (
        3,
        'Supernatural season 2 Episode 3 Review',
        'Omg this is the worst episode ever!',
        1
    ),
    (
        4,
        'Supernatural season 3 Episode 4 Review',
        'Omg this is the best episode ever!',
        2
    ),
    (
        5,
        'Parks and Recreation season 5 Episode 19 Review',
        'Omg this is the worst episode ever!',
        3
    ),
    (
        6,
        'Parks and Recreation season 3 Episode 12 Review',
        'Omg this is the best episode ever!',
        4
    ),
    (
        7,
        'Buffy the Vampire Slayer season 2 Episode 4 Review',
        'Inca mummy girl???? More like LAME-KA mummy girl amirite haha im depressed please send meds',
        5
    ),
    (
        8,
        'Buffy the Vampire Slayer season 5 Episode 9 Review',
        'Omg this is the best episode ever!',
        2
    ),
    (
        9,
        'Doctor Who season 2 Episode 9 Review',
        'Omg this is the worst episode ever!',
        4
    ),
    (
        10,
        'Doctor Who season 1 Episode 2 Review',
        'Omg this is the best episode ever!',
        1
    ),
    (
        11,
        'Parks and Recreation season 5 Episode 18 Review',
        'Omg this is the worst episode ever!',
        2
    ),
    (
        12,
        'Parks and Recreation season 5 Episode 17 Review',
        'Omg this is the best episode ever!',
        3
    ),
    (
        13,
        'Supernatural season 2 Episode 7 Review',
        'Omg this is the worst episode ever!',
        4
    ),
    (
        14,
        'Supernatural season 1 Episode 9 Review',
        'Omg this is the best episode ever!',
        5
    ),
    (
        15,
        'Buffy the Vampire Slayer season 1 Episode 7 Review',
        'Omg this is the worst episode ever!',
        1
    ),
    (
        16,
        'Buffy the Vampire Slayer season 1 Episode 9 Review',
        'Omg this is the best episode ever!',
        2
    ),
    (
        17,
        'Buffy the Vampire Slayer season 5 Review',
        'Omg this is the worst season ever!',
        3
    ),
    (
        18,
        'Parks and Recreation season 3 Review',
        'Omg this is the worst season ever!',
        3
    ),
    (
        19,
        'Supernatural season 3 Review',
        'Omg this is the worst season ever!',
        3
    ),
    (
        20,
        'Doctor Who season 2 Review',
        'Omg this is the worst season ever!',
        3
    ),
    (
        21,
        'HP1 Review',
        'fuck JK Rowling fuck JK Rowlingfuck JK Rowlingfuck JK Rowlingfuck JK Rowlingfuck JK Rowlingfuck JK Rowling',
        3
    ),
    (
        22,
        'HP2 Review',
        'fuck JK Rowling fuck JK Rowlingfuck JK Rowling fuck JK Rowlingfuck JK Rowlingfuck JK Rowlingfuck JK Rowlingfuck JK Rowling',
        3
    ),
    (
        23,
        'Buffy Comics season 8 Review',
        'This is a cool comic book series!',
        3
    ),
    (
        24,
        'Buffy Comics season 8 Issue 1 Review',
        'Look at what I can do! I can create stuff',
        3
    );

     SELECT setval('fanio_reviews_id_seq', ?),
        [reviews[reviews.length - 1].id],
      );

insert into
    fandoms(id, title, "userId")
values
    (1, 'Doctor Who', 1),
    (2, 'Supernatural', 1),
    (3, 'Parks and Recreation', 1),
    (4, 'Buffy the Vampire Slayer', 1),
    (5, 'Harry Potter', 1);

     SELECT setval('fanio_fandoms_id_seq', ?),
        [fandoms[fandoms.length - 1].id],
      );

insert into
    installments(id, title, "type", "fandomId")
values
    (1, 'Doctor Who TV Series', 'Show', 1),
    (2, 'Parks and Rec TV Series', 'Show', 3),
    (3, 'Buffy TV Series', 'Show', 4),
    (4, 'Buffy Comic Series', 'Comic series', 4),
    (5, 'Supernatural TV Series', 'Show', 2),
    (6, 'Harry Potter Books', 'Book series', 5);

     SELECT setval('fanio_installments_id_seq', ?),
        [installments[installments.length - 1].id],
      );

insert into
    sections(id, title, "order", "reviewId", "installmentId")
values
    (
        1,
        'Harry Potter and the Prisoner of Azkaban',
        3,
        21,
        6
    ),
    (
        2,
        'Harry Potter and the Philosophers Stone ',
        1,
        22,
        6
    ),
    (
        3,
        ' Harry Potter
            and the Chamber of Secrets ',
        2,
        null,
        6
    ),
    (
        4,
        ' Harry Potter
            and the Case
                of Jesses Missing Serotonin',
        1,
        null,
        6
    ),
    (5, 'Buffy Season 8', 8, 23, 4),
    (6, 'Season 2 Doctor Who', 2, null, 1),
    (7, 'Season 3 Doctor Who', 3, null, 1),
    (8, 'Season 1 Doctor Who', 1, null, 1),
    (9, 'Season 4 Doctor Who', 4, null, 1),
    (10, 'Season 5 Parks and Recreation', 5, null, 2),
    (11, 'Season 1 Buffy', 1, null, 3),
    (12, 'Season 2 Buffy', 2, null, 3),
    (13, 'Season 1 Supernatural', 1, 20, 5),
    (14, 'Season 2 Supernatural', 2, 20, 5),
    (15, 'Season 3 Parks and Recreation', 3, 18, 2),
    (16, 'Season 3 Supernatural', 3, 19, 5),
    (17, 'Season 5 Buffy', 5, 17, 3);
     
     SELECT setval('fanio_sections_id_seq', ?),
        [sections[sections.length - 1].id],
      );

insert into
    subs(id, title, "order", "reviewId", "sectionId")
values
    (1, 'Doctor Who s3e5', 5, 1, 7),
    (2, 'Doctor Who s4e7', 7, 2, 9),
    (3, 'Supernatural s2e3', 3, null, 14),
    (4, 'Supernatural s3e4', 4, 4, 16),
    (5, 'PR s5e19', 19, 5, 10),
    (6, 'PR s3e12', 12, 6, 15),
    (7, 'Buffy s2e4', 4, 7, 12),
    (8, 'Buffy s5e9', 9, null, 17),
    (9, 'Doctor Who s2e9', 9, 9, 6),
    (10, 'Doctor Who s1e2', 2, 10, 8),
    (11, 'PR s5e18', 18, null, 10),
    (12, 'PR s5e17', 17, 12, 10),
    (13, 'Supernatural s2e7', 7, 13, 14),
    (14, 'Supernatural s1e9', 9, 14, 13),
    (15, 'Buffy s1e7', 7, 15, 11),
    (16, 'Buffy s1e9', 9, null, 11),
    (17, 'Buffy section 8 issue 1', 1, 24, 5);

     SELECT setval('fanio_subs_id_seq', ?),
        [subs[subs.length - 1].id],
      );

insert into
    tags(id, title)
values
    (1, 'science-fiction'),
    (2, 'comedy'),
    (3, 'drama'),
    (4, 'period'),
    (5, 'romance'),
    (6, 'historical-fiction'),
    (7, 'fantasy'),
    (8, 'raunchy'),
    (9, 'family'),
    (10, 'corny'),
    (11, 'violent'),
    (12, 'horror');

 SELECT setval('fanio_tags_id_seq', ?),
        [tags[tags.length - 1].id],
      );

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