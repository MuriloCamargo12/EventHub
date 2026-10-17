import { IsDateString, IsOptional, IsString } from "class-validator";

export class FilterEventsDto {
    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    category?: string;
    
    @IsOptional()
    @IsDateString()
    date?: string;
}