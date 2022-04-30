const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    this.message = `${message} Not Found`;
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
