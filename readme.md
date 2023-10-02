Bookshelf Apps

### Schema
Book
{
  id: +new Date()
  title: string;
  author: string;
  year: string;
  coverUrl: string;
  isComplete: boolean;
  completedAt: string;
  archivedAt: string;
  deletedAt: string;
}

### Some code tips
- Check localstorage first on init
- Remove comment
- Use Formatter
- 

### TODO
- [ ] searching by title, year, author, completed date
- [ ] Custom dialog to archive/delete buku
- [ ] Edit book, use Modal?
