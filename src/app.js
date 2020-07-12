const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const morgan = require('morgan');
const config = require('./utils/config');
const { handleError } = require('./utils/handleError');

const app = express();

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

// for ejs files
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//  middlewares
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multerMid.single('file'));

// home page
app.get('/', (req, res) => res.send('Server ready! Visit "/api" for API Service!'));

// Api Route
app.use('/api', require('./api/index.js'));

// Invalid Endpoint
app.get('*', (req, res) => {
  res.status(404).send('API Endpoint Not Found!');
});

// Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  handleError(err, req, res);
});

const port = config.port || 4000;

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server ready at http://localhost:${port}`));
