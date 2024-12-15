import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { Book } from 'src/book/entities/book.entity';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) { }

  // Create a new author with associated books
  async create(authorData: CreateAuthorDto): Promise<Author> {
    const { books, ...author } = authorData;

    // Find the books by IDs and associate them with the author
    const bookEntities = await this.bookRepository.findByIds(books || []);
    const newAuthor = this.authorRepository.create({
      ...author,
      books: bookEntities,
    });

    return this.authorRepository.save(newAuthor);
  }

  // Fetch all authors with their books
  async findAll(): Promise<Author[]> {
    return this.authorRepository.find({ relations: ['books'] });
  }

  // Fetch a specific author by ID with their books
  async findOne(id: number): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }

    return author;
  }

  // Update an existing author
  async update(id: number, authorData: UpdateAuthorDto): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }

    const { books, ...updateData } = authorData;

    // If books are provided, update the books associated with the author
    if (books) {
      const bookEntities = await this.bookRepository.findByIds(books);
      author.books = bookEntities;
    }

    // Apply the updates
    Object.assign(author, updateData);
    return this.authorRepository.save(author);
  }

  // Remove an author by ID
  async remove(id: number): Promise<void> {
    const author = await this.authorRepository.findOne({
      where: { id },
    });

    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }

    await this.authorRepository.remove(author);
  }

  async addBookToAuthor(authorId: number, bookId: number): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { id: authorId },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Author with id ${authorId} not found`);
    }

    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found`);
    }

    // Add the book to the author's books array if it's not already present
    if (!author.books.some((b) => b.id === bookId)) {
      author.books.push(book);
      await this.authorRepository.save(author);
    }

    return author;
  }

  async unassignBookFromAuthor(authorId: number, bookId: number): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { id: authorId },
      relations: ['books'],
    });
    if (!author) {
      throw new NotFoundException(`Author with id ${authorId} not found`);
    }
    console.log('auth books0', author.books);
    const book = await author.books.find((b) => {
      console.log('bbbbbbbb', b.id, bookId);
      if (bookId === b.id) {
        return true;
      }
    });
    console.log('books we have here@', book);
    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found in author's books`);
    }

    // Remove the book from the author's books
    author.books = author.books.filter((b) => b.id !== bookId);
    console.log('aaaaaaaaaaaaaaaaaaaaaaa', author)
    // Save the updated author
    return await this.authorRepository.save(author);
  }
}
