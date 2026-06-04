import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venta } from '../../ventas/entities/venta.entity';
import { MetodoPago } from '../../metodos-pago/entities/metodo-pago.entity';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monto: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  // Relaciones
  @ManyToOne(() => Venta, (venta) => venta.pagos)
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;

  @Column({ name: 'venta_id' })
  ventaId: number;

  @ManyToOne(() => MetodoPago, (metodoPago) => metodoPago.pagos)
  @JoinColumn({ name: 'metodo_pago_id' })
  metodoPago: MetodoPago;

  @Column({ name: 'metodo_pago_id' })
  metodoPagoId: number;
}
