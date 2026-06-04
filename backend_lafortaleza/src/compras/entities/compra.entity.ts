import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetalleCompra } from '../../detalles-compra/entities/detalle-compra.entity';

@Entity('compras')
export class Compra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => Proveedor, (proveedor) => proveedor.compras)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;

  @Column({ name: 'proveedor_id' })
  proveedorId: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.compras)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @OneToMany(() => DetalleCompra, (detalle) => detalle.compra)
  detalles: DetalleCompra[];
}
