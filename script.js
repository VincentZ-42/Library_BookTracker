const booksRead = document.getElementById('books-read');
const booksTotal = document.getElementById('books-total');
const clearLibraryBtn = document.getElementById('clearAll');
const addBookBtn = document.getElementById('add-book');
const bookList = document.querySelector('#table-body');
const form = document.querySelector('form');
let myLibrary = [];

function Book(title, author, pages, status) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
}

// Shows number of books in Library
function showStats() {
  let readCount = 0;
  myLibrary.forEach(book => {
    if (book.status === true) {
      readCount += 1;
    }
  });
  booksRead.textContent = readCount;
  booksTotal.textContent = myLibrary.length;
}

/* Ulility Functions */

function clearLibrary() {
  do {
    myLibrary.pop();
  } while (myLibrary.length > 0)
}

function addBookToLibrary(book) {
  myLibrary.push(book);
  showLibrary();
}

function prepareInput(event) {
  event.preventDefault();
  const title = document.getElementById('title');
  const author = document.getElementById('author');
  const pages = document.getElementById('pages');
  const checkbox = document.getElementById('checkbox');
  const readStatus = checkbox.checked ? true : false;
  const book = new Book(
    title.value, 
    author.value, 
    pages.value,
    readStatus);
  addBookToLibrary(book);
  form.reset();
}

/* Main Functions */

function showLibrary() {
  // SAVE TO LOCAL STORAGE
  localStorage.setItem('books', JSON.stringify(myLibrary));
  showStats();
  bookList.textContent = '';

  for (let i = 0; i < myLibrary.length; i += 1) {
    const bookRow = document.createElement('tr');
    bookRow.classList.add('book-info');
    bookList.appendChild(bookRow);

    // TITLE
    const bookTitle = document.createElement('td');
    bookTitle.textContent = myLibrary[i].title;
    bookRow.appendChild(bookTitle);

    // AUTHOR
    const bookAuthor = document.createElement('td');
    bookAuthor.textContent = myLibrary[i].author;
    bookRow.appendChild(bookAuthor);

    // PAGES
    const bookPages = document.createElement('td');
    bookPages.textContent = myLibrary[i].pages;
    bookRow.appendChild(bookPages);

    // STATUS BUTTON
    const bookStatus = document.createElement('td');
    const statusSymbol = document.createElement('i');
    if (myLibrary[i].status === false) {
      statusSymbol.classList.add('fas', 'fa-times');
    } else {
      statusSymbol.classList.add('fas', 'fa-check');
    }
    bookStatus.appendChild(statusSymbol);
    bookRow.appendChild(bookStatus);

    // REMOVAL BUTTON
    const bookDelete = document.createElement('td');
    const deleteSymbol = document.createElement('i');
    deleteSymbol.classList.add('fas', 'fa-trash-alt');
    bookDelete.appendChild(deleteSymbol);
    bookRow.appendChild(bookDelete);
  }
}

function listenEvents() {
  document.addEventListener('click', (event) => {
    const {target} = event;
    const tr = target.parentNode.parentNode.rowIndex - 1;
    if (target.id === 'add-book') {
      prepareInput(event);
    } else if (target.id === 'clearAll') {
      clearLibrary();
    } else if (target.classList.contains('fa-trash-alt')) {
      myLibrary.splice(tr, 1);
    } else if (target.classList.contains('fa-check')) {
      target.classList.remove('fa-check');
      target.classList.add('fa-times');
      myLibrary[tr].status = false;
    } else if (target.classList.contains('fa-times')) {
      target.classList.remove('fa-times');
      target.classList.add('fa-check');
      myLibrary[tr].status = true;
    }
    showLibrary();
  });
}

window.onload = () => {
  if (localStorage.getItem('books') === null) {
    myLibrary =[]
  } else {
    myLibrary = JSON.parse(localStorage.getItem('books'));
  }
  showLibrary();
  listenEvents();
};