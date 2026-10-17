import { IsDateString, IsInt, isInt, IsString, Min, MinLength } from "class-validator";

export class CreateEventDto {
    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    description: string;

    @IsDateString()
    date: string;

    @IsString()
    city: string;

    @IsString()
    location: string;

    @IsString()
    category: string;

    @IsInt()
    @Min(1)
    capacity: number;
}