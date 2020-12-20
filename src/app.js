require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require('./config')
const validateBearerToken = require('./middleware/bearer-token')
const errorHandler = require('./middleware/error-handler')
const fandomsRouter = require('./fandoms/fandoms-router')
const installmentsRouter = require('./installments/installments-router')
const sectionsRouter = require('./sections/sections-router')
const reviewsRouter = require('./reviews/reviews-router')
const tagsRouter = require('./tags/tags-router')
const trelsRouter = require('./tags/trels-router')
const authRouter = require('./auth/auth-router')

const app = express();

const morganOption = (NODE_ENV === 'production')

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(errorHandler)
// app.use(validateBearerToken);

app.use("/api/auth", authRouter)
app.use("/api/fandoms", fandomsRouter)
app.use("/api/installments", installmentsRouter)
app.use("/api/sections", sectionsRouter)
app.use("/api/reviews", reviewsRouter)
app.use("/api/tags", tagsRouter)
app.use("/api/trels", trelsRouter)
module.exports = app;
