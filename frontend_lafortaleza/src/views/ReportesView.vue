<template>
  <div class="reportes-view animate-fade-in">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="mb-1 text-gold fw-bold"><i class="bi bi-graph-up-arrow me-2"></i>Reportes Estadísticos</h4>
        <p class="text-secondary mb-0">Resumen y desempeño de operaciones en La Fortaleza</p>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-6">
        <div class="glass-card p-4 h-100">
          <h5 class="text-gold fw-bold mb-3 border-bottom border-gold-trans pb-2"><i class="bi bi-cart-check me-2"></i>Resumen de Ventas</h5>
          <div class="d-flex justify-content-between py-2 border-bottom border-gold-trans">
            <span class="text-secondary">Ventas Totales Realizadas:</span>
            <span class="text-light fw-bold">{{ totalVentas }}</span>
          </div>
          <div class="d-flex justify-content-between py-2 border-bottom border-gold-trans">
            <span class="text-secondary">Ingresos Totales en Caja:</span>
            <span class="text-success fw-bold">Bs. {{ totalIngresos.toFixed(2) }}</span>
          </div>
          <div class="d-flex justify-content-between py-2">
            <span class="text-secondary">Ticket Promedio por Venta:</span>
            <span class="text-gold fw-bold">Bs. {{ avgTicket.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="glass-card p-4 h-100">
          <h5 class="text-gold fw-bold mb-3 border-bottom border-gold-trans pb-2"><i class="bi bi-box-seam me-2"></i>Resumen de Compras (Inversión)</h5>
          <div class="d-flex justify-content-between py-2 border-bottom border-gold-trans">
            <span class="text-secondary">Compras Registradas:</span>
            <span class="text-light fw-bold">{{ totalCompras }}</span>
          </div>
          <div class="d-flex justify-content-between py-2 border-bottom border-gold-trans">
            <span class="text-secondary">Dinero Invertido en Stock:</span>
            <span class="text-danger fw-bold">Bs. {{ totalInversion.toFixed(2) }}</span>
          </div>
          <div class="d-flex justify-content-between py-2">
            <span class="text-secondary">Total de Proveedores:</span>
            <span class="text-gold fw-bold">{{ totalProveedores }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import http from '@/plugins/axios'

const totalVentas = ref(0)
const totalIngresos = ref(0)
const totalCompras = ref(0)
const totalInversion = ref(0)
const totalProveedores = ref(0)

const avgTicket = computed(() => {
  return totalVentas.value > 0 ? totalIngresos.value / totalVentas.value : 0
})

onMounted(async () => {
  try {
    const [v, c, p] = await Promise.all([
      http.get('ventas'),
      http.get('compras').catch(() => ({ data: [] })),
      http.get('proveedores')
    ])
    totalVentas.value = v.data.length
    totalIngresos.value = v.data.reduce((sum: number, item: any) => sum + Number(item.total), 0)
    
    totalCompras.value = c.data.length
    totalInversion.value = c.data.reduce((sum: number, item: any) => sum + Number(item.total), 0)
    
    totalProveedores.value = p.data.length
  } catch (e) {
    console.error('Error fetching reports data:', e)
  }
})
</script>

<style scoped>
.text-gold {
  color: var(--primary) !important;
}
.border-gold-trans {
  border-color: rgba(212, 175, 55, 0.15) !important;
}
.glass-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
</style>
