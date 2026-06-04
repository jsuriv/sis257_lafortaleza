import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from '../detalles-venta/entities/detalle-venta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Pago } from '../pagos/entities/pago.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { AuditoriaService } from '../auditoria/auditoria.service';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    private readonly dataSource: DataSource,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async create(createVentaDto: CreateVentaDto, usuarioAutenticado: Usuario | null = null): Promise<Venta> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { detalles, pagos, ...ventaData } = createVentaDto;

      // Validar stock y calcular total
      let total = 0;
      for (const det of detalles) {
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { id: det.productoId },
        });
        if (!producto) {
          throw new NotFoundException(`Producto con ID ${det.productoId} no encontrado`);
        }
        if (Number(producto.stock) < det.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, Solicitado: ${det.cantidad}`,
          );
        }
        total += det.cantidad * det.precio;
      }

      // Crear venta
      const venta = queryRunner.manager.create(Venta, {
        ...ventaData,
        total,
        fecha: new Date(),
      });
      const savedVenta = await queryRunner.manager.save(venta);

      // Crear detalles y descontar stock
      for (const det of detalles) {
        const subtotal = det.cantidad * det.precio;
        const detalle = queryRunner.manager.create(DetalleVenta, {
          ventaId: savedVenta.id,
          productoId: det.productoId,
          cantidad: det.cantidad,
          precio: det.precio,
          subtotal,
        });
        await queryRunner.manager.save(detalle);

        // Descontar stock
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { id: det.productoId },
        });
        producto!.stock = Number(producto!.stock) - det.cantidad;
        await queryRunner.manager.save(producto!);
      }

      // Registrar pagos
      for (const pago of pagos) {
        const pagoEntity = queryRunner.manager.create(Pago, {
          ventaId: savedVenta.id,
          metodoPagoId: pago.metodoPagoId,
          monto: pago.monto,
          fecha: new Date(),
        });
        await queryRunner.manager.save(pagoEntity);
      }

      await queryRunner.commitTransaction();

      // Registrar en la auditoría
      const totalDetallesStr = detalles.map(d => `ProdID: ${d.productoId} (Cant: ${d.cantidad})`).join(', ');
      await this.auditoriaService.registrar(
        usuarioAutenticado,
        'CREAR',
        'VENTAS',
        savedVenta.id,
        `Se registró la venta #${savedVenta.id} por un total de Bs. ${total.toFixed(2)}. Detalles: [${totalDetallesStr}]`,
      );

      return this.findOne(savedVenta.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Venta[]> {
    return this.ventaRepository.find({
      relations: ['cliente', 'usuario', 'detalles', 'detalles.producto', 'pagos', 'pagos.metodoPago'],
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['cliente', 'usuario', 'detalles', 'detalles.producto', 'pagos', 'pagos.metodoPago'],
    });
    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }
    return venta;
  }

  async remove(id: number, usuarioAutenticado: Usuario | null = null): Promise<void> {
    const venta = await this.findOne(id);
    await this.ventaRepository.remove(venta);
    
    await this.auditoriaService.registrar(
      usuarioAutenticado,
      'ELIMINAR',
      'VENTAS',
      id,
      `Se eliminó la venta #${id} con un total de Bs. ${Number(venta.total).toFixed(2)}. Cliente: ${venta.cliente?.nombre || 'N/A'} ${venta.cliente?.apellido || 'N/A'}.`,
    );
  }
}
