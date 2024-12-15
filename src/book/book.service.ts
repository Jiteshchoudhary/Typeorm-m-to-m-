import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) { }

  // Create a new book
  async create(bookData: any) {
    const newBook = this.bookRepository.create(bookData);
    return await this.bookRepository.save(newBook);
  }

  // Fetch all books with their authors
  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({ relations: ['authors'] });
  }

  // Fetch a specific book by ID with its authors
  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['authors'],
    });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  // Update an existing book
  async update(id: number, bookData: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    Object.assign(book, bookData);
    return this.bookRepository.save(book);
  }

  // Delete a book by ID
  async remove(id: number): Promise<void> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    await this.bookRepository.remove(book);
  }
}
