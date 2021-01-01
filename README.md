Welcome to Fanio! If you're a "fan" of any franchises, comic book series, book series, shows, movies, etc, then this website is for you! Once you build an account, you can add "fandoms", which are broad categories of franchises you might like. Think Spiderman, Harry Potter, Buffy The Vampire Slayer,etc. Within a fandom, you can create "installments", which are the actual media releases of a certain fandom. For example, if your fandom is Buffy The Vampire Slayer, you might have two installments: the TV series and the comic book series. For Harry Potter, you might have several installments: the book series, the original movie series, the fantastic beasts movie series, and the many miscellaneous books that the imaginary author of Harry Potter wrote to expand the universe. Within an installment, you have sections and subsections. Sections for a show would be seasons, subsections for a show would be episodes. Sections for a movie series would be the individual movie.

You can create reviews for sections and subsections. When you create a review, a preview to that specific review will show up on the installment-view page. If the review was for a subsection, clicking the subsection will automatically go to the review. If the review was for a section, there will be a "view full review" button to view the full review. If a review is not present, you will be presented with a button to write the review.

To demo the site, there is a built-in account with username "kingbumii" and password "password". This account has seeded data in it so you can explore how the data is displayed and edit/delete/add more data at your leisure. Feel free to create an account too! Click on any of the fandoms to view the installments within(buffy has two installments), then click on any of the installments to see the section list that belongs to that installment. Clicking on a section will expand it, displaying the subsection within. Once you are logged in to an account, if you change the user Id in the url to another user you're not logged into, you'll notice that you will still be able to view the other person's profile, but any buttons to edit that person's profile are hidden. Even if you go on postman and try to edit someone else's data, the API finds to which user the data belongs, and if the user in the verified JWT token does not match the user detected for the piece of data you're trying to manipulate, the server throws back a 401 Unauthorized error.

To complete this app, I used chai, mocha, and supertesting for the test suites, node.js for the server, React.js for the client, and several pre-built middlewares including cors(), morgan, helmet, etc.

API Documentation:

AuthRouter: /api/auth/login POST: your login credentials. Happy path returns JWT token

FandomsRouter: /api/fandoms/users/:userId GET: gets all fandoms for a specific user. Happy path returns a 200 and a list of fandoms

/fandoms/users/:userId POST: posts a fandom under a specific user. Happy path returns a 201 and the created fandom

/api/fandoms/:fandomId GET: gets the fandom with specified id. Happy path returns 200 and request fandom

/api/fandoms/:fandomId DELETE: deletes the fandom with the specified id. Happy path returns 204

/api/fandoms/:fandomId PATCH: updates the fandom with the specified id. Happy path returns updated fandom

InstallmentsRouter: /api/installments/parent/:fandomId POST: posts an installment under the specified fandom id. Happy path returns 201 and created installment

/api/installments/parent/:fandomId GET: gets list of installments under the specified fandom id. Happy path returns 200 and installment list.

/api/installments/:installmentId GET: gets installment with specified id. Happy path returns 200 and requested installment.

/api/installments/:installmentId DELETE: deletes installment with specified id. Happy path returns 204.

/api/installments/:installmentId PATCH: updates installment with specified id. Happy path returns 200 and updated fandom

ReviewsRouter: /api/reviews POST: posts a review. Happy path returns 201 and created review.

api/reviews/:reviewId GET: gets review with specified id. Happy path returns 200 and requested review

api/reviews/:reviewId DELETE: deletes review with specified id. Happy path returns 204

api/reviews/:reviewId PATCH: updates review with specified id. Happy path returns 200 and updated review.

SectionsRouter: api/sections/section/parent/:installmentId POST: posts section under specified installment id. Happy path returns 201 and posted installment

api/sections/section/parent/:installmentId GET: gets all sections under specified installment id. Happy path returns 200 and list of sections.

api/sections/section/:sectionId DELETE: deletes section with specified id. Happy path returns 204.

api/sections/section/:sectionId PATCH: updates section with specified id. Happy path returns 200 and updated section

api/sections/section/:sectionId GET: gets section with specified id. Happy path returns 200 and requested section

SubsectionsRouter: api/sections/sub/parent/:sectionId POST: posts subsection under specified section id. Happy path returns 201 and posted section

api/sections/sub/parent/:sectionId GET: gets all subsection under specified section id. Happy path returns 200 and list of subsections.

api/sections/sub/:subId DELETE: deletes subsection with specified id. Happy path returns 204.

api/sections/sub/:subId PATCH: updates subsection with specified id. Happy path returns 200 and updated subsection

api/sections/sub/:sectionId GET: gets subsection with specified id. Happy path returns 200 and requested subsection

TagsRouter: api/tags/ GET: gets all tags in database. Happy path returns 200 and list of tags

api/tags/ POST: posts tag. Happy path returns 201 and created tag

api/tags/:tagId GET: gets tag with specified id. Happy path returns 200 and requested tag

TrelsRouter: api/trels/ GET: gets all tag-review relationships in database. Happy path returns 200 and list of relationships

api/trels/:tagId/:reviewId GET: gets review-tag relationship with specified ids. Happy path returns 200 and requested relationship.

api/trels/:reviewId POST: posts review-tag relationship under specified review id. Happy path returns 201 and created relationship.

api/trels/:reviewId DELETE: deletes review-tag relationship under specified review id. Happy path returns 204.

UsersRouter: api/users/user/:userId GET: gets user with specified id, minus the hashed password. Happy path returns 200 and requested user.

api/users/user/:userId PATCH: updates user with specified id. Happy path returns 200 and updated user, minus the hashed password

api/users/user/:userId DELETE: deletes user with specified id. Happy path returns 204

api/users/ POST: posts new user. Happy path returns 201 and created user minus the hashed password

Screenshots: ![alt text](ss1.PNG)
