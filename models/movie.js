const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: [true, 'Поле "link" должно быть заполнено'],
    validate: {
      validator: (value) => {
        validator.isURL(value, {
          protocols: ['http', 'https'],
          require_protocol: true,
        });
      },
      message: 'Некорректная ссылка на изображение',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Поле "link" должно быть заполнено'],
    validate: {
      validator: (value) => {
        validator.isURL(value, {
          protocols: ['http', 'https'],
          require_protocol: true,
        });
      },
      message: 'Некорректная ссылка на изображение',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле "link" должно быть заполнено'],
    validate: {
      validator: (value) => {
        validator.isURL(value, {
          protocols: ['http', 'https'],
          require_protocol: true,
        });
      },
      message: 'Некорректная ссылка на изображение',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле "owner" должно быть заполнено'],
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
