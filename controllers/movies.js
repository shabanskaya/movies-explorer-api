const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка: переданы некорректные данные для создания карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};
/*
module.exports.likeMovie = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.movieId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Произошла ошибка: карточка не найдена');
      } else {
        res.send({ data: movie });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при постановке лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeMovie = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.movieId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Произошла ошибка: карточка не найдена');
      } else {
        res.send({ data: movie });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при удалении лайка'));
      } else {
        next(err);
      }
    });
};
*/
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Произошла ошибка: карточка не найдена');
      } if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Произошла ошибка: недостаточно прав для удаления карточки');
      }
      return Movie.findByIdAndRemove(req.params.movieId);
    })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Произошла ошибка: карточка не найдена');
      } else {
        res.send({ data: movie });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка: карточка с указанным _id не найдена'));
      } else {
        next(err);
      }
    });
};
