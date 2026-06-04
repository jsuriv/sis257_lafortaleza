import { IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
}

export class CreatePagoVentaDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  metodoPagoId: number;

  @ApiProperty({ example: 36.00 })
  @IsNumber()
  monto: number;
}

export class CreateVentaDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  clienteId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  usuarioId: number;

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
}
