import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateAuthorDto {
    @ApiProperty({ description: 'Name of the author', example: 'John Doe' })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'List of book IDs associated with the author',
        example: [1, 2],
        required: false,
    })
    @IsArray()
    @IsOptional()
    books?: number[];
}
