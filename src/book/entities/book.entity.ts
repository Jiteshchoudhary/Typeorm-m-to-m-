import { Author } from "src/author/entities/author.entity";
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "book" })
export class Book extends BaseEntity {
    //ek book ke many authore ho sakate he aur belong to bhi many ho sakte he okay got it.

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    title: string;

    @ManyToMany(() => Author, (author) => author.books)
    authors: Author[];
}
