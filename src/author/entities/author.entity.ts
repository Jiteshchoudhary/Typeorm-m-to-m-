import { Book } from "src/book/entities/book.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "author" })
export class Author {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    @ManyToMany(() => Book, (book) => book.authors)
    @JoinTable({
        name: "author_books",
        joinColumns: [{
            name: "author_id",
            referencedColumnName: "id"
        }],
        inverseJoinColumns: [{
            name: "book_id",
            referencedColumnName: "id"
        }],
    })
    books: Book[];
}
