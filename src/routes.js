const {
  addBookHandler,
  getAllBookHandler,
  getBookbyIdHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBookHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookbyIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: getBookbyIdHandler,
  },
];

module.exports = routes;
