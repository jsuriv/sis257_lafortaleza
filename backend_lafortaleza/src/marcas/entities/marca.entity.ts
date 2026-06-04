import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('marcas')
export class Marca {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ name: 'pais_origen', length: 100, nullable: true })
  paisOrigen: string;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @OneToMany(() => Producto, (producto) => producto.marca)
  productos: Producto[];
}
