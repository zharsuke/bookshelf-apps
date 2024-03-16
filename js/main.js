let books = [];
const RENDER_EVENT = 'RENDER_BOOKS';

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

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function createBook(bookObject) {
    const { id, title, author, year, isCompleted } = bookObject;

    const bookTitle = document.createElement('h3');
    bookTitle.innerText = title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = 'Penulis: ' + author;

    const bookYear = document.createElement('p');
    bookYear.innerText = 'Tahun: ' + year;

    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book_item');
    bookContainer.append(bookTitle, bookAuthor, bookYear);

    const container = document.createElement('article');
    container.classList.add('book_item', 'action');
    container.setAttribute('id', `book-${id}`);

    if (isCompleted) {
        const uncompletedButton = document.createElement('button');
        uncompletedButton.classList.add('green');
        uncompletedButton.innerText = 'Belum Selesai Dibaca';
        uncompletedButton.addEventListener('click', function () {
            addBookToUncompleted(id);
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('red');
        removeButton.innerText = 'Hapus Buku';
        removeButton.addEventListener('click', function () {
            removeBook(id);
        });

        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action');
        actionContainer.append(uncompletedButton, removeButton);

        container.append(bookContainer, actionContainer);
    } else {
        const completedButton = document.createElement('button');
        completedButton.classList.add('green');
        completedButton.innerText = 'Selesai Dibaca';
        completedButton.addEventListener('click', function () {
            addBookToCompleted(id);
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('red');
        removeButton.innerText = 'Hapus Buku';
        removeButton.addEventListener('click', function () {
            removeBook(id);
        });

        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action');
        actionContainer.append(completedButton, removeButton);

        container.append(bookContainer, actionContainer);
    }

    return container;
}


function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;
    const generatedId = generateId();
    const bookObject = generateBookObject(generatedId, bookTitle, bookAuthor, bookYear, isCompleted);
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget === null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookToUncompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget === null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {
    const submitform = document.getElementById('inputBook');
    submitform.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBooks();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function searchBooks() {
    const searchTitleInput = document.getElementById('searchBookTitle');
    const searchTitle = searchTitleInput.value.trim().toLowerCase();

    if (searchTitle === '') {
        document.dispatchEvent(new Event(RENDER_EVENT));
    } else {
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));


        const uncompletedBookList = document.getElementById('incompleteBookshelfList');
        const completedBookList = document.getElementById('completeBookshelfList');
        uncompletedBookList.innerHTML = '';
        completedBookList.innerHTML = '';
        filteredBooks.forEach(bookItem => {
            const bookElement = createBook(bookItem);
            if (bookItem.isCompleted) {
                completedBookList.append(bookElement);
            } else {
                uncompletedBookList.append(bookElement);
            }
        });
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    const completedBookList = document.getElementById('completeBookshelfList');

    uncompletedBookList.innerHTML = '';
    completedBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = createBook(bookItem);
        if (bookItem.isCompleted) {
            completedBookList.append(bookElement);
        } else {
            uncompletedBookList.append(bookElement);
        }
    }
});

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const bookItem of data) {
            books.push(bookItem);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}