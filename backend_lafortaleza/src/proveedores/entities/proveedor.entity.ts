import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Compra } from '../../compras/entities/compra.entity';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 50, nullable: true })
  nit: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 100, nullable: true })
  correo: string;

  @Column({ length: 255, nullable: true })
  direccion: string;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @OneToMany(() => Producto, (producto) => producto.proveedor)
  productos: Producto[];

  @OneToMany(() => Compra, (compra) => compra.proveedor)
  compras: Compra[];
}
