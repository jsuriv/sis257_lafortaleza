import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venta } from '../../ventas/entities/venta.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('detalles_venta')
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;

  // Relaciones
  @ManyToOne(() => Venta, (venta) => venta.detalles)
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;

  @Column({ name: 'venta_id' })
  ventaId: number;

  @ManyToOne(() => Producto, (producto) => producto.detallesVenta)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ name: 'producto_id' })
  productoId: number;
}
