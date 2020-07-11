const writeToFile = require('./writeToFile');

class ErrorHandler extends Error {
  constructor(statusCode, message, urgent, errorLog) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.urgent = urgent;
    this.errorLog = errorLog;
  }
}

const handleError = (err, req, res) => {
  //   console.log(err);
  const { statusCode, message, urgent, errorLog } = err;
  if (Number.isInteger(statusCode)) {
    if (urgent) writeToFile(errorLog);
    res.status(statusCode).json(message);
  } else {
    writeToFile(`Route - ${req.route.path}\n\t${JSON.stringify(err)}`);
    res.status(500).json('Server Error');
  }
};

module.exports = { ErrorHandler, handleError };
