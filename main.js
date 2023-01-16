
document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const term = document.getElementById('searchBookTitle').value;
    const txt = JSON.parse(localStorage.getItem("BOOKSHELF_APPS"));

    Array.from(txt).forEach((book) => {
      const titleBook = book.title;

      if (titleBook.indexOf(term) != -1) {
        const uncompletedBookshelfList = document.getElementById('incompleteBookshelfList');
        uncompletedBookshelfList.innerHTML = '';
      
        const completeBookshelfList = document.getElementById('completeBookshelfList');
        completeBookshelfList.innerHTML = '';
        const bookElement = makeBook(book);

          if (!book.isCompleted)
            uncompletedBookshelfList.append(bookElement);
          else
            completeBookshelfList.append(bookElement);
      } 
    });
  });


  if(isStorageExist()) {
    loadDataFromStorage();
  }
});

const books = [];
const RENDER_EVENT = 'render-book';

function addBook() {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = parseInt(document.getElementById('inputBookYear').value);
  const isComplete= document.getElementById('inputBookIsComplete').checked;
 
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, title, author, year, isComplete);
  books.push(bookObject);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}
 
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

function makeBook(bookObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;

  const textPenulis = document.createElement('p');
  textPenulis.innerText = 'Penulis : ' + bookObject.author;

  const textTahun = document.createElement('p');
  textTahun.innerText ='Tahun : ' + bookObject.year;
 
  const actionContainer = document.createElement('div');
  actionContainer.setAttribute('class', 'action');
 
  const container = document.createElement('article');
  container.setAttribute('class', 'book_item' );
  container.classList.add('item', 'shadow');
  container.append(textTitle, textPenulis, textTahun);
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isCompleted) {

    const incompletedButton = document.createElement('button');
    incompletedButton.classList.add('green');
    incompletedButton.innerText='Belum selesai dibaca';
    incompletedButton.addEventListener('click', function () {
      undoBookFromCompleted(bookObject.id);
    });
  
    const deleteButton = document.createElement('button');
      deleteButton.classList.add('red');
      deleteButton.innerText='Hapus';
    deleteButton.addEventListener('click', function () {
      if(confirm("Apakah anda yakin akan menghapus buku tersebut?")){
        removeBookFromCompleted(bookObject.id);
      }
    });

    actionContainer.append(incompletedButton, deleteButton);
    container.append(actionContainer);
  } else {
    const completedButton = document.createElement('button');
    completedButton.classList.add('green');
    completedButton.innerText='Selesai dibaca';
  
    completedButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });
  
    const deleteButton = document.createElement('button');
      deleteButton.classList.add('red');
      deleteButton.innerText='Hapus';
    deleteButton.addEventListener('click', function () {
      if(confirm("Apakah anda yakin akan menghapus buku tersebut?")){
        removeBookFromCompleted(bookObject.id);
      }
    });

    actionContainer.append(completedButton, deleteButton);
    container.append(actionContainer);
  }

  return container;
}

function addBookToCompleted (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return;
 
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
 
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function saveData() {
  if(isStorageExist()){
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookshelfList = document.getElementById('incompleteBookshelfList');
  uncompletedBookshelfList.innerHTML = '';
 
  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';
 
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
   
    if (!bookItem.isCompleted)
      uncompletedBookshelfList.append(bookElement);
    else
      completeBookshelfList.append(bookElement);
  }
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}
