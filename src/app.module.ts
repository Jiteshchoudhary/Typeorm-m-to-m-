import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { Author } from './author/entities/author.entity';
import { Book } from './book/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "postgres",
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123456',
    database: 'program-management',
    entities: [Author, Book],
    synchronize: true,
  }), AuthorModule, BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
