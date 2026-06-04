import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('promociones')
export class Promocion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 500, nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  descuento: number; // e.g. 15.00 for 15%

  @Column({ name: 'fecha_inicio', type: 'timestamp' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'timestamp' })
  fechaFin: Date;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Producto, (producto) => producto.promocion)
  productos: Producto[];
}
