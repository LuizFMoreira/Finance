import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  // Injetamos a nossa conexão com o Supabase aqui
  constructor(private readonly supabase: SupabaseService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // Mandamos o Supabase inserir os dados na tabela 'categories'
    const { data, error } = await this.supabase.getClient()
      .from('categories')
      .insert([createCategoryDto])
      .select();

    // Se o banco de dados reclamar de algo, nós avisamos o erro
    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    // Se der tudo certo, devolvemos a categoria criada
    return data;
  }
}