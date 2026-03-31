import { Controller, Post, Get, Body } from '@nestjs/common'; // Adicione o Get aqui no import!
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // NOVA ROTA: Quando alguém fizer um GET em /categories, ele cai aqui
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }
}