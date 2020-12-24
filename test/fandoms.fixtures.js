const userList = [
    {
      id: 1,
      username: "kingbumii",
      fullname: "Jesse B Pollack",
      password: "$2y$12$4R1JkopQ4LgjXH27bUAV5OwezOQLoBP6Yv7mbd.Nv7V67yBSmepZq",
      education: "Purple University",
      interests: ["skating", "softball", "listending to show tunes", "knitting"],
      city: "Gallifrey",
    },
  ];
  
  const fandomList = [
    { id: 1, title: "Doctor Who", userId: 1 }, //fk
    { id: 2, title: "Supernatural", userId: 1 },
    { id: 3, title: "Parks and Recreation", userId: 1 },
    { id: 4, title: "Buffy the Vampire Slayer", userId: 1 },
    { id: 5, title: "Harry Potter", userId: 1 },
  ];
  //when someone wants to add a fandom, have a dropdown menu or have them create a new one
  //join fandomList_user table
  //you'd have a join table of users to fandoms
  
  const typeList = [
    {
      id: 1,
      title: "show",
      hasSubs: true,
      sectionName: "section",
      subName: "episode",
    },
    {
      id: 2,
      title: "book series",
      hasSubs: false,
      sectionName: "book",
      subName: null,
    },
    {
      id: 3,
      title: "movie series",
      hasSubs: false,
      sectionName: "movie",
      subName: null,
    },
    {
      id: 4,
      title: "comic series",
      hasSubs: true,
      sectionName: "arc",
      subName: "issue",
    },
  ];
  
  // installment of type show
  // How many sections? 5
  // How many episodes in this section?
  
  // book series?
  // It'll ask how many books?
  
  // sectionList --> subSectionList
  
  //hasSubs not necessary
  //so instead of having separate typeList table, type can be a field attached to installment table
  
  //later on if I want to add the option of comics not having subs
  //then i could just have another type that's false, call one
  //'comicHS(hasSubs)' and the other 'comicNS(noSubs)'
  
  const installmentList = [
    { id: 1, title: "Doctor Who TV Series", type: "Show", fandomId: 1 },
    { id: 2, title: "Parks and Rec TV Series", type: "Show", fandomId: 3 },
    { id: 3, title: "Buffy TV Series", type: "Show", fandomId: 4 },
    { id: 4, title: "Buffy Comic Series", type: "Comic series", fandomId: 4 },
    { id: 5, title: "Supernatural TV Series", type: "Show", fandomId: 2 },  //change these to lower case!!!!!!!!!!!!
    { id: 6, title: "Harry Potter Books", type: "Book series", fandomId: 5 },
  ];
  


  const reviewList = [
    {
      id: 1,
      title: `Doctor Who season 3 Episode 5 Review`,
      content: `Omg this is the best episode ever!`,
      rating: 4,
    },
    {
      id: 2,
      title: `Doctor Who season 4 Episode 7 Review`,
      content: `Omg this is the worst episode ever!`,
      rating: 1,
    },
    {
      id: 3,
      title: `Supernatural season 2 Episode 3 Review`,
      content: `Omg this is the worst episode ever!`,
      rating: 1,
    },
    {
      id: 4,
      title: `Supernatural season 3 Episode 4 Review`,
      content: `Omg this is the best episode ever!`,
      rating: 2,
    },
    {
      id: 5,
      title: `Parks and Recreation season 5 Episode 19 Review`,
      content: `Omg this is the worst episode ever!`,
      rating: 3,
    },
    {
      id: 6,
      title: `Parks and Recreation season 3 Episode 12 Review`,
      content: `Omg this is the best episode ever!`,
      rating: 4,
    },
    {
      id: 7,
      title: `Buffy the Vampire Slayer season 2 Episode 4 Review`,
      content: `Inca mummy girl???? More like LAME-KA mummy girl amirite haha im depressed please send meds`,
      rating: 5,
    },
    {
      id: 8,
      title: `Buffy the Vampire Slayer season 5 Episode 9 Review`,
      content: `Omg this is the best episode ever!`,
      rating: 2,
    },
    {
      id: 9,
      title: `Doctor Who season 2 Episode 9 Review`,
      content: `Omg this is the worst episode ever!`,
      rating: 4,
    },
    {
      id: 10,
      title: `Doctor Who season 1 Episode 2 Review`,
      content: `Omg this is the best episode ever!`,
      rating: 1,
    },
    {
      id: 11,
      title: `Parks and Recreation season 5 Episode 18 Review`,
      content: `Omg this is the worst episode ever!`,
      rating: 2,
    },
    {
      id: 12,
      title: `Parks and Recreation season 5 Episode 17 Review`,
      content: `Omg this is the best episode ever!`,
      rating: 3,
    },
    {
      id: 13,
      title: `Supernatural season 2 Episode 7 Review`,
      content: `Omg this is the worst episode ever!`,
      rating: 4,
    },
    {
      id: 14,
      title: `Supernatural season 1 Episode 9 Review`,
      content: `Omg this is the best episode ever!`,
      rating: 5,
    },
    {
      id: 15,
      title: `Buffy the Vampire Slayer season 1 Episode 7 Review`,
      content: `Omg this is the worst episode ever!`,
      rating: 1,
    },
    {
      id: 16,
      title: `Buffy the Vampire Slayer season 1 Episode 9 Review`,
      content: `Omg this is the best episode ever!`,
      rating: 2,
    },
    {
      id: 17,
      title: `Buffy the Vampire Slayer season 5 Review`,
      content: `Omg this is the worst season ever!`,
      rating: 3,
    },
    {
      id: 18,
      title: `Parks and Recreation season 3 Review`,
      content: `Omg this is the worst season ever!`,
      rating: 3,
    },
    {
      id: 19,
      title: `Supernatural season 3 Review`,
      content: `Omg this is the worst season ever!`,
      rating: 3,
    },
    {
      id: 20,
      title: `Doctor Who season 2 Review`,
      content: `Omg this is the worst season ever!`,
      rating: 3,
    },
    {
      id: 21,
      title: `HP1 Review`,
      content: `fuck JK Rowling fuck JK Rowlingfuck JK Rowlingfuck JK Rowlingfuck JK Rowlingfuck JK Rowlingfuck JK Rowling`,
      rating: 3,
    },
    {
      id: 22,
      title: `HP2 Review`,
      content: `fuck JK Rowling fuck JK Rowlingfuck JK Rowling fuck JK Rowlingfuck JK Rowlingfuck JK Rowlingfuck JK Rowlingfuck JK Rowling`,
      rating: 3,
    },
    {
      id: 23,
      title: `Buffy Comics season 8 Review`,
      content: `This is a cool comic book series!`,
      rating: 3,
    },
    {
      id: 24,
      title: `Buffy Comics season 8 Issue 1 Review`,
      content: `Look at what I can do! I can create stuff`,
      rating: 3,
    },
  ];
  
  const sectionList = [
    {
        id: 1,
        title: `Harry Potter and the Prisoner of Azkaban`,
        order: 3,
        installmentId: 6,
        reviewId: 21,
      },
      {
        id: 2,
        title: `Harry Potter and the Philosopher's Stone`,
        order: 1,
        installmentId: 6,
        reviewId: 22,
      },
      {
        id: 3,
        title: `Harry Potter and the Chamber of Secrets`,
        order: 2,
        installmentId: 6,
        reviewId: null,
      },
      {
        id: 4,
        title: `Harry Potter and the Case of Jesse's Missing Serotonin`,
        order: 1,
        installmentId: 6,
        reviewId: null,
      },
      { id: 5, title: `Buffy season 8`, order: 8, installmentId: 4, reviewId: 23 },
    {
      id: 6,
      title: "season 2 Doctor Who",
      order: 2,
      reviewId: null,
      installmentId: 1,
    },
    {
      id: 7,
      title: "season 3 Doctor Who",
      order: 3,
      reviewId: null,
      installmentId: 1,
    },
    {
      id: 8,
      title: "season 1 Doctor Who",
      order: 1,
      reviewId: null,
      installmentId: 1,
    },
    {
      id: 9,
      title: "season 4 Doctor Who",
      order: 4,
      reviewId: null,
      installmentId: 1,
    },
    {
      id: 10,
      title: "season 5 Parks and Recreation",
      order: 5,
      reviewId: null,
      installmentId: 2,
    },
    {
      id: 11,
      title: "season 1 Buffy",
      order: 1,
      reviewId: null,
      installmentId: 3,
    },
    {
      id: 12,
      title: "season 2 Buffy",
      order: 2,
      reviewId: null,
      installmentId: 3,
    },
    {
      id: 13,
      title: "season 1 Supernatural",
      order: 1,
      reviewId: 20,
      installmentId: 5,
    },
    {
      id: 14,
      title: "season 2 Supernatural",
      order: 2,
      reviewId: 20,
      installmentId: 5,
    },
    {
      id: 15,
      title: "season 3 Parks and Recreation",
      order: 3,
      reviewId: 18,
      installmentId: 2,
    },
    {
      id: 16,
      title: "season 3 Supernatural",
      order: 3,
      reviewId: 19,
      installmentId: 5,
    },
    { id: 17, title: "season 5 Buffy", order: 5, reviewId: 17, installmentId: 3 },
    
  ];
  
  //fakerjs creates fake data for you
  
  //database normalization, instead of title: section number
  //seeding the data
  //fandom -> section -> Episode
  //you could combine different media types into one table
  
  const subList = [
    { id: 1, title: "Doctor Who s3e5", order: 5, reviewId: 1, sectionId: 7 },
    { id: 2, title: "Doctor Who s4e7", order: 7, reviewId: 2, sectionId: 9 },
    { id: 3, title: "Supernatural s2e3", order: 3, reviewId: null, sectionId: 14 },
    { id: 4, title: "Supernatural s3e4", order: 4, reviewId: 4, sectionId: 16 },
    { id: 5, title: "PR s5e19", order: 19, reviewId: 5, sectionId: 10 },
    { id: 6, title: "PR s3e12", order: 12, reviewId: 6, sectionId: 15 },
    { id: 7, title: "Buffy s2e4", order: 4, reviewId: 7, sectionId: 12 },
    { id: 8, title: "Buffy s5e9", order: 9, reviewId: null, sectionId: 17 },
    { id: 9, title: "Doctor Who s2e9", order: 9, reviewId: 9, sectionId: 6 },
    { id: 10, title: "Doctor Who s1e2", order: 2, reviewId: 10, sectionId: 8 },
    { id: 11, title: "PR s5e18", order: 18, reviewId: null, sectionId: 10 },
    { id: 12, title: "PR s5e17", order: 17, reviewId: 12, sectionId: 10 },
    { id: 13, title: "Supernatural s2e7", order: 7, reviewId: 13, sectionId: 14 },
    { id: 14, title: "Supernatural s1e9", order: 9, reviewId: 14, sectionId: 13 },
    { id: 15, title: "Buffy s1e7", order: 7, reviewId: 15, sectionId: 11 },
    { id: 16, title: "Buffy s1e9", order: 9, reviewId: null, sectionId: 11 },
    { id: 17, title: `Buffy season 8 issue 1`, order: 1, reviewId: 24, sectionId: 5 },
  ];
  
  const tagList = [
    { id: 1, title: "science-fiction" },
    { id: 2, title: "comedy" },
    { id: 3, title: "drama" },
    { id: 4, title: "period" },
    { id: 5, title: "romance" },
    { id: 6, title: "historical-fiction" },
    { id: 7, title: "fantasy" },
    { id: 8, title: "raunchy" },
    { id: 9, title: "family" },
    { id: 10, title: "corny" },
    { id: 11, title: "violent" },
    { id: 12, title: "horror" },
  ];
  
  const reviewTagList = [
    { tagId: 1, reviewId: 10 },
    { tagId: 2, reviewId: 12 },
    { tagId: 3, reviewId: 17 },
    { tagId: 4, reviewId: 12 },
    { tagId: 5, reviewId: 18 },
    { tagId: 6, reviewId: 12 },
    { tagId: 8, reviewId: 3 },
    { tagId: 9, reviewId: 9 },
    { tagId: 10, reviewId: 10 },
    { tagId: 11, reviewId: 12 },
    { tagId: 12, reviewId: 3 },
  ];
  
  const seedDataBase = async (db) => {
    return db.transaction(async trx =>{
    await trx("reviews").insert(reviewList)
    await trx("users").insert(userList)
    await trx("fandoms").insert(fandomList)
    await trx("installments").insert(installmentList)
    await trx("sections").insert(sectionList)
    await trx("subs").insert(subList)
    await trx("tags").insert(tagList)
    await trx("review_tag_rels").insert(reviewTagList)
    trx.raw("select setval('reviews_id_seq', ?);", reviewList[reviewList.length - 1].id)
    trx.raw("select setval('users_id_seq', ?);", userList[userList.length - 1].id)
    trx.raw("select setval('fandoms_id_seq', ?);", fandomList[fandomList.length - 1].id)
    trx.raw("select setval('installments_id_seq', ?);", installmentList[installmentList.length - 1].id)
    trx.raw("select setval('sections_id_seq', ?);", sectionList[sectionList.length - 1].id)
    trx.raw("select setval('subs_id_seq', ?);", subList[subList.length - 1].id)
    trx.raw("select setval('tags_id_seq', ?);", tagList[tagList.length - 1].id)
    })
  }
  
  
  module.exports = { 
    installmentList,
    fandomList,
    reviewList,
    sectionList,  
    tagList,
    reviewTagList,
    seedDataBase
  };
  