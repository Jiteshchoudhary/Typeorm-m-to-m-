import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@ApiTags('Authors')
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) { }

  @Post()
  @ApiResponse({ status: 201, description: 'The author has been successfully created.', type: Author })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of authors.', type: [Author] })
  findAll() {
    return this.authorService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Author details.', type: Author })
  @ApiResponse({ status: 404, description: 'Author not found.' })
  findOne(@Param('id') id: string) {
    return this.authorService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'The author has been successfully updated.', type: Author })
  @ApiResponse({ status: 404, description: 'Author not found.' })
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(+id, updateAuthorDto);
  }

  // @Delete(':id')
  // @ApiResponse({ status: 200, description: 'The author has been successfully deleted.' })
  // @ApiResponse({ status: 404, description: 'Author not found.' })
  // remove(@Param('id') id: string) {
  //   return this.authorService.remove(+id);
  // }

  @Post(':authorId/books/:bookId')
  @ApiOperation({ summary: 'Associate a book with an author' })
  @ApiResponse({ status: 200, description: 'Book successfully associated with the author', type: Author })
  @ApiResponse({ status: 404, description: 'Author or Book not found' })
  async addBookToAuthor(
    @Param('authorId') authorId: number,
    @Param('bookId') bookId: number,
  ): Promise<Author> {
    return this.authorService.addBookToAuthor(authorId, bookId);
  }

  @Delete(':authorId/books/:bookId')
  @ApiOperation({ summary: 'Unassign a book from an author' })
  @ApiResponse({
    status: 200,
    description: 'The book has been unassigned from the author.',
    type: Author,
  })
  async unassignBookFromAuthor(
    @Param('authorId') authorId: number,
    @Param('bookId') bookId: number,
  ): Promise<Author> {
    return await this.authorService.unassignBookFromAuthor(authorId, bookId);
  }
}
