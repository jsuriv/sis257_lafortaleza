import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Venta } from '../../ventas/entities/venta.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ name: 'ci_nit', length: 50, nullable: true })
  ciNit: string;

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
  @OneToMany(() => Venta, (venta) => venta.cliente)
  ventas: Venta[];
}
