import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@supabase/supabase-js';

@UseGuards(SupabaseAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.categoriesService.findAll(user.id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.categoriesService.remove(user.id, id);
  }
}
