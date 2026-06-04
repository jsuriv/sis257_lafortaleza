import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('ventas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una venta completa' })
  create(@Body() createVentaDto: CreateVentaDto, @Request() req: any) {
    return this.ventasService.create(createVentaDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ventas' })
  findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una venta por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una venta' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.ventasService.remove(id, req.user);
  }
}
