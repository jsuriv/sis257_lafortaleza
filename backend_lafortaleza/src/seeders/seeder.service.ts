import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../roles/entities/rol.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Marca } from '../marcas/entities/marca.entity';
import { Proveedor } from '../proveedores/entities/proveedor.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Producto } from '../productos/entities/producto.entity';
import { MetodoPago } from '../metodos-pago/entities/metodo-pago.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Rol) private rolRepo: Repository<Rol>,
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Categoria) private categoriaRepo: Repository<Categoria>,
    @InjectRepository(Marca) private marcaRepo: Repository<Marca>,
    @InjectRepository(Proveedor) private proveedorRepo: Repository<Proveedor>,
    @InjectRepository(Cliente) private clienteRepo: Repository<Cliente>,
    @InjectRepository(Producto) private productoRepo: Repository<Producto>,
    @InjectRepository(MetodoPago) private metodoPagoRepo: Repository<MetodoPago>,
  ) {}

  async onModuleInit() {
    await this.seed();
    await this.updateCategoryImages();
  }

  async updateCategoryImages() {
    try {
      console.log('Actualizando imágenes vacías de categorías con valores por defecto...');
      const imagesMap = {
        'Cervezas': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=400',
        'Whisky': 'https://images.unsplash.com/photo-1569529465841-dfedd8d5043d?q=80&w=400',
        'Ron': 'https://images.unsplash.com/photo-1607622488478-f2f254e4c274?q=80&w=400',
        'Vodka': 'https://images.unsplash.com/photo-1596003903067-bf5762ad5c17?q=80&w=400',
        'Tequila': 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?q=80&w=400',
        'Vinos': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=400',
        'Licores': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400',
        'Energizantes': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400',
        'Brandy': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400',
        'Singani': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400',
      };
      
      for (const [nombre, imagen] of Object.entries(imagesMap)) {
        const cat = await this.categoriaRepo.findOne({ where: { nombre } });
        if (cat && !cat.imagen) {
          cat.imagen = imagen;
          await this.categoriaRepo.save(cat);
          console.log(`Categoría "${nombre}" actualizada con imagen por defecto.`);
        }
      }
      console.log('Verificación de imágenes de categorías completada.');
    } catch (error) {
      console.error('Error al actualizar imágenes de categorías por defecto:', error);
    }
  }

  async seed() {
    const rolesCount = await this.rolRepo.count();
    if (rolesCount > 0) {
      console.log('Base de datos ya tiene datos. Seeder omitido.');
      return;
    }

    console.log('Iniciando seeder de La Fortaleza...');

    // ===== ROLES =====
    const rolAdmin = await this.rolRepo.save(this.rolRepo.create({ nombre: 'ADMIN', descripcion: 'Administrador del sistema' }));
    const rolVendedor = await this.rolRepo.save(this.rolRepo.create({ nombre: 'VENDEDOR', descripcion: 'Vendedor de la licorería' }));

    // ===== USUARIOS =====
    await this.usuarioRepo.save(this.usuarioRepo.create({
      nombre: 'Administrador', apellido: 'Sistema', correo: 'admin@lafortaleza.com',
      usuario: 'admin', password: 'admin123', estado: true, rolId: rolAdmin.id,
    }));
    await this.usuarioRepo.save(this.usuarioRepo.create({
      nombre: 'Carlos', apellido: 'Mendoza', correo: 'carlos@lafortaleza.com',
      usuario: 'vendedor1', password: 'vend123', estado: true, rolId: rolVendedor.id,
    }));
    await this.usuarioRepo.save(this.usuarioRepo.create({
      nombre: 'María', apellido: 'Flores', correo: 'maria@lafortaleza.com',
      usuario: 'vendedor2', password: 'vend123', estado: true, rolId: rolVendedor.id,
    }));

    // ===== CATEGORÍAS =====
    const catCerveza = await this.categoriaRepo.save(this.categoriaRepo.create({ nombre: 'Cervezas', descripcion: 'Bebidas alcohólicas fermentadas', imagen: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=400' }));
    const catWhisky = await this.categoriaRepo.save(this.categoriaRepo.create({ nombre: 'Whisky', descripcion: 'Destilados de cereales envejecidos', imagen: 'https://images.unsplash.com/photo-1569529465841-dfedd8d5043d?q=80&w=400' }));
    const catRon = await this.categoriaRepo.save(this.categoriaRepo.create({ nombre: 'Ron', descripcion: 'Destilados de caña de azúcar', imagen: 'https://images.unsplash.com/photo-1607622488478-f2f254e4c274?q=80&w=400' }));
    const catVodka = await this.categoriaRepo.save(this.categoriaRepo.create({ nombre: 'Vodka', descripcion: 'Destilado de cereales o patata', imagen: 'https://images.unsplash.com/photo-1596003903067-bf5762ad5c17?q=80&w=400' }));
    const catTequila = await this.categoriaRepo.save(this.categoriaRepo.create({ nombre: 'Tequila', descripcion: 'Destilado de agave azul', imagen: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?q=80&w=400' }));
    const catVino = await this.categoriaRepo.save(this.categoriaRepo.create({ nombre: 'Vinos', descripcion: 'Bebidas fermentadas de uva', imagen: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=400' }));
    const catLicor = await this.categoriaRepo.save(this.categoriaRepo.create({ nombre: 'Licores', descripcion: 'Bebidas dulces destiladas', imagen: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400' }));
    const catEnergizante = await this.categoriaRepo.save(this.categoriaRepo.create({ nombre: 'Energizantes', descripcion: 'Bebidas energéticas', imagen: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400' }));
    const catBrandy = await this.categoriaRepo.save(this.categoriaRepo.create({ nombre: 'Brandy', descripcion: 'Destilado de vino', imagen: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400' }));
    const catSingani = await this.categoriaRepo.save(this.categoriaRepo.create({ nombre: 'Singani', descripcion: 'Destilado boliviano de uva moscatel', imagen: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400' }));

    // ===== MARCAS =====
    const mPacena = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Paceña', paisOrigen: 'Bolivia' }));
    const mHuari = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Huari', paisOrigen: 'Bolivia' }));
    const mCorona = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Corona', paisOrigen: 'México' }));
    const mHeineken = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Heineken', paisOrigen: 'Países Bajos' }));
    const mBudweiser = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Budweiser', paisOrigen: 'Estados Unidos' }));
    const mJohnnieW = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Johnnie Walker', paisOrigen: 'Escocia' }));
    const mChivas = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Chivas Regal', paisOrigen: 'Escocia' }));
    const mJackD = await this.marcaRepo.save(this.marcaRepo.create({ nombre: "Jack Daniel's", paisOrigen: 'Estados Unidos' }));
    const mOldParr = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Old Parr', paisOrigen: 'Escocia' }));
    const mBacardi = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Bacardí', paisOrigen: 'Cuba' }));
    const mHavana = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Havana Club', paisOrigen: 'Cuba' }));
    const mAbsolut = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Absolut', paisOrigen: 'Suecia' }));
    const mSmirnoff = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Smirnoff', paisOrigen: 'Rusia' }));
    const mCuervo = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'José Cuervo', paisOrigen: 'México' }));
    const mCasaReal = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Casa Real', paisOrigen: 'Bolivia' }));
    const mRedBull = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Red Bull', paisOrigen: 'Austria' }));
    const mMonster = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Monster', paisOrigen: 'Estados Unidos' }));
    const mBaileys = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Baileys', paisOrigen: 'Irlanda' }));
    const mJager = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Jägermeister', paisOrigen: 'Alemania' }));
    const mDucal = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Ducal', paisOrigen: 'Bolivia' }));
    const mBock = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Bock', paisOrigen: 'Bolivia' }));
    const mSingani63 = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Singani 63', paisOrigen: 'Bolivia' }));
    const mCasablanca = await this.marcaRepo.save(this.marcaRepo.create({ nombre: 'Casablanca', paisOrigen: 'Chile' }));

    // ===== PROVEEDORES =====
    const prov1 = await this.proveedorRepo.save(this.proveedorRepo.create({
      nombre: 'Distribuidora Andina S.R.L.', nit: '1234567890', telefono: '22345678',
      correo: 'andina@dist.com', direccion: 'Av. 6 de Agosto #1234, La Paz',
    }));
    const prov2 = await this.proveedorRepo.save(this.proveedorRepo.create({
      nombre: 'Importadora Bolivia Drinks', nit: '9876543210', telefono: '33456789',
      correo: 'boliviadrinks@import.com', direccion: 'Calle Comercio #567, Santa Cruz',
    }));
    const prov3 = await this.proveedorRepo.save(this.proveedorRepo.create({
      nombre: 'Cervecería Boliviana Nacional (CBN)', nit: '1111111111', telefono: '22112233',
      correo: 'ventas@cbn.com.bo', direccion: 'Av. Montes #890, La Paz',
    }));
    const prov4 = await this.proveedorRepo.save(this.proveedorRepo.create({
      nombre: 'Licores del Sur S.A.', nit: '2222222222', telefono: '44556677',
      correo: 'licoresdelsur@ventas.com', direccion: 'Zona Sur, Calle 21 #45, Cochabamba',
    }));
    const prov5 = await this.proveedorRepo.save(this.proveedorRepo.create({
      nombre: 'Distribuidora Premium Spirits', nit: '3333333333', telefono: '77889900',
      correo: 'premium@spirits.com', direccion: 'Av. San Martín #234, Tarija',
    }));

    // ===== CLIENTES =====
    await this.clienteRepo.save(this.clienteRepo.create({ nombre: 'Cliente', apellido: 'General', ciNit: '0000000', telefono: '00000000' }));
    await this.clienteRepo.save(this.clienteRepo.create({ nombre: 'Juan', apellido: 'Quispe', ciNit: '8765432', telefono: '71234567', correo: 'juan.q@email.com', direccion: 'Zona Norte, La Paz' }));
    await this.clienteRepo.save(this.clienteRepo.create({ nombre: 'Ana', apellido: 'Mamani', ciNit: '5678901', telefono: '72345678', correo: 'ana.m@email.com' }));
    await this.clienteRepo.save(this.clienteRepo.create({ nombre: 'Pedro', apellido: 'Condori', ciNit: '3456789', telefono: '73456789' }));
    await this.clienteRepo.save(this.clienteRepo.create({ nombre: 'Sofía', apellido: 'Vargas', ciNit: '9012345', telefono: '74567890', correo: 'sofia.v@email.com' }));

    // ===== MÉTODOS DE PAGO =====
    await this.metodoPagoRepo.save(this.metodoPagoRepo.create({ nombre: 'Efectivo', descripcion: 'Pago en efectivo' }));
    await this.metodoPagoRepo.save(this.metodoPagoRepo.create({ nombre: 'Tarjeta', descripcion: 'Pago con tarjeta de débito o crédito' }));
    await this.metodoPagoRepo.save(this.metodoPagoRepo.create({ nombre: 'QR', descripcion: 'Pago mediante código QR' }));
    await this.metodoPagoRepo.save(this.metodoPagoRepo.create({ nombre: 'Transferencia', descripcion: 'Transferencia bancaria' }));

    // ===== PRODUCTOS (50+) =====
    const productos = [
      // Cervezas (15)
      { nombre: 'Paceña 620ml', descripcion: 'Cerveza rubia boliviana', codigo: 'CERV-001', precioCompra: 6, precioVenta: 10, stock: 200, stockMinimo: 30, categoriaId: catCerveza.id, marcaId: mPacena.id, proveedorId: prov3.id },
      { nombre: 'Paceña Lata 355ml', descripcion: 'Cerveza Paceña en lata', codigo: 'CERV-002', precioCompra: 5, precioVenta: 8, stock: 150, stockMinimo: 20, categoriaId: catCerveza.id, marcaId: mPacena.id, proveedorId: prov3.id },
      { nombre: 'Huari 620ml', descripcion: 'Cerveza premium boliviana', codigo: 'CERV-003', precioCompra: 7, precioVenta: 12, stock: 180, stockMinimo: 25, categoriaId: catCerveza.id, marcaId: mHuari.id, proveedorId: prov3.id },
      { nombre: 'Huari Lata 355ml', descripcion: 'Cerveza Huari en lata', codigo: 'CERV-004', precioCompra: 6, precioVenta: 9, stock: 120, stockMinimo: 20, categoriaId: catCerveza.id, marcaId: mHuari.id, proveedorId: prov3.id },
      { nombre: 'Corona Extra 355ml', descripcion: 'Cerveza mexicana premium', codigo: 'CERV-005', precioCompra: 10, precioVenta: 15, stock: 100, stockMinimo: 15, categoriaId: catCerveza.id, marcaId: mCorona.id, proveedorId: prov2.id },
      { nombre: 'Heineken 330ml', descripcion: 'Cerveza holandesa premium', codigo: 'CERV-006', precioCompra: 10, precioVenta: 16, stock: 90, stockMinimo: 15, categoriaId: catCerveza.id, marcaId: mHeineken.id, proveedorId: prov2.id },
      { nombre: 'Budweiser 355ml', descripcion: 'Cerveza americana clásica', codigo: 'CERV-007', precioCompra: 8, precioVenta: 13, stock: 100, stockMinimo: 15, categoriaId: catCerveza.id, marcaId: mBudweiser.id, proveedorId: prov2.id },
      { nombre: 'Ducal 620ml', descripcion: 'Cerveza boliviana económica', codigo: 'CERV-008', precioCompra: 5, precioVenta: 8, stock: 250, stockMinimo: 40, categoriaId: catCerveza.id, marcaId: mDucal.id, proveedorId: prov3.id },
      { nombre: 'Bock 620ml', descripcion: 'Cerveza boliviana tradicional', codigo: 'CERV-009', precioCompra: 5, precioVenta: 8, stock: 200, stockMinimo: 30, categoriaId: catCerveza.id, marcaId: mBock.id, proveedorId: prov3.id },
      { nombre: 'Paceña ICE 620ml', descripcion: 'Cerveza Paceña suave', codigo: 'CERV-010', precioCompra: 6, precioVenta: 10, stock: 150, stockMinimo: 20, categoriaId: catCerveza.id, marcaId: mPacena.id, proveedorId: prov3.id },
      // Whisky (8)
      { nombre: 'Johnnie Walker Red Label 750ml', descripcion: 'Whisky escocés blended', codigo: 'WHSK-001', precioCompra: 80, precioVenta: 120, stock: 40, stockMinimo: 8, categoriaId: catWhisky.id, marcaId: mJohnnieW.id, proveedorId: prov1.id },
      { nombre: 'Johnnie Walker Black Label 750ml', descripcion: 'Whisky escocés premium 12 años', codigo: 'WHSK-002', precioCompra: 150, precioVenta: 220, stock: 30, stockMinimo: 5, categoriaId: catWhisky.id, marcaId: mJohnnieW.id, proveedorId: prov1.id },
      { nombre: 'Johnnie Walker Gold Label 750ml', descripcion: 'Whisky escocés gold reserve', codigo: 'WHSK-003', precioCompra: 250, precioVenta: 380, stock: 15, stockMinimo: 3, categoriaId: catWhisky.id, marcaId: mJohnnieW.id, proveedorId: prov5.id },
      { nombre: 'Chivas Regal 12 Años 750ml', descripcion: 'Whisky escocés premium', codigo: 'WHSK-004', precioCompra: 160, precioVenta: 240, stock: 25, stockMinimo: 5, categoriaId: catWhisky.id, marcaId: mChivas.id, proveedorId: prov1.id },
      { nombre: "Jack Daniel's Old No.7 750ml", descripcion: 'Tennessee whiskey americano', codigo: 'WHSK-005', precioCompra: 130, precioVenta: 195, stock: 35, stockMinimo: 8, categoriaId: catWhisky.id, marcaId: mJackD.id, proveedorId: prov1.id },
      { nombre: "Jack Daniel's Honey 750ml", descripcion: 'Tennessee whiskey con miel', codigo: 'WHSK-006', precioCompra: 140, precioVenta: 210, stock: 20, stockMinimo: 5, categoriaId: catWhisky.id, marcaId: mJackD.id, proveedorId: prov1.id },
      { nombre: 'Old Parr 12 Años 750ml', descripcion: 'Whisky escocés suave', codigo: 'WHSK-007', precioCompra: 140, precioVenta: 210, stock: 25, stockMinimo: 5, categoriaId: catWhisky.id, marcaId: mOldParr.id, proveedorId: prov5.id },
      { nombre: 'Chivas Regal 18 Años 750ml', descripcion: 'Whisky escocés ultra premium', codigo: 'WHSK-008', precioCompra: 350, precioVenta: 520, stock: 10, stockMinimo: 2, categoriaId: catWhisky.id, marcaId: mChivas.id, proveedorId: prov5.id },
      // Ron (6)
      { nombre: 'Bacardí Carta Blanca 750ml', descripcion: 'Ron blanco cubano', codigo: 'RON-001', precioCompra: 60, precioVenta: 90, stock: 45, stockMinimo: 10, categoriaId: catRon.id, marcaId: mBacardi.id, proveedorId: prov1.id },
      { nombre: 'Bacardí Carta Oro 750ml', descripcion: 'Ron dorado cubano', codigo: 'RON-002', precioCompra: 65, precioVenta: 95, stock: 35, stockMinimo: 8, categoriaId: catRon.id, marcaId: mBacardi.id, proveedorId: prov1.id },
      { nombre: 'Havana Club Añejo 3 Años 750ml', descripcion: 'Ron cubano 3 años', codigo: 'RON-003', precioCompra: 70, precioVenta: 105, stock: 30, stockMinimo: 8, categoriaId: catRon.id, marcaId: mHavana.id, proveedorId: prov2.id },
      { nombre: 'Havana Club 7 Años 750ml', descripcion: 'Ron cubano premium 7 años', codigo: 'RON-004', precioCompra: 120, precioVenta: 180, stock: 20, stockMinimo: 5, categoriaId: catRon.id, marcaId: mHavana.id, proveedorId: prov2.id },
      { nombre: 'Casa Real Ron Añejo 750ml', descripcion: 'Ron boliviano añejo', codigo: 'RON-005', precioCompra: 35, precioVenta: 55, stock: 60, stockMinimo: 15, categoriaId: catRon.id, marcaId: mCasaReal.id, proveedorId: prov4.id },
      { nombre: 'Casa Real Ron Blanco 750ml', descripcion: 'Ron boliviano blanco', codigo: 'RON-006', precioCompra: 30, precioVenta: 45, stock: 70, stockMinimo: 15, categoriaId: catRon.id, marcaId: mCasaReal.id, proveedorId: prov4.id },
      // Vodka (5)
      { nombre: 'Absolut Original 750ml', descripcion: 'Vodka sueco premium', codigo: 'VODK-001', precioCompra: 85, precioVenta: 130, stock: 35, stockMinimo: 8, categoriaId: catVodka.id, marcaId: mAbsolut.id, proveedorId: prov1.id },
      { nombre: 'Absolut Citron 750ml', descripcion: 'Vodka sueco sabor limón', codigo: 'VODK-002', precioCompra: 90, precioVenta: 135, stock: 25, stockMinimo: 5, categoriaId: catVodka.id, marcaId: mAbsolut.id, proveedorId: prov1.id },
      { nombre: 'Smirnoff Red 750ml', descripcion: 'Vodka ruso clásico', codigo: 'VODK-003', precioCompra: 55, precioVenta: 85, stock: 50, stockMinimo: 10, categoriaId: catVodka.id, marcaId: mSmirnoff.id, proveedorId: prov2.id },
      { nombre: 'Smirnoff Green Apple 750ml', descripcion: 'Vodka sabor manzana verde', codigo: 'VODK-004', precioCompra: 58, precioVenta: 88, stock: 30, stockMinimo: 8, categoriaId: catVodka.id, marcaId: mSmirnoff.id, proveedorId: prov2.id },
      { nombre: 'Absolut Raspberry 750ml', descripcion: 'Vodka sueco sabor frambuesa', codigo: 'VODK-005', precioCompra: 90, precioVenta: 135, stock: 20, stockMinimo: 5, categoriaId: catVodka.id, marcaId: mAbsolut.id, proveedorId: prov1.id },
      // Tequila (4)
      { nombre: 'José Cuervo Especial Gold 750ml', descripcion: 'Tequila reposado mexicano', codigo: 'TEQU-001', precioCompra: 75, precioVenta: 115, stock: 40, stockMinimo: 8, categoriaId: catTequila.id, marcaId: mCuervo.id, proveedorId: prov2.id },
      { nombre: 'José Cuervo Especial Silver 750ml', descripcion: 'Tequila blanco mexicano', codigo: 'TEQU-002', precioCompra: 70, precioVenta: 110, stock: 35, stockMinimo: 8, categoriaId: catTequila.id, marcaId: mCuervo.id, proveedorId: prov2.id },
      { nombre: 'José Cuervo Tradicional 750ml', descripcion: 'Tequila reposado premium', codigo: 'TEQU-003', precioCompra: 95, precioVenta: 145, stock: 20, stockMinimo: 5, categoriaId: catTequila.id, marcaId: mCuervo.id, proveedorId: prov5.id },
      { nombre: 'José Cuervo Margarita Mix 1L', descripcion: 'Mix preparado para margarita', codigo: 'TEQU-004', precioCompra: 40, precioVenta: 65, stock: 45, stockMinimo: 10, categoriaId: catTequila.id, marcaId: mCuervo.id, proveedorId: prov2.id },
      // Licores (4)
      { nombre: 'Baileys Original 750ml', descripcion: 'Crema de whisky irlandesa', codigo: 'LICR-001', precioCompra: 100, precioVenta: 155, stock: 25, stockMinimo: 5, categoriaId: catLicor.id, marcaId: mBaileys.id, proveedorId: prov1.id },
      { nombre: 'Jägermeister 700ml', descripcion: 'Licor de hierbas alemán', codigo: 'LICR-002', precioCompra: 95, precioVenta: 145, stock: 30, stockMinimo: 8, categoriaId: catLicor.id, marcaId: mJager.id, proveedorId: prov1.id },
      { nombre: 'Baileys Strawberry 750ml', descripcion: 'Crema de whisky sabor fresa', codigo: 'LICR-003', precioCompra: 105, precioVenta: 160, stock: 15, stockMinimo: 3, categoriaId: catLicor.id, marcaId: mBaileys.id, proveedorId: prov5.id },
      { nombre: 'Jägermeister Cold Brew 500ml', descripcion: 'Licor de hierbas con café', codigo: 'LICR-004', precioCompra: 85, precioVenta: 130, stock: 20, stockMinimo: 5, categoriaId: catLicor.id, marcaId: mJager.id, proveedorId: prov5.id },
      // Energizantes (4)
      { nombre: 'Red Bull 250ml', descripcion: 'Bebida energética clásica', codigo: 'ENER-001', precioCompra: 8, precioVenta: 14, stock: 300, stockMinimo: 50, categoriaId: catEnergizante.id, marcaId: mRedBull.id, proveedorId: prov2.id },
      { nombre: 'Red Bull Sugar Free 250ml', descripcion: 'Bebida energética sin azúcar', codigo: 'ENER-002', precioCompra: 9, precioVenta: 15, stock: 150, stockMinimo: 30, categoriaId: catEnergizante.id, marcaId: mRedBull.id, proveedorId: prov2.id },
      { nombre: 'Monster Energy 473ml', descripcion: 'Bebida energética clásica', codigo: 'ENER-003', precioCompra: 10, precioVenta: 16, stock: 200, stockMinimo: 40, categoriaId: catEnergizante.id, marcaId: mMonster.id, proveedorId: prov2.id },
      { nombre: 'Monster Ultra 473ml', descripcion: 'Bebida energética zero azúcar', codigo: 'ENER-004', precioCompra: 11, precioVenta: 17, stock: 120, stockMinimo: 25, categoriaId: catEnergizante.id, marcaId: mMonster.id, proveedorId: prov2.id },
      // Singani (3)
      { nombre: 'Singani 63 750ml', descripcion: 'Singani premium boliviano', codigo: 'SING-001', precioCompra: 70, precioVenta: 110, stock: 40, stockMinimo: 10, categoriaId: catSingani.id, marcaId: mSingani63.id, proveedorId: prov4.id },
      { nombre: 'Casa Real Singani 750ml', descripcion: 'Singani boliviano tradicional', codigo: 'SING-002', precioCompra: 30, precioVenta: 50, stock: 80, stockMinimo: 15, categoriaId: catSingani.id, marcaId: mCasaReal.id, proveedorId: prov4.id },
      { nombre: 'Casa Real Singani de Altura 750ml', descripcion: 'Singani premium de altura', codigo: 'SING-003', precioCompra: 45, precioVenta: 70, stock: 50, stockMinimo: 10, categoriaId: catSingani.id, marcaId: mCasaReal.id, proveedorId: prov4.id },
      // Vinos (4)
      { nombre: 'Casablanca Cabernet Sauvignon 750ml', descripcion: 'Vino tinto chileno', codigo: 'VINO-001', precioCompra: 45, precioVenta: 70, stock: 30, stockMinimo: 8, categoriaId: catVino.id, marcaId: mCasablanca.id, proveedorId: prov5.id },
      { nombre: 'Casablanca Merlot 750ml', descripcion: 'Vino tinto suave chileno', codigo: 'VINO-002', precioCompra: 48, precioVenta: 75, stock: 25, stockMinimo: 5, categoriaId: catVino.id, marcaId: mCasablanca.id, proveedorId: prov5.id },
      { nombre: 'Casablanca Sauvignon Blanc 750ml', descripcion: 'Vino blanco chileno', codigo: 'VINO-003', precioCompra: 42, precioVenta: 68, stock: 25, stockMinimo: 5, categoriaId: catVino.id, marcaId: mCasablanca.id, proveedorId: prov5.id },
      { nombre: 'Casablanca Chardonnay 750ml', descripcion: 'Vino blanco premium chileno', codigo: 'VINO-004', precioCompra: 50, precioVenta: 80, stock: 20, stockMinimo: 5, categoriaId: catVino.id, marcaId: mCasablanca.id, proveedorId: prov5.id },
      // Brandy (2)
      { nombre: 'Casa Real Brandy 750ml', descripcion: 'Brandy boliviano tradicional', codigo: 'BRND-001', precioCompra: 28, precioVenta: 45, stock: 50, stockMinimo: 10, categoriaId: catBrandy.id, marcaId: mCasaReal.id, proveedorId: prov4.id },
      { nombre: 'Casa Real Brandy Reserva 750ml', descripcion: 'Brandy boliviano reserva especial', codigo: 'BRND-002', precioCompra: 40, precioVenta: 65, stock: 30, stockMinimo: 8, categoriaId: catBrandy.id, marcaId: mCasaReal.id, proveedorId: prov4.id },
    ];

    for (const prod of productos) {
      let imgUrl = '';
      if (prod.categoriaId === catCerveza.id) {
        imgUrl = 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=400';
      } else if (prod.categoriaId === catWhisky.id) {
        imgUrl = 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?q=80&w=400';
      } else if (prod.categoriaId === catRon.id) {
        imgUrl = 'https://images.unsplash.com/photo-1614313511387-1436a4480edd?q=80&w=400';
      } else if (prod.categoriaId === catVodka.id) {
        imgUrl = 'https://images.unsplash.com/photo-1596701062351-df5f8a4261e5?q=80&w=400';
      } else if (prod.categoriaId === catTequila.id) {
        imgUrl = 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?q=80&w=400';
      } else if (prod.categoriaId === catLicor.id) {
        imgUrl = 'https://images.unsplash.com/photo-1568649929103-28ffeedeca07?q=80&w=400';
      } else if (prod.categoriaId === catEnergizante.id) {
        imgUrl = 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400';
      } else if (prod.categoriaId === catVino.id) {
        imgUrl = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=400';
      } else {
        imgUrl = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400';
      }

      const productWithImg = { ...prod, imagen: imgUrl };
      await this.productoRepo.save(this.productoRepo.create(productWithImg));
    }

    console.log(`Seeder completado: ${productos.length} productos cargados.`);
  }
}
