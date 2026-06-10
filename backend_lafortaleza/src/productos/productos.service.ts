import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const producto = this.productoRepository.create(createProductoDto);
    return this.productoRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find({
      relations: ['categoria', 'marca', 'proveedor', 'promocion'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['categoria', 'marca', 'proveedor', 'promocion'],
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    Object.assign(producto, updateProductoDto);
    return this.productoRepository.save(producto);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.softRemove(producto);
  }

  async buscar(termino: string): Promise<Producto[]> {
    return this.productoRepository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .leftJoinAndSelect('producto.marca', 'marca')
      .leftJoinAndSelect('producto.promocion', 'promocion')
      .where('producto.nombre ILIKE :termino', { termino: `%${termino}%` })
      .orWhere('producto.codigo ILIKE :termino', { termino: `%${termino}%` })
      .getMany();
  }

  async getBajoStock(): Promise<Producto[]> {
    return this.productoRepository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .leftJoinAndSelect('producto.marca', 'marca')
      .where('producto.stock <= producto.stockMinimo')
      .andWhere('producto.estado = true')
      .getMany();
  }
}
