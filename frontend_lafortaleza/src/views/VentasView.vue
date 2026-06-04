<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4><i class="bi bi-cart-check-fill me-2" style="color: var(--success);"></i>Ventas</h4>
      <router-link to="/admin/ventas/nueva" class="btn btn-primary-custom"><i class="bi bi-plus-lg me-1"></i> Nueva Venta</router-link>
    </div>
    <div class="table-dark-custom">
      <table class="table table-hover mb-0">
        <thead><tr><th>#</th><th>Fecha</th><th>Cliente</th><th>Vendedor</th><th>Total</th><th>Detalles</th></tr></thead>
        <tbody>
          <tr v-for="(v, i) in items" :key="v.id">
            <td>{{ v.id }}</td>
            <td>{{ new Date(v.fecha).toLocaleString('es-BO') }}</td>
            <td class="fw-semibold">{{ v.cliente?.nombre }} {{ v.cliente?.apellido }}</td>
            <td class="text-secondary">{{ v.usuario?.nombre }}</td>
            <td class="fw-bold" style="color: var(--success);">Bs. {{ Number(v.total).toFixed(2) }}</td>
            <td><button class="btn btn-sm btn-outline-info" @click="showDetail(v)"><i class="bi bi-eye"></i> Ver</button></td>
          </tr>
          <tr v-if="items.length===0"><td colspan="6" class="text-center text-secondary py-4">No hay ventas registradas</td></tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade" ref="detailModalRef" tabindex="-1"><div class="modal-dialog modal-lg"><div class="modal-content">
      <div class="modal-header"><h5 class="modal-title">Detalle de Venta #{{ selectedVenta?.id }}</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
      <div class="modal-body" v-if="selectedVenta">
        <div class="row mb-3">
          <div class="col-md-4"><small class="text-secondary">Cliente:</small><br/><strong>{{ selectedVenta.cliente?.nombre }} {{ selectedVenta.cliente?.apellido }}</strong></div>
          <div class="col-md-4"><small class="text-secondary">Fecha:</small><br/><strong>{{ new Date(selectedVenta.fecha).toLocaleString('es-BO') }}</strong></div>
          <div class="col-md-4"><small class="text-secondary">Total:</small><br/><strong style="color: var(--success); font-size: 1.2rem;">Bs. {{ Number(selectedVenta.total).toFixed(2) }}</strong></div>
        </div>
        <table class="table table-sm" style="color: var(--text-primary);">
          <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead>
          <tbody>
            <tr v-for="d in selectedVenta.detalles" :key="d.id"><td>{{ d.producto?.nombre }}</td><td>{{ d.cantidad }}</td><td>Bs. {{ Number(d.precio).toFixed(2) }}</td><td>Bs. {{ Number(d.subtotal).toFixed(2) }}</td></tr>
          </tbody>
        </table>
        <div v-if="selectedVenta.pagos?.length" class="mt-3">
          <h6><i class="bi bi-credit-card me-1"></i>Pagos</h6>
          <div v-for="p in selectedVenta.pagos" :key="p.id" class="d-flex justify-content-between py-1" style="border-bottom: 1px solid var(--border-color);">
            <span>{{ p.metodoPago?.nombre }}</span><span>Bs. {{ Number(p.monto).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div></div></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import { Modal } from 'bootstrap'
const items = ref<any[]>([]); const selectedVenta = ref<any>(null); const detailModalRef = ref<HTMLElement>(); let detailModal: Modal
onMounted(async () => { detailModal = new Modal(detailModalRef.value!); items.value = (await http.get('ventas')).data })
function showDetail(v: any) { selectedVenta.value = v; detailModal.show() }
</script>
