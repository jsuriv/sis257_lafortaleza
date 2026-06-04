import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 255, nullable: true })
  descripcion: string;

  @Column({ length: 500, nullable: true })
  imagen: string;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[];
}
