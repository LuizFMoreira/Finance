import { Controller, Post, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // O @Post indica que essa rota serve para CRIAR algo novo (receber dados)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    // Repassamos o que recebemos no @Body para o nosso Service trabalhar
    return this.categoriesService.create(createCategoryDto);
  }
}