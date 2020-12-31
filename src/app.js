require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')
const validateBearerToken = require('./middleware/bearer-token')
const errorHandler = require('./middleware/error-handler')
const {fandomsRouter} = require('./fandoms/fandoms-router')
const installmentsRouter = require('./installments/installments-router')
const sectionsRouter = require('./sections/sections-router')
const reviewsRouter = require('./reviews/reviews-router')
const tagsRouter = require('./tags/tags-router')
const trelsRouter = require('./tags/trels-router')
const authRouter = require('./auth/auth-router')
const {usersRouter} = require('./users/users-router')

const app = express();


app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
  );

const morganSetting = NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))

app.use(helmet());

app.use(errorHandler)

app.use("/api/auth", authRouter)
app.use("/api/fandoms", fandomsRouter)
app.use("/api/installments", installmentsRouter)
app.use("/api/sections", sectionsRouter)
app.use("/api/reviews", reviewsRouter)
app.use("/api/tags", tagsRouter)
app.use("/api/trels", trelsRouter)
app.use("/api/users", usersRouter)
module.exports = app;
