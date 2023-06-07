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

  // response  when name null and undefined
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

  books.push(newBook);
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

// get all book
const getAllBookHandler = (request, h) => {
  const {
    name, reading, finished,
  } = request.query;
  let filteredBooks = books;
  // query by no-case-sensitive
  if (name) {
    filteredBooks = filteredBooks.filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase()),
    );

    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      },
    });
    return response;
  }

  // query by reading status true
  if (reading === '1') {
    filteredBooks = filteredBooks.filter((book) => book.reading === true);

    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      },
    });
    return response;
  }

  // query by reading status false
  if (reading === '0') {
    filteredBooks = filteredBooks.filter((book) => book.reading === false);

    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      },
    });
    return response;
  }

  // query by finished status true
  if (finished === '1') {
    filteredBooks = filteredBooks.filter((book) => book.finished === true);

    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      },
    });
    return response;
  }
  // query by finished status true
  if (finished === '0') {
    filteredBooks = filteredBooks.filter((book) => book.finished === false);
    const response = h.response({
      status: 'success',
      data: {
        books: filteredBooks,
      },
    });
    return response;
  }

  const bookData = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  if (books.length > 0) {
    return {
      status: 'success',
      data: {
        books: bookData,
      },
    };
  }

  return {
    status: 'success',
    data: {
      books: [],
    },
  };
};

// get book by id for detail
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const filteredBook = books.find((book) => book.id === bookId);
  // response when id find
  if (filteredBook !== undefined) {
    return {
      status: 'success',
      data: {
        book: filteredBook,
      },
    };
  }
  // response when id not found
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// edit book by id
const editBookByIdHandler = (request, h) => {
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
  // response when name null or undefined
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // response when read page more than page count
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

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
  // response when id not found
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// delete book by id
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  // response when delete success
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // response when id not found
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
