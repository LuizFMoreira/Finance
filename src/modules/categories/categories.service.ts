import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly supabase: SupabaseService) {}

  // Nosso POST usa essa aqui:
  async create(createCategoryDto: CreateCategoryDto) {
    const { data, error } = await this.supabase.getClient()
      .from('categories')
      .insert([createCategoryDto])
      .select();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  // NOVA FUNÇÃO: Nosso GET vai usar essa aqui!
  async findAll() {
    // Aqui usamos o .select() vazio para dizer: "Traga TUDO dessa tabela"
    const { data, error } = await this.supabase.getClient()
      .from('categories')
      .select('*'); 

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}