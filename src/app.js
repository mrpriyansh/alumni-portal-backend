const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const config = require('./utils/config');

const app = express();

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multerMid.single('file'));

app.use('/api', require('./api/index.js'));

app.get('*', (req, res) => {
  res.status(404).send('You did something wrong!');
});

const port = config.port || 3001;

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`API server ready at http://localhost:${port}`));
