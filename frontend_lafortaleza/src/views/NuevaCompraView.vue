<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4><i class="bi bi-bag-plus-fill me-2" style="color: var(--info);"></i>Nueva Compra</h4>
      <router-link to="/admin/compras" class="btn btn-outline-secondary btn-sm"><i class="bi bi-arrow-left"></i> Volver</router-link>
    </div>

    <div class="row g-4">
      <div class="col-md-7">
        <div class="stat-card mb-3">
          <label class="form-label">Proveedor</label>
          <select class="form-select" v-model="proveedorId">
            <option v-for="p in proveedores" :key="p.id" :value="p.id">{{ p.nombre }}</option>
          </select>
        </div>

        <div class="stat-card">
          <h6 class="mb-3"><i class="bi bi-search me-1"></i> Agregar Productos</h6>
          <div class="search-box mb-3"><i class="bi bi-search"></i><input type="text" class="form-control" placeholder="Buscar producto..." v-model="searchProd" /></div>
          <div style="max-height: 300px; overflow-y: auto;">
            <div v-for="p in filteredProducts" :key="p.id" class="d-flex justify-content-between align-items-center py-2 px-2" style="border-bottom: 1px solid var(--border-color); cursor: pointer;" @click="addProduct(p)">
              <div>
                <div class="fw-semibold" style="font-size: 0.85rem;">{{ p.nombre }}</div>
                <small class="text-secondary">{{ p.codigo }} | Stock actual: {{ p.stock }}</small>
              </div>
              <div class="text-end">
                <div class="fw-bold" style="color: var(--info);">Bs. {{ Number(p.precioCompra).toFixed(2) }}</div>
                <button class="btn btn-sm btn-outline-info"><i class="bi bi-plus"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-5">
        <div class="stat-card">
          <h6 class="mb-3"><i class="bi bi-receipt me-1"></i> Detalle de Compra</h6>
          <div v-if="cart.length === 0" class="text-center text-secondary py-4">
            <i class="bi bi-cart-x" style="font-size: 2rem;"></i><p class="mt-2">Agregue productos</p>
          </div>
          <div v-for="(item, i) in cart" :key="i" class="d-flex justify-content-between align-items-center py-2" style="border-bottom: 1px solid var(--border-color);">
            <div style="flex: 1;">
              <div class="fw-semibold" style="font-size: 0.85rem;">{{ item.nombre }}</div>
              <div class="d-flex align-items-center gap-2 mt-1">
                <button class="btn btn-sm btn-outline-secondary" style="padding: 0 6px;" @click="item.cantidad > 1 ? item.cantidad-- : removeItem(i)">-</button>
                <span style="font-size: 0.85rem;">{{ item.cantidad }}</span>
                <button class="btn btn-sm btn-outline-secondary" style="padding: 0 6px;" @click="item.cantidad++">+</button>
                <span class="text-secondary" style="font-size: 0.8rem;"> × Bs.</span>
                <input type="number" class="form-control form-control-sm" style="width: 80px;" v-model.number="item.precio" step="0.01" />
              </div>
            </div>
            <div class="text-end">
              <span class="fw-bold">Bs. {{ (item.cantidad * item.precio).toFixed(2) }}</span>
              <button class="btn btn-sm btn-outline-danger ms-2" @click="removeItem(i)"><i class="bi bi-x"></i></button>
            </div>
          </div>

          <div v-if="cart.length > 0" class="mt-3 pt-3" style="border-top: 2px solid var(--info);">
            <div class="d-flex justify-content-between mb-3">
              <span class="fw-bold" style="font-size: 1.1rem;">TOTAL:</span>
              <span class="fw-bold" style="font-size: 1.3rem; color: var(--info);">Bs. {{ total.toFixed(2) }}</span>
            </div>
            <button class="btn btn-primary-custom w-100 py-2" @click="registrarCompra" :disabled="processing">
              <span v-if="processing"><i class="bi bi-arrow-repeat spin"></i> Procesando...</span>
              <span v-else><i class="bi bi-check-circle me-1"></i> Registrar Compra</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import http from '@/plugins/axios'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const productos = ref<any[]>([]); const proveedores = ref<any[]>([])
const searchProd = ref(''); const proveedorId = ref(1); const processing = ref(false)
const cart = ref<{ productoId: number; nombre: string; cantidad: number; precio: number }[]>([])

const filteredProducts = computed(() => productos.value.filter(p => p.nombre.toLowerCase().includes(searchProd.value.toLowerCase()) || p.codigo.toLowerCase().includes(searchProd.value.toLowerCase())))
const total = computed(() => cart.value.reduce((s, i) => s + i.cantidad * i.precio, 0))

onMounted(async () => {
  const [p, prov] = await Promise.all([http.get('productos'), http.get('proveedores')])
  productos.value = p.data; proveedores.value = prov.data
  if (proveedores.value.length) proveedorId.value = proveedores.value[0].id
})

function addProduct(p: any) {
  const existing = cart.value.find(i => i.productoId === p.id)
  if (existing) { existing.cantidad++ } else { cart.value.push({ productoId: p.id, nombre: p.nombre, cantidad: 1, precio: Number(p.precioCompra) }) }
}

function removeItem(i: number) { cart.value.splice(i, 1) }

async function registrarCompra() {
  if (!cart.value.length) return
  processing.value = true
  try {
    await http.post('compras', {
      proveedorId: proveedorId.value,
      usuarioId: authStore.user?.id,
      detalles: cart.value.map(i => ({ productoId: i.productoId, cantidad: i.cantidad, precio: i.precio })),
    })
    await Swal.fire({ icon: 'success', title: '¡Compra registrada!', text: `Total: Bs. ${total.value.toFixed(2)}`, timer: 2000, showConfirmButton: false })
    router.push('/admin/compras')
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.response?.data?.message || 'Error al registrar compra' })
  } finally { processing.value = false }
}
</script>

<style scoped>
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
