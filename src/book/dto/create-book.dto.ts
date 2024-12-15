import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
    @ApiProperty({ description: 'Title of the book', example: 'The Great Book' })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'List of author IDs associated with the book',
        example: [1],
        required: false,
    })
    @IsArray()
    @IsOptional()
    authors?: number[];
}
