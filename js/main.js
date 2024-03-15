const books = [];
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
    bookAuthor.innerText = author;

    const bookYear = document.createElement('p');
    bookYear.innerText = year;

    const bookContainer = document.createElement('div');
    bookContainer.classList.add('inner');
    bookContainer.append(bookTitle, bookAuthor, bookYear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.setAttribute('id', `book-${id}`);

    if (isCompleted) {
        
        const uncompletedButton = document.createElement('button');
        uncompletedButton.classList.add('green');
        uncompletedButton.addEventListener('click', function() {
            uncompletedBookFromCompleted(id);
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('red');
        removeButton.addEventListener('click', function () {
            removeBookFromCompleted(id);
        });

        container.append(uncompletedButton, removeButton);
    } else {
        
    }
}

function deleteBook() {

}