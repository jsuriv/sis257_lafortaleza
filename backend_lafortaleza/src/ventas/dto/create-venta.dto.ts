import { IsNumber, IsArray, ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDetalleVentaDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  productoId: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  cantidad: number;

  @ApiProperty({ example: 12.00 })
  @IsNumber()
  precio: number;

  @ApiPropertyOptional({ example: 'Unidad' })
  @IsString()
  @IsOptional()
  tipoVenta?: string;
}

export class CreatePagoVentaDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  metodoPagoId: number;

  @ApiProperty({ example: 36.00 })
  @IsNumber()
  monto: number;

  @ApiPropertyOptional({ example: 50.00 })
  @IsNumber()
  @IsOptional()
  montoRecibido?: number;

  @ApiPropertyOptional({ example: 14.00 })
  @IsNumber()
  @IsOptional()
  cambio?: number;
}

export class CreateVentaDto {
  @ApiPropertyOptional({ example: 1, description: 'ID del cliente. Si se omite, se usa Consumidor Final (NIT: 0)' })
  @IsNumber()
  @IsOptional()
  clienteId?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  usuarioId: number;

  @ApiPropertyOptional({ example: '/uploads/comprobantes/qr-12345.jpg', description: 'URL del comprobante QR de pago' })
  @IsString()
  @IsOptional()
  comprobanteQr?: string;

<<<<<<< HEAD
=======
  @ApiPropertyOptional({ example: 'Av. Las Americas #123', description: 'Dirección de entrega' })
  @IsString()
  @IsOptional()
  direccionEntrega?: string;

>>>>>>> ab793257ba3493a6fd446597f722a9acc7b86b05
  @ApiProperty({ type: [CreateDetalleVentaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleVentaDto)
  detalles: CreateDetalleVentaDto[];

  @ApiProperty({ type: [CreatePagoVentaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePagoVentaDto)
  pagos: CreatePagoVentaDto[];

  @ApiPropertyOptional({ example: 'Pendiente', description: 'Estado inicial de la venta' })
  @IsString()
  @IsOptional()
  estado?: string;
}
