<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4><i class="bi bi-box-seam-fill me-2" style="color: var(--primary-light);"></i>Productos</h4>
      <button v-if="authStore.isAdmin" class="btn btn-primary-custom" @click="openModal()"><i class="bi bi-plus-lg me-1"></i> Nuevo</button>
    </div>
    <div class="search-box mb-3" style="max-width: 350px;"><i class="bi bi-search"></i><input type="text" class="form-control" placeholder="Buscar producto..." v-model="search" /></div>
    <div class="table-dark-custom">
      <table class="table table-hover mb-0">
        <thead><tr><th>#</th><th>Imagen</th><th>Código</th><th>Nombre</th><th>Categoría</th><th>Marca</th><th>P. Compra</th><th>P. Venta</th><th>Stock</th><th v-if="authStore.isAdmin">Acciones</th></tr></thead>
        <tbody>
          <tr v-for="(p, i) in filtered" :key="p.id">
            <td>{{ i+1 }}</td>
            <td>
              <div class="product-thumb-container">
                <template v-if="p.imagen">
                  <video v-if="isVideoUrl(p.imagen)" :src="p.imagen" muted class="product-thumb" />
                  <img v-else :src="p.imagen" :alt="p.nombre" class="product-thumb" />
                </template>
                <span v-else class="product-thumb-fallback"><i class="bi bi-box-seam text-secondary"></i></span>
              </div>
            </td>
            <td><code>{{ p.codigo }}</code></td><td class="fw-semibold">{{ p.nombre }}</td>
            <td class="text-secondary">{{ p.categoria?.nombre || '-' }}</td><td class="text-secondary">{{ p.marca?.nombre || '-' }}</td>
            <td>Bs. {{ Number(p.precioCompra).toFixed(2) }}</td><td>Bs. {{ Number(p.precioVenta).toFixed(2) }}</td>
            <td><span :class="Number(p.stock) <= Number(p.stockMinimo) ? 'badge badge-stock-low' : 'badge badge-stock-ok'">{{ p.stock }}</span></td>
            <td v-if="authStore.isAdmin"><button class="btn btn-sm btn-outline-info me-1" @click="openModal(p)"><i class="bi bi-pencil"></i></button><button class="btn btn-sm btn-outline-danger" @click="remove(p.id)"><i class="bi bi-trash"></i></button></td>
          </tr>
          <tr v-if="filtered.length===0"><td :colspan="authStore.isAdmin ? 10 : 9" class="text-center text-secondary py-4">No se encontraron productos</td></tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade" ref="modalRef" tabindex="-1"><div class="modal-dialog modal-lg"><div class="modal-content">
      <div class="modal-header"><h5 class="modal-title">{{ editing ? 'Editar' : 'Nuevo' }} Producto</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
      <div class="modal-body"><div class="row g-3">
        <div class="col-md-8"><label class="form-label">Nombre</label><input class="form-control" v-model="form.nombre" required /></div>
        <div class="col-md-4"><label class="form-label">Código</label><input class="form-control" v-model="form.codigo" required /></div>
        <div class="col-12"><label class="form-label">Descripción</label><textarea class="form-control" v-model="form.descripcion" rows="2"></textarea></div>
        <div class="col-md-4"><label class="form-label">Categoría</label><select class="form-select" v-model="form.categoriaId"><option :value="null">Seleccione</option><option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option></select></div>
        <div class="col-md-4"><label class="form-label">Marca</label><select class="form-select" v-model="form.marcaId"><option :value="null">Seleccione</option><option v-for="m in marcas" :key="m.id" :value="m.id">{{ m.nombre }}</option></select></div>
        <div class="col-md-4"><label class="form-label">Proveedor</label><select class="form-select" v-model="form.proveedorId"><option :value="null">Seleccione</option><option v-for="p in proveedores" :key="p.id" :value="p.id">{{ p.nombre }}</option></select></div>
        <div class="col-md-3"><label class="form-label">Precio Compra (Bs.)</label><input class="form-control" type="number" step="0.01" v-model.number="form.precioCompra" /></div>
        <div class="col-md-3"><label class="form-label">Precio Venta (Bs.)</label><input class="form-control" type="number" step="0.01" v-model.number="form.precioVenta" /></div>
        <div class="col-md-3"><label class="form-label">Stock</label><input class="form-control" type="number" v-model.number="form.stock" /></div>
        <div class="col-md-3"><label class="form-label">Stock Mínimo</label><input class="form-control" type="number" v-model.number="form.stockMinimo" /></div>
        <div class="col-12">
          <label class="form-label">Imagen o Video del Producto</label>
          <div class="input-group">
            <input type="text" class="form-control" v-model="form.imagen" placeholder="URL de Internet (ej. https://...)" />
            <input type="file" ref="fileInputRef" class="d-none" accept="image/*,video/*" @change="onFileSelected" />
            <button class="btn btn-outline-accent" type="button" @click="triggerFileInput">
              <i class="bi bi-upload me-1"></i> Cargar Imagen/Video
            </button>
          </div>
          <small class="text-secondary mt-1 d-block">Puedes ingresar una URL de Internet o subir un archivo de imagen/video local.</small>
          
          <!-- Vista previa de la imagen/video -->
          <div v-if="form.imagen" class="mt-3 position-relative d-inline-block" style="max-width: 180px;">
            <video v-if="isVideoUrl(form.imagen)" :src="form.imagen" controls class="preview-asset" />
            <img v-else :src="form.imagen" class="preview-asset" />
            <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-1 d-flex align-items-center justify-content-center" style="width: 24px; height: 24px; line-height: 1; z-index: 5;" @click="form.imagen = ''">
              <i class="bi bi-x" style="font-size: 1rem; color: #fff;"></i>
            </button>
          </div>
        </div>
      </div></div>
      <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button><button class="btn btn-primary-custom" @click="save">{{ editing ? 'Actualizar' : 'Guardar' }}</button></div>
    </div></div></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import http from '@/plugins/axios'
import Swal from 'sweetalert2'
import { Modal } from 'bootstrap'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const items = ref<any[]>([]); const categorias = ref<any[]>([]); const marcas = ref<any[]>([]); const proveedores = ref<any[]>([])
const search = ref(''); const editing = ref<number|null>(null); const modalRef = ref<HTMLElement>(); let bsModal: Modal
const form = ref({ nombre: '', codigo: '', descripcion: '', precioCompra: 0, precioVenta: 0, stock: 0, stockMinimo: 5, imagen: '', categoriaId: null as number|null, marcaId: null as number|null, proveedorId: null as number|null })
const filtered = computed(() => items.value.filter(i => i.nombre.toLowerCase().includes(search.value.toLowerCase()) || i.codigo.toLowerCase().includes(search.value.toLowerCase())))

const fileInputRef = ref<HTMLInputElement | null>(null)

function isVideoUrl(url?: string) {
  if (!url) return false
  return url.match(/\.(mp4|webm|ogg|mov|avi)$/i) || url.includes('/videos/')
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

async function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const isVideo = file.type.startsWith('video/')
      Swal.fire({
        title: isVideo ? 'Subiendo video...' : 'Subiendo imagen...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })
      
      const res = await http.post('productos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      form.value.imagen = res.data.url
      Swal.fire({
        icon: 'success',
        title: 'Imagen subida',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (e: any) {
      console.error(e)
      Swal.fire({
        icon: 'error',
        title: 'Error al subir',
        text: e.response?.data?.message || 'Hubo un error al procesar el archivo.'
      })
    } finally {
      target.value = ''
    }
  }
}

onMounted(async () => {
  bsModal = new Modal(modalRef.value!)
  const [prods, cats, mrs, provs] = await Promise.all([http.get('productos'), http.get('categorias'), http.get('marcas'), http.get('proveedores')])
  items.value = prods.data; categorias.value = cats.data; marcas.value = mrs.data; proveedores.value = provs.data
})

async function load() { items.value = (await http.get('productos')).data }

function openModal(item?: any) {
  if (item) {
    editing.value = item.id;
    form.value = {
      nombre: item.nombre,
      codigo: item.codigo,
      descripcion: item.descripcion || '',
      precioCompra: Number(item.precioCompra),
      precioVenta: Number(item.precioVenta),
      stock: Number(item.stock),
      stockMinimo: Number(item.stockMinimo),
      imagen: item.imagen || '',
      categoriaId: item.categoriaId,
      marcaId: item.marcaId,
      proveedorId: item.proveedorId
    }
  } else {
    editing.value = null;
    form.value = {
      nombre: '',
      codigo: '',
      descripcion: '',
      precioCompra: 0,
      precioVenta: 0,
      stock: 0,
      stockMinimo: 5,
      imagen: '',
      categoriaId: null,
      marcaId: null,
      proveedorId: null
    }
  }
  bsModal.show()
}

async function save() {
  try {
    const payload = {
      ...form.value,
      precioCompra: Number(form.value.precioCompra),
      precioVenta: Number(form.value.precioVenta),
      stock: Number(form.value.stock),
      stockMinimo: Number(form.value.stockMinimo),
    };
    if (editing.value) {
      await http.patch(`productos/${editing.value}`, payload);
    } else {
      await http.post('productos', payload);
    }
    bsModal.hide();
    await load();
    Swal.fire({ icon: 'success', title: editing.value ? 'Actualizado' : 'Creado', timer: 1500, showConfirmButton: false });
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: Array.isArray(e.response?.data?.message) ? e.response.data.message.join(', ') : (e.response?.data?.message || 'Error') });
  }
}

async function remove(id: number) { const r = await Swal.fire({ title: '¿Eliminar?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí' }); if (r.isConfirmed) { await http.delete(`productos/${id}`); await load(); Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1500, showConfirmButton: false }) } }
</script>

<style scoped>
.product-thumb-container {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.product-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-thumb-fallback {
  font-size: 1.1rem;
}
.preview-asset {
  width: 180px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
}
</style>
