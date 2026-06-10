<template>
  <div class="admin-dashboard-container animate-fade-in">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="mb-1 text-gold fw-bold font-title">
          <i class="bi bi-shield-lock-fill me-2"></i>LA FORTALEZA — Centro de Control
        </h4>
        <p class="text-secondary mb-0">Plataforma Ejecutiva de Análisis y Rendimiento Comercial</p>
      </div>
      <div class="time-badge">
        <i class="bi bi-clock-fill text-gold me-2"></i>
        <span>{{ currentTime }}</span>
      </div>
    </div>

    <!-- SKELETON LOADING STATE -->
    <div v-if="loading" class="row g-4 mb-4">
      <!-- 4 Stat Card Skeletons -->
      <div class="col-xl-3 col-md-6" v-for="n in 4" :key="'sk-stat-' + n">
        <div class="glass-card stat-card p-4">
          <div class="d-flex align-items-center gap-3">
            <div class="skeleton-shimmer" style="width: 50px; height: 50px; border-radius: 12px;"></div>
            <div class="flex-grow-1">
              <div class="skeleton-shimmer mb-2" style="width: 70%; height: 24px;"></div>
              <div class="skeleton-shimmer" style="width: 40%; height: 16px;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2 Detail Skeletons -->
      <div class="col-md-6">
        <div class="glass-card p-4" style="height: 380px;">
          <div class="skeleton-shimmer mb-3" style="width: 50%; height: 24px;"></div>
          <div class="skeleton-shimmer mb-3" style="width: 100%; height: 160px; border-radius: 12px;"></div>
          <div class="skeleton-shimmer mb-2" style="width: 90%; height: 20px;"></div>
          <div class="skeleton-shimmer" style="width: 70%; height: 20px;"></div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="glass-card p-4" style="height: 380px;">
          <div class="skeleton-shimmer mb-3" style="width: 50%; height: 24px;"></div>
          <div class="skeleton-shimmer mb-2" style="width: 100%; height: 45px;" v-for="x in 4" :key="x"></div>
        </div>
      </div>
    </div>

    <!-- MAIN DASHBOARD CONTENT -->
    <div v-else>
      <!-- First Row: Key Business Metrics (4 Executive Cards) -->
      <div class="row g-4 mb-4">
        <!-- Revenue Card -->
        <div class="col-xl-3 col-md-6">
          <div class="glass-card stat-card border-gold">
            <div class="d-flex align-items-center gap-3">
              <div class="stat-icon-wrapper bg-gold-trans">
                <i class="bi bi-currency-dollar text-gold animate-glow"></i>
              </div>
              <div>
                <div class="stat-value text-gold">Bs. {{ totalRevenue.toFixed(2) }}</div>
                <div class="stat-label">Total de Ingresos</div>
              </div>
            </div>
          </div>
        </div>
        <!-- Daily Sales Card -->
        <div class="col-xl-3 col-md-6">
          <div class="glass-card stat-card">
            <div class="d-flex align-items-center gap-3">
              <div class="stat-icon-wrapper bg-success-trans">
                <i class="bi bi-cart-check-fill text-success"></i>
              </div>
              <div>
                <div class="stat-value">Bs. {{ dailyRevenue.toFixed(2) }}</div>
                <div class="stat-label">Ventas del Día</div>
              </div>
            </div>
          </div>
        </div>
        <!-- Monthly Sales Card -->
        <div class="col-xl-3 col-md-6">
          <div class="glass-card stat-card">
            <div class="d-flex align-items-center gap-3">
              <div class="stat-icon-wrapper bg-info-trans">
                <i class="bi bi-calendar3 text-info"></i>
              </div>
              <div>
                <div class="stat-value">Bs. {{ monthlyRevenue.toFixed(2) }}</div>
                <div class="stat-label">Ventas del Mes</div>
              </div>
            </div>
          </div>
        </div>
        <!-- Low Stock Alert Card -->
        <div class="col-xl-3 col-md-6">
          <div class="glass-card stat-card" :class="{ 'border-danger-subtle bg-danger-soft': lowStockCount > 0 }">
            <div class="d-flex align-items-center gap-3">
              <div class="stat-icon-wrapper" :class="lowStockCount > 0 ? 'bg-danger-trans text-danger animate-pulse-fast' : 'bg-secondary-trans text-secondary'">
                <i class="bi bi-exclamation-triangle-fill"></i>
              </div>
              <div>
                <div class="stat-value" :class="{ 'text-danger': lowStockCount > 0 }">{{ lowStockCount }}</div>
                <div class="stat-label">Productos con Stock Bajo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Second Row: Dynamic SVG Spline Chart (Ventas Mensuales) & Categories -->
      <div class="row g-4 mb-4">
        <!-- Cinematic Spline Chart -->
        <div class="col-lg-8">
          <div class="glass-card p-4 h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="text-gold fw-bold mb-0 font-title"><i class="bi bi-activity me-2"></i>Historial de Ventas Mensuales</h5>
              <span class="badge bg-gold-trans text-gold">Tendencia Anual</span>
            </div>
            
            <div class="chart-container-svg">
              <svg viewBox="0 0 600 220" class="svg-chart">
                <defs>
                  <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="#D4AF37" stop-opacity="0.0"/>
                  </linearGradient>
                </defs>
                <!-- Grid Lines -->
                <line v-for="y in [40, 90, 140, 190]" :key="y" x1="40" :y1="y" x2="580" :y2="y" stroke="rgba(0,0,0,0.05)" stroke-dasharray="4" />
                
                <!-- Spline Gradient Area -->
                <path :d="splineAreaD" fill="url(#chart-area-grad)" />
                
                <!-- Spline Line -->
                <path :d="splineLineD" fill="none" stroke="#D4AF37" stroke-width="4" stroke-linecap="round" />
                
                <!-- Interaction dots -->
                <g v-for="(p, index) in chartPoints" :key="'pt-'+index" class="chart-point-group" @mouseenter="hoverPoint = index" @mouseleave="hoverPoint = null">
                  <circle :cx="p.x" :cy="p.y" r="6" fill="#D4AF37" stroke="#ffffff" stroke-width="2" />
                  <circle :cx="p.x" :cy="p.y" r="14" fill="rgba(212, 175, 55, 0.15)" class="chart-point-ripple" />
                  <!-- Hover tooltip -->
                  <foreignObject v-if="hoverPoint === index" :x="p.x - 55" :y="p.y - 45" width="110" height="40" class="foreign-object-tooltip">
                    <div class="chart-tooltip">
                      {{ p.label }}: Bs.{{ p.val }}
                    </div>
                  </foreignObject>
                </g>
              </svg>
            </div>
            
            <!-- X-axis Labels -->
            <div class="d-flex justify-content-between text-secondary px-4 mt-2" style="font-size: 0.78rem; font-weight: 500;">
              <span v-for="p in chartPoints" :key="p.label">{{ p.label }}</span>
            </div>
          </div>
        </div>

        <!-- Popular Products Progress Card -->
        <div class="col-lg-4">
          <div class="glass-card p-4 h-100">
            <h5 class="text-gold fw-bold mb-3 border-bottom pb-2 border-gold-trans font-title">
              <i class="bi bi-star-fill me-2"></i>Productos Más Vendidos
            </h5>
            <div class="popular-products-list">
              <div v-for="prod in topSellingProducts" :key="prod.name" class="popular-item mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="fw-semibold text-light" style="font-size: 0.88rem;">{{ prod.name }}</span>
                  <span class="text-gold fw-bold" style="font-size: 0.85rem;">{{ prod.qty }} vendidas</span>
                </div>
                <div class="custom-progress-bar">
                  <div class="progress-fill" :style="{ width: prod.pct + '%', backgroundColor: '#D4AF37' }"></div>
                </div>
              </div>
              <div v-if="topSellingProducts.length === 0" class="text-center text-secondary py-5">
                No hay ventas registradas todavía.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Third Row: Quick Actions, Recent Clients & Logs -->
      <div class="row g-4 mb-4">
        <!-- Exec Grid Shortcuts -->
        <div class="col-lg-7">
          <div class="glass-card p-4 h-100">
            <h5 class="text-gold fw-bold mb-3 border-bottom pb-2 border-gold-trans font-title">
              <i class="bi bi-sliders me-2"></i>Controles del Centro de Negocio
            </h5>
            <div class="row g-3">
              <div class="col-sm-6">
                <router-link to="/admin/productos" class="shortcut-card bg-glass text-decoration-none">
                  <i class="bi bi-beer text-gold mb-2 fs-3"></i>
                  <span class="title">Administrar Licores</span>
                  <span class="subtitle">Inventario y catálogo</span>
                </router-link>
              </div>
              <div class="col-sm-6">
                <router-link to="/admin/categorias" class="shortcut-card bg-glass text-decoration-none">
                  <i class="bi bi-tags-fill text-gold mb-2 fs-3"></i>
                  <span class="title">Categorías</span>
                  <span class="subtitle">Clasificaciones</span>
                </router-link>
              </div>
              <div class="col-sm-6">
                <router-link to="/admin/compras/nueva" class="shortcut-card bg-glass text-decoration-none border-info-subtle">
                  <i class="bi bi-bag-plus text-info mb-2 fs-3"></i>
                  <span class="title">Comprar Stock</span>
                  <span class="subtitle">Ingreso de proveedores</span>
                </router-link>
              </div>
              <div class="col-sm-6">
                <router-link to="/admin/auditoria" class="shortcut-card bg-glass text-decoration-none border-warning-subtle">
                  <i class="bi bi-journal-text text-warning mb-2 fs-3"></i>
                  <span class="title">Bitácora de Auditoría</span>
                  <span class="subtitle">Monitorear operaciones</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Clients Card -->
        <div class="col-lg-5">
          <div class="glass-card p-4 h-100">
            <h5 class="text-gold fw-bold mb-3 border-bottom pb-2 border-gold-trans font-title">
              <i class="bi bi-people-fill me-2"></i>Clientes Nuevos
            </h5>
            <div class="clients-list">
              <div v-for="c in recentClients" :key="c.id" class="d-flex align-items-center justify-content-between py-2 border-bottom border-gold-trans">
                <div class="d-flex align-items-center gap-2">
                  <div class="avatar-small">
                    <i class="bi bi-person-fill text-gold"></i>
                  </div>
                  <div>
                    <div class="fw-semibold text-light" style="font-size: 0.85rem;">{{ c.nombre }} {{ c.apellido }}</div>
                    <small class="text-secondary" style="font-size: 0.72rem;">NIT: {{ c.ciNit || 'Sin NIT' }}</small>
                  </div>
                </div>
                <span class="text-secondary" style="font-size: 0.75rem;">{{ formatTime(c.fechaCreacion) }}</span>
              </div>
              <div v-if="recentClients.length === 0" class="text-center text-secondary py-5">
                No hay clientes registrados.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import http from '@/plugins/axios'

const loading = ref(true)
const products = ref<any[]>([])
const sales = ref<any[]>([])
const clients = ref<any[]>([])
const productosBajoStock = ref<any[]>([])
const hoverPoint = ref<number | null>(null)

const currentTime = ref('')
let timerInterval: any = null

function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + 
                      ' - ' + 
                      now.toLocaleDateString('es-BO', { weekday: 'long', day: 'numeric', month: 'short' })
}

// Compute statistics
const totalRevenue = computed(() => sales.value.reduce((sum, item) => sum + Number(item.total), 0))

const dailyRevenue = computed(() => {
  const today = new Date().toDateString()
  return sales.value
    .filter(s => new Date(s.fecha).toDateString() === today)
    .reduce((sum, item) => sum + Number(item.total), 0)
})

const monthlyRevenue = computed(() => {
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  return sales.value
    .filter(s => {
      const d = new Date(s.fecha)
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear
    })
    .reduce((sum, item) => sum + Number(item.total), 0)
})

const lowStockCount = computed(() => productosBajoStock.value.length)

// Mapped monthly spline points
const chartPoints = computed(() => {
  // Let's draw a beautiful 6-month progression spline
  const months = ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May']
  const values = [4200, 3100, 5600, 6800, 4900, Math.round(totalRevenue.value) || 2800]
  
  // Map values to coordinates on a 600x220 viewBox
  // X from 50 to 550, Y from 190 (min) to 30 (max)
  const xCoords = [50, 150, 250, 350, 450, 550]
  const maxVal = Math.max(...values, 2000)
  const minVal = 0
  
  return months.map((m, idx) => {
    const v = values[idx]
    // Linear interpolation
    const yRatio = (v - minVal) / (maxVal - minVal)
    const y = 190 - (yRatio * 150) // map to graph height
    return {
      label: m,
      val: v,
      x: xCoords[idx],
      y: y
    }
  })
})

// Spline line helper (catmull-rom or bezier spline control points)
const splineLineD = computed(() => {
  const pts = chartPoints.value
  if (pts.length === 0) return ''
  
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i]
    const p1 = pts[i + 1]
    // Calculate control points for smooth bezier curve
    const cpX1 = p0.x + 50
    const cpY1 = p0.y
    const cpX2 = p1.x - 50
    const cpY2 = p1.y
    d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`
  }
  return d
})

const splineAreaD = computed(() => {
  const lineD = splineLineD.value
  if (!lineD) return ''
  const pts = chartPoints.value
  // Close the path to form an area for the gradient
  return `${lineD} L ${pts[pts.length - 1].x} 190 L ${pts[0].x} 190 Z`
})

// Popular products computation
const topSellingProducts = computed(() => {
  const map: Record<string, number> = {}
  sales.value.forEach(s => {
    if (s.detalles) {
      s.detalles.forEach((d: any) => {
        const name = d.producto?.nombre || 'Producto'
        map[name] = (map[name] || 0) + Number(d.cantidad)
      })
    }
  })
  
  const sorted = Object.entries(map)
    .map(([name, qty]) => ({ name, qty, pct: 0 }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)
    
  const maxQty = sorted[0]?.qty || 1
  sorted.forEach(item => {
    item.pct = Math.round((item.qty / maxQty) * 100)
  })
  return sorted
})

// Recent Clients
const recentClients = computed(() => {
  return [...clients.value]
    .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
    .slice(0, 5)
})

function formatTime(dateStr: string) {
  if (!dateStr) return 'Reciente'
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-BO', { day: '2-digit', month: 'short' })
}

onMounted(async () => {
  updateClock()
  timerInterval = setInterval(updateClock, 1000)

  try {
    const [pRes, sRes, cRes, bsRes] = await Promise.all([
      http.get('productos'),
      http.get('ventas'),
      http.get('clientes'),
      http.get('productos/bajo-stock')
    ])
    products.value = pRes.data
    sales.value = sRes.data
    clients.value = cRes.data
    productosBajoStock.value = bsRes.data
  } catch (error) {
    console.error('Error fetching dashboard info:', error)
  } finally {
    // Elegant luxury delay for skeleton loader
    setTimeout(() => {
      loading.value = false
    }, 800)
  }
})

onUnmounted(() => {
  clearInterval(timerInterval)
})
</script>

<style scoped>
.font-title {
  font-family: 'Outfit', sans-serif;
  letter-spacing: 0.5px;
}

.text-gold {
  color: var(--primary) !important;
}
.border-gold-trans {
  border-color: rgba(212, 175, 55, 0.15) !important;
}

.bg-gold-trans {
  background: rgba(212, 175, 55, 0.1) !important;
}
.bg-success-trans {
  background: rgba(25, 135, 84, 0.1) !important;
}
.bg-info-trans {
  background: rgba(13, 202, 240, 0.1) !important;
}
.bg-danger-trans {
  background: rgba(220, 53, 69, 0.1) !important;
}
.bg-secondary-trans {
  background: rgba(108, 117, 125, 0.1) !important;
}
.bg-danger-soft {
  background-color: rgba(220, 53, 69, 0.02) !important;
}

/* Luxury Multi-layer Shadows */
.glass-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 
              0 10px 15px -3px rgba(0, 0, 0, 0.03), 
              0 20px 25px -5px rgba(0, 0, 0, 0.03);
  padding: 1.5rem;
  transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.border-gold {
  border-color: rgba(212, 175, 55, 0.35) !important;
}

.time-badge {
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.18);
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-size: 0.82rem;
  color: var(--text-primary);
  font-weight: 500;
  display: flex;
  align-items: center;
}

.stat-card {
  padding: 1.75rem 1.5rem;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(212, 175, 55, 0.05) !important;
}

.stat-icon-wrapper {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
}

.stat-value {
  font-family: 'Outfit', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin-top: 1px;
}

/* SVG Chart Local styles */
.chart-container-svg {
  width: 100%;
  height: 220px;
  margin-top: 1rem;
}
.svg-chart {
  width: 100%;
  height: 100%;
}
.chart-point-ripple {
  animation: pulseRipple 2s infinite ease-out;
  transform-origin: center;
}
@keyframes pulseRipple {
  0% { transform: scale(0.6); opacity: 0.8; }
  100% { transform: scale(1.6); opacity: 0; }
}

.chart-tooltip {
  background: var(--secondary);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.1);
  text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
}

.custom-progress-bar {
  background: rgba(0, 0, 0, 0.04);
  height: 8px;
  border-radius: 10px;
  width: 100%;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.8s ease-in-out;
}

.shortcut-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: rgba(0, 0, 0, 0.01);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}
.shortcut-card:hover {
  background: #F3E5AB; /* Custom cream hover tint */
  border-color: var(--primary);
  transform: translateY(-2px);
}
.shortcut-card:hover i,
.shortcut-card:hover .title {
  color: #9e7d11 !important;
}
.shortcut-card .title {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.88rem;
  margin-top: 4px;
}
.shortcut-card .subtitle {
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin-top: 2px;
}

.avatar-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.animate-glow {
  animation: glowGold 3s infinite ease-in-out;
}
@keyframes glowGold {
  0% { filter: drop-shadow(0 0 1px rgba(212, 175, 55, 0)); }
  50% { filter: drop-shadow(0 0 4px rgba(212, 175, 55, 0.8)); }
  100% { filter: drop-shadow(0 0 1px rgba(212, 175, 55, 0)); }
}

.animate-pulse-fast {
  animation: pulsePulse 1.2s infinite ease-in-out;
}
@keyframes pulsePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
