<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4><i class="bi bi-cart-plus-fill me-2" style="color: var(--success);"></i>Nueva Venta</h4>
      <router-link to="/admin/ventas" class="btn btn-outline-secondary btn-sm"><i class="bi bi-arrow-left"></i> Volver</router-link>
    </div>

    <div class="row g-4">
      <!-- Left: Product selector -->
      <div class="col-md-7">
        <div class="stat-card mb-3">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label">Cliente</label>
              <select class="form-select" v-model="clienteId">
                <option v-for="c in clientes" :key="c.id" :value="c.id">{{ c.nombre }} {{ c.apellido }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="stat-card">
          <h6 class="mb-3"><i class="bi bi-search me-1"></i> Agregar Productos</h6>
          <div class="search-box mb-3"><i class="bi bi-search"></i><input type="text" class="form-control" placeholder="Buscar producto..." v-model="searchProd" /></div>
          <div style="max-height: 300px; overflow-y: auto;">
            <div v-for="p in filteredProducts" :key="p.id" class="d-flex justify-content-between align-items-center py-2 px-2" style="border-bottom: 1px solid var(--border-color); cursor: pointer;" @click="addProduct(p)">
              <div>
                <div class="fw-semibold" style="font-size: 0.85rem;">{{ p.nombre }}</div>
                <small class="text-secondary">{{ p.codigo }} | Stock: {{ p.stock }}</small>
              </div>
              <div class="text-end">
                <template v-if="getActiveDiscount(p) > 0">
                  <span class="badge bg-gold text-dark me-1" style="font-size: 0.7rem; background: #D4AF37 !important; color: #000 !important; font-weight: 700;">{{ getActiveDiscount(p) }}% DTO</span>
                  <div class="fw-bold text-success" style="font-size: 0.85rem;">Bs. {{ getDiscountedPrice(p).toFixed(2) }}</div>
                  <small class="text-secondary text-decoration-line-through" style="font-size: 0.72rem;">Bs. {{ Number(p.precioVenta).toFixed(2) }}</small>
                </template>
                <template v-else>
                  <div class="fw-bold" style="color: var(--success);">Bs. {{ Number(p.precioVenta).toFixed(2) }}</div>
                </template>
                <button class="btn btn-sm btn-outline-success mt-1"><i class="bi bi-plus"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Cart -->
      <div class="col-md-5">
        <div class="stat-card">
          <h6 class="mb-3"><i class="bi bi-receipt me-1"></i> Detalle de Venta</h6>
          <div v-if="cart.length === 0" class="text-center text-secondary py-4">
            <i class="bi bi-cart-x" style="font-size: 2rem;"></i>
            <p class="mt-2">Agregue productos</p>
          </div>
          <div v-for="(item, i) in cart" :key="i" class="d-flex justify-content-between align-items-center py-2" style="border-bottom: 1px solid var(--border-color);">
            <div style="flex: 1;">
              <div class="fw-semibold" style="font-size: 0.85rem;">{{ item.nombre }}</div>
              <div class="d-flex align-items-center gap-2 mt-1">
                <button class="btn btn-sm btn-outline-secondary" style="padding: 0 6px;" @click="item.cantidad > 1 ? item.cantidad-- : removeItem(i)">-</button>
                <span style="font-size: 0.85rem;">{{ item.cantidad }}</span>
                <button class="btn btn-sm btn-outline-secondary" style="padding: 0 6px;" @click="item.cantidad++">+</button>
                <span class="text-secondary" style="font-size: 0.8rem;"> × Bs. {{ Number(item.precio).toFixed(2) }}</span>
              </div>
            </div>
            <div class="text-end">
              <span class="fw-bold">Bs. {{ (item.cantidad * item.precio).toFixed(2) }}</span>
              <button class="btn btn-sm btn-outline-danger ms-2" @click="removeItem(i)"><i class="bi bi-x"></i></button>
            </div>
          </div>

          <div v-if="cart.length > 0" class="mt-3 pt-3" style="border-top: 2px solid var(--primary);">
            <div class="d-flex justify-content-between mb-3">
              <span class="fw-bold" style="font-size: 1.1rem;">TOTAL:</span>
              <span class="fw-bold" style="font-size: 1.3rem; color: var(--success);">Bs. {{ total.toFixed(2) }}</span>
            </div>
            <div class="mb-3">
              <label class="form-label">Método de Pago</label>
              <select class="form-select" v-model="metodoPagoId">
                <option v-for="m in metodosPago" :key="m.id" :value="m.id">{{ m.nombre }}</option>
              </select>
            </div>
            <button class="btn btn-primary-custom w-100 py-2" @click="registrarVenta" :disabled="processing">
              <span v-if="processing"><i class="bi bi-arrow-repeat spin"></i> Procesando...</span>
              <span v-else><i class="bi bi-check-circle me-1"></i> Registrar Venta</span>
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

const productos = ref<any[]>([]); const clientes = ref<any[]>([]); const metodosPago = ref<any[]>([])
const searchProd = ref(''); const clienteId = ref(1); const metodoPagoId = ref(1); const processing = ref(false)
const cart = ref<{ productoId: number; nombre: string; cantidad: number; precio: number }[]>([])

const filteredProducts = computed(() => productos.value.filter(p => p.nombre.toLowerCase().includes(searchProd.value.toLowerCase()) || p.codigo.toLowerCase().includes(searchProd.value.toLowerCase())))
const total = computed(() => cart.value.reduce((s, i) => s + i.cantidad * i.precio, 0))

onMounted(async () => {
  const [p, c, m] = await Promise.all([http.get('productos'), http.get('clientes'), http.get('metodos-pago')])
  productos.value = p.data; clientes.value = c.data; metodosPago.value = m.data
  if (clientes.value.length) clienteId.value = clientes.value[0].id
  if (metodosPago.value.length) metodoPagoId.value = metodosPago.value[0].id
})

function getActiveDiscount(p: any): number {
  if (!p || !p.promocion || !p.promocion.estado) return 0
  const now = new Date()
  const start = new Date(p.promocion.fechaInicio)
  const end = new Date(p.promocion.fechaFin)
  if (now >= start && now <= end) {
    return Number(p.promocion.descuento)
  }
  return 0
}

function getDiscountedPrice(p: any): number {
  const discount = getActiveDiscount(p)
  if (discount > 0) {
    return Number(p.precioVenta) * (1 - discount / 100)
  }
  return Number(p.precioVenta)
}

function addProduct(p: any) {
  const existing = cart.value.find(i => i.productoId === p.id)
  if (existing) { 
    existing.cantidad++ 
  } else { 
    cart.value.push({ 
      productoId: p.id, 
      nombre: p.nombre, 
      cantidad: 1, 
      precio: getDiscountedPrice(p) 
    }) 
  }
}

function removeItem(i: number) { cart.value.splice(i, 1) }

async function registrarVenta() {
  if (!cart.value.length) return
  processing.value = true
  try {
    await http.post('ventas', {
      clienteId: clienteId.value,
      usuarioId: authStore.user?.id,
      detalles: cart.value.map(i => ({ productoId: i.productoId, cantidad: i.cantidad, precio: i.precio })),
      pagos: [{ metodoPagoId: metodoPagoId.value, monto: total.value }],
    })
    await Swal.fire({ icon: 'success', title: '¡Venta registrada!', text: `Total: Bs. ${total.value.toFixed(2)}`, timer: 2000, showConfirmButton: false })
    router.push('/admin/ventas')
  } catch (e: any) {
    Swal.fire({ icon: 'error', title: 'Error', text: e.response?.data?.message || 'Error al registrar venta' })
  } finally { processing.value = false }
}
</script>

<style scoped>
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
