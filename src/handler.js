// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');
const books = require('./books');

// add book
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);

  const finished = pageCount === readPage;

  const insertedAt = new Date().toISOString();

  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  // response  when name = null
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // response  when readPage more than pageCOunt
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // ressponse when id already exist
  if (!isSuccess) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // response when all passed
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

// get all boook
const getAllBookHandler = () => {
  const bookData = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  if (books.length > 0) {
    const getAll = {
      status: 'success',
      data: {
        books: bookData,
      },
    };
    return getAll;
  }

  const getAll = {
    status: 'success',
    data: {
      books: [],
    },
  };
  return getAll;
};

// getBookByIdHandler for detail
const getBookbyIdHandler = (request, h) => {
  const { bookId } = request.params;

  const filteredBook = books.find((book) => book.id === bookId)[0];

  if (filteredBook !== undefined) {
    return {
      status: 'success',
      data: {
        book: filteredBook,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  // response when id exixst
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // response when name null
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
};
module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookbyIdHandler,
};
