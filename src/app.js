
const path = require('path');
const bodyParser = require('body-parser');
const errorHandlersMiddleware = require('./api/error-handlers-middleware')
const cors = require('cors')
const express = require('express')
const app = express();
const winstonLogger = require('./services/winston-logger')

winstonLogger.configure()
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(require(`./api/routes`))

errorHandlersMiddleware(app)

module.exports = app


