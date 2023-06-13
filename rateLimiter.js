const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // ограничение на 100 запросов с одного IP
  message: 'Слишком много запросов с вашего IP, попробуйте позже.',
});

module.exports = limiter;
