const KEY_LOCAL_LAYOUT = "LOCAL_LAYOUT";

// local storage check
window.addEventListener("load", () => {
  if (!isLocalStorageSupport()) {
    alert("Your browser didn't support local storage");
  }
});

const isLocalStorageSupport = () => typeof localStorage !== "undefined";

const $modalAddBook = document.querySelector("#modal-add-book");
const $modalDeleteBook = document.querySelector("#modal-delete-book");

const $formBookSearch = document.querySelector("#form-book-search");

const $formAddBook = document.querySelector("#form-add-book");
const $bookTitle = document.querySelector(["input[name=title]"]);
const $bookDescription = document.querySelector(["input[name=description]"]);
const $bookCoverUrl = document.querySelector(["input[name=coverUrl]"]);
const $bookAuthor = document.querySelector(["input[name=author]"]);
const $bookYear = document.querySelector(["input[name=year]"]);
const $completed = document.querySelector(["input[name=isComplete]"]);
const $bookCoverPreview = document.querySelector("#book-cover-preview");

const $bookshelfCompleted = document.querySelector("#bookshelf-completed");
const $bookshelfUncompleted = document.querySelector("#bookshelf-uncompleted");
const $bookTotal = document.querySelector("#book-total");
const $bookCompletedCount = document.querySelector("#book-completed-count");
const $bookUncompletedCount = document.querySelector("#book-uncompleted-count");

const $buttonDeleteBook = $modalDeleteBook.querySelector(
  "#modal-delete-book-submit"
);

// states
let currentBookId = null;
let keyword = "";

const bookFilters = (books) => {
  return books.filter((book) => {
    const regex = new RegExp(keyword, "ig");

    const matchTitle = book.title.match(regex);
    const matchAuthor = book.author.match(regex);
    const matchDescription = book.author.match(regex);

    return matchTitle || matchAuthor || matchDescription;
  });
};

const renderCompletedBooks = () => {
  const books = new Book();
  const completedBooks = books.getCompleted();

  const filteredBooks = bookFilters(completedBooks);

  $bookCompletedCount.textContent = `Completed (${filteredBooks.length})`;

  if (filteredBooks.length === 0) {
    const html = `
      <div class="empty">
        <p>No one book is found</p>
      </div>
    `;
    $bookshelfCompleted.innerHTML = html;
    return;
  }

  const html = filteredBooks
    .map(
      (book) => `
    <div class="book-card" key="${book.id}">
      ${
        book.coverUrl
          ? `
            <div>
              <img class="book-cover"
                src="${book.coverUrl}" alt="">
            </div>
          `
          : ""
      }
      <div>
        <p class="text-success">Completed at: ${formatDate(
          book.completedAt
        )}</p>
        <h4 class="book-title">${book.title}</h4>
        <p class="book-publisher">${book.year || "?"} - ${book.author}</p>
        <p class="book-description">${book.description || "No description"}</p>
        <div class="book-toolbar">
          <button class="book-complete-toggle">
            <i class="bi bi-x"></i>
            Uncomplete
          </button>
          <button class="book-remove" toggle-modal modal-id="modal-delete-book">Remove</button>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  $bookshelfCompleted.innerHTML = html;
};

const renderUncompletedBooks = () => {
  const books = new Book();
  const uncompletedBooks = books.getUncompleted();

  const filteredBooks = bookFilters(uncompletedBooks);

  $bookUncompletedCount.textContent = `Uncompleted (${filteredBooks.length})`;

  if (filteredBooks.length === 0) {
    const html = `
      <div class="empty">
        <p>No one book is found</p>
      </div>
    `;
    $bookshelfUncompleted.innerHTML = html;
    return;
  }

  const html = filteredBooks
    .map(
      (book) => `
    <div class="book-card" key="${book.id}">
      ${
        book.coverUrl
          ? `
            <div>
              <img class="book-cover"
                src="${book.coverUrl}" alt="">
            </div>
          `
          : ""
      }
      <div>
        <h4 class="book-title">${book.title}</h4>
        <p class="book-publisher">${book.year || "?"} - ${book.author}</p>
        <p class="book-description">${book.description || "No description"}</p>
        <div class="book-toolbar">
          <button class="book-complete-toggle">
            <i class="bi-check"></i>
            Complete
          </button>
          <button class="book-remove" toggle-modal modal-id="modal-delete-book">Remove</button>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  $bookshelfUncompleted.innerHTML = html;
};

const renderBookTotal = () => {
  const books = new Book();
  const allBooks = books.getAll();

  const filteredBooks = bookFilters(allBooks);

  $bookTotal.textContent = `Books Total: ${filteredBooks.length}`;
};

const syncUI = () => {
  renderCompletedBooks();
  renderUncompletedBooks();
  renderBookTotal();
};

document.addEventListener("DOMContentLoaded", (e) => {
  const books = new Book();

  syncUI();

  // event listener search
  $formBookSearch.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const search = data.get("search");

    keyword = search;
    syncUI();
  });

  // on book delete click
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("book-remove")) {
      const bookId = e.target.closest(".book-card").getAttribute("key");

      currentBookId = bookId;
    }
  });

  // on complete click
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("book-complete-toggle")) {
      const bookId = e.target.closest(".book-card").getAttribute("key");
      const book = books.getById(bookId);

      if (!book) return;

      const updatedBook = {
        ...book,
        completedAt: book.isComplete ? null : generateId(),
        isComplete: !book.isComplete,
      };

      books.updateById(bookId, updatedBook);
      syncUI();
    }
  });

  // on book delete confirm click
  $buttonDeleteBook.addEventListener("click", (e) => {
    const books = new Book();
    books.removeById(currentBookId);
    syncUI();
    $modalDeleteBook.classList.remove("show");
  });

  // on add book submit
  $formAddBook.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = $bookTitle.value;
    const coverUrl = document.querySelector(["input[name=coverUrl]"]).value;
    const author = document.querySelector(["input[name=author]"]).value;
    const description = document.querySelector([
      "textarea[name=description]",
    ]).value;
    const year = document.querySelector(["input[name=year]"]).value;
    const isComplete = document.querySelector([
      "input[name=isComplete]:checked",
    ]).value;

    books.insert({
      title,
      description,
      coverUrl,
      author,
      year,
      isComplete: isComplete === "yes",
    });

    $formAddBook.reset();
    $bookCoverUrl.dispatchEvent(new Event("change"));
    $modalAddBook.classList.remove("show");

    if (isComplete === "yes") {
      renderCompletedBooks();
    } else {
      renderUncompletedBooks();
    }
  });
});

// on img cover preview depend on book cover url field
$bookCoverUrl.addEventListener("change", (e) => {
  const { value } = e.target;

  if (value) {
    $bookCoverPreview.setAttribute("src", value);
  } else {
    $bookCoverPreview.setAttribute("src", "./img/cover-placeholder.png");
  }
});

const formatDate = (dateNumber) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "Juny",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(dateNumber);
  const year = date.getFullYear();
  const day = date.getDate();
  const month = date.getMonth();

  return `${day} ${months[month]} ${year}`;
};

const generateId = () => +new Date();

class Book {
  KEY_LOCAL_BOOKS = "LOCAL_BOOKS";

  constructor() {
    this.getAll();
  }

  getAll = () => {
    const rawBooks = localStorage.getItem(this.KEY_LOCAL_BOOKS);

    if (rawBooks === null) {
      localStorage.setItem(this.KEY_LOCAL_BOOKS, JSON.stringify([]));
    }

    const books = JSON.parse(rawBooks);

    return books;
  };
  getCompleted = () => this.getAll().filter((book) => book.isComplete);
  getUncompleted = () => this.getAll().filter((book) => !book.isComplete);
  getById = (id) => this.getAll().find((book) => book.id == id);
  insert = (book) => {
    const newBook = {
      id: generateId(),
      title: book.title,
      description: book.description,
      author: book.author,
      year: book.year,
      coverUrl: book.coverUrl,
      isComplete: book.isComplete,
      completedAt: book.isComplete ? +new Date() : null,
      archivedAt: null,
    };

    const books = this.getAll();

    books.push(newBook);
    this.update(books);

    return newBook;
  };
  update = (books) => {
    localStorage.setItem(this.KEY_LOCAL_BOOKS, JSON.stringify(books));
  };
  updateById = (id, book) => {
    const allBooks = this.getAll();

    const index = allBooks.findIndex((book) => book.id == id);
    if (index < 0) return null;

    allBooks[index] = {
      ...allBooks[index],
      ...book,
    };
    this.update(allBooks);
  };
  removeById = (id) => {
    const filtered = this.getAll().filter((book) => book.id != id);
    this.update(filtered);
  };
}
