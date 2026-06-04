import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Pago } from '../../pagos/entities/pago.entity';

@Entity('metodos_pago')
export class MetodoPago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nombre: string;

  @Column({ length: 255, nullable: true })
  descripcion: string;

  // Relaciones
  @OneToMany(() => Pago, (pago) => pago.metodoPago)
  pagos: Pago[];
}
