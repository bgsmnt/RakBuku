// Function to save book to localStorage
function saveBookToLocalStorage(books) {
  localStorage.setItem('books', JSON.stringify(books));
}

// Function to load books from localStorage
function loadBooksFromLocalStorage() {
  return JSON.parse(localStorage.getItem('books')) || [];
}

// Function to get book list from localStorage
function getBookList() {
  return JSON.parse(localStorage.getItem('books')) || [];
}

// Function to create book item HTML
function createBookItem(book) {
  const { id, title, author, year, isComplete } = book;

  const bookContainer = document.createElement('div');
  bookContainer.setAttribute('data-bookid', id);
  bookContainer.setAttribute('data-testid', 'bookItem');

  const titleElem = document.createElement('h3');
  titleElem.setAttribute('data-testid', 'bookItemTitle');
  titleElem.textContent = title;
  bookContainer.appendChild(titleElem);

  const authorElem = document.createElement('p');
  authorElem.setAttribute('data-testid', 'bookItemAuthor');
  authorElem.textContent = `Penulis: ${author}`;
  bookContainer.appendChild(authorElem);

  const yearElem = document.createElement('p');
  yearElem.setAttribute('data-testid', 'bookItemYear');
  yearElem.textContent = `Tahun: ${year}`;
  bookContainer.appendChild(yearElem);

  const buttonContainer = document.createElement('div');

  const completeButton = document.createElement('button');
  completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  completeButton.textContent = isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  completeButton.addEventListener('click', function() {
    toggleBookCompletion(id);
  });
  buttonContainer.appendChild(completeButton);

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.textContent = 'Hapus Buku';
  deleteButton.addEventListener('click', function() {
    deleteBook(id);
  });
  buttonContainer.appendChild(deleteButton);

  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.textContent = 'Edit Buku';
  editButton.addEventListener('click', function() {
    editBook(id);
  });
  buttonContainer.appendChild(editButton);

  bookContainer.appendChild(buttonContainer);

  return bookContainer;
}

// Function to add book to incomplete list
function addBookToIncompleteList(book) {
  const bookContainer = createBookItem(book);
  const incompleteBookList = document.getElementById('incompleteBookList');
  incompleteBookList.appendChild(bookContainer);
}

// Function to add book to complete list
function addBookToCompleteList(book) {
  const bookContainer = createBookItem(book);
  const completeBookList = document.getElementById('completeBookList');
  completeBookList.appendChild(bookContainer);
}

// Function to add a new book
function addNewBook(id, title, author, year, isComplete) {
  const newBook = {
    id,
    title,
    author,
    year: Number(year), // Ensure year is stored as a number
    isComplete,
  };

  const books = getBookList();
  books.push(newBook);
  saveBookToLocalStorage(books);

  if (isComplete) {
    addBookToCompleteList(newBook);
  } else {
    addBookToIncompleteList(newBook);
  }
}

// Function to handle book form submission
const bookForm = document.getElementById('bookForm');
bookForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  addNewBook(Date.now().toString(), title, author, year, isComplete);

  bookForm.reset();
});

// Function to handle search book form submission
const searchBookForm = document.getElementById('searchBook');
searchBookForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  const books = getBookList();
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  books
    .filter(book => book.title.toLowerCase().includes(searchTitle))
    .forEach(book => {
      if (book.isComplete) {
        addBookToCompleteList(book);
      } else {
        addBookToIncompleteList(book);
      }
    });
});

// Function to toggle book completion status
function toggleBookCompletion(id) {
  const books = getBookList();
  const bookIndex = books.findIndex(book => book.id === id);

  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveBookToLocalStorage(books);

    const bookContainer = document.querySelector(`[data-bookid="${id}"]`);
    const completeButton = bookContainer.querySelector('[data-testid="bookItemIsCompleteButton"]');

    bookContainer.remove();
    
    if (books[bookIndex].isComplete) {
      completeButton.textContent = 'Belum selesai dibaca';
      addBookToCompleteList(books[bookIndex]);
    } else {
      completeButton.textContent = 'Selesai dibaca';
      addBookToIncompleteList(books[bookIndex]);
    }
  }
}

// Function to delete book
function deleteBook(id) {
  const books = getBookList();
  const filteredBooks = books.filter(book => book.id !== id);

  saveBookToLocalStorage(filteredBooks);

  const bookContainer = document.querySelector(`[data-bookid="${id}"]`);
  bookContainer.remove();
}

// Function to edit book (placeholder function)
function editBook(id) {
  // Placeholder function for editing book details
  console.log(`Edit book with ID ${id}`);
}

// Load books when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  const books = loadBooksFromLocalStorage();

  books.forEach(book => {
    if (book.isComplete) {
      addBookToCompleteList(book);
    } else {
      addBookToIncompleteList(book);
    }
  });
});
