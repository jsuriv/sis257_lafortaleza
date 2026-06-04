<template>
  <div class="d-flex theme-admin min-vh-100 bg-theme-dark">
    <!-- Sidebar -->
    <aside class="sidebar bg-white" :class="{ show: sidebarOpen }">
      <div class="sidebar-brand border-gold-bottom">
        <h4 class="text-gold fw-bold"><i class="bi bi-shield-fill"></i> LA FORTALEZA</h4>
        <small class="text-secondary tracking-widest">Centro de Control</small>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-title">Principal</div>
        <router-link to="/admin/dashboard" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-grid-1x2-fill"></i> Dashboard
        </router-link>

        <div class="nav-section-title">Seguridad</div>
        <router-link to="/admin/usuarios" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-people-fill"></i> Usuarios
        </router-link>
        <router-link to="/admin/roles" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-shield-check"></i> Roles
        </router-link>

        <div class="nav-section-title">Inventario</div>
        <router-link to="/admin/categorias" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-tags-fill"></i> Categorías
        </router-link>
        <router-link to="/admin/marcas" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-bookmark-star-fill"></i> Marcas
        </router-link>
        <router-link to="/admin/proveedores" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-truck"></i> Proveedores
        </router-link>
        <router-link to="/admin/clientes" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-person-hearts"></i> Clientes
        </router-link>
        <router-link to="/admin/productos" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-box-seam-fill"></i> Productos
        </router-link>

        <div class="nav-section-title">Operaciones</div>
        <router-link to="/admin/compras" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-bag-plus-fill"></i> Compras
        </router-link>
        <router-link to="/admin/ventas" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-cart-check-fill"></i> Ventas
        </router-link>
        <router-link to="/admin/promociones" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-percent text-danger"></i> Promociones
        </router-link>
        <router-link to="/admin/pagos" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-credit-card-fill"></i> Pagos
        </router-link>

        <div class="nav-section-title">Administración</div>
        <router-link to="/admin/auditoria" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-journal-text"></i> Auditoría (Logs)
        </router-link>
        <router-link to="/admin/reportes" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-graph-up-arrow"></i> Reportes
        </router-link>
        <router-link to="/admin/configuracion" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-gear-fill"></i> Configuración
        </router-link>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="main-content flex-grow-1 bg-theme">
      <header class="top-header bg-white border-bottom-soft">
        <button class="btn btn-sm btn-outline-secondary d-md-none" @click="sidebarOpen = !sidebarOpen">
          <i class="bi bi-list"></i>
        </button>
        <div class="d-flex align-items-center gap-2 ms-auto">
          <span class="text-secondary" style="font-size: 0.85rem;">
            <i class="bi bi-person-circle text-gold"></i> {{ authStore.fullName }}
          </span>
          <span class="badge text-uppercase bg-gold-trans text-gold">
            {{ authStore.user?.rol?.nombre }}
          </span>
          <button class="btn btn-sm btn-outline-danger ms-2" @click="handleLogout">
            <i class="bi bi-box-arrow-right"></i> Salir
          </button>
        </div>
      </header>
      <div class="content-area">
        <router-view />
      </div>
    </div>

    <!-- Backdrop for mobile -->
    <div v-if="sidebarOpen" class="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none" style="z-index: 1035;" @click="sidebarOpen = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const sidebarOpen = ref(false)

function handleLogout() {
  authStore.logout()
}
</script>

<style scoped>
.theme-admin {
  --primary: #D4AF37;
  --secondary: #1F2937;
  --bg-dark: #F8F9FA;
  --bg-card: #FFFFFF;
  --bg-sidebar: #FFFFFF;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --border-color: rgba(0, 0, 0, 0.08);
  --success: #198754;
  --danger: #DC3545;
  --bg-glass: #FFFFFF;
}

.text-gold {
  color: var(--primary) !important;
}

.border-gold-bottom {
  border-bottom: 2px solid rgba(212, 175, 55, 0.2);
}

.border-bottom-soft {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.tracking-widest {
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.65rem;
}

/* Sidebar Local Styling */
.sidebar {
  width: 260px;
  min-height: 100vh;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  transition: transform 0.3s ease;
}

.sidebar-brand h4 {
  font-family: 'Outfit', sans-serif;
  color: var(--primary);
  font-weight: 700;
  letter-spacing: 0.5px;
}

.sidebar-nav {
  padding: 1rem 0;
}

.sidebar-nav .nav-link {
  color: #374151; /* Dark grey */
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-left: 4px solid transparent;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.sidebar-nav .nav-link:hover {
  color: #9e7d11; /* Gold accent */
  background: #F3E5AB; /* Custom cream hover tint */
  border-left-color: var(--primary);
}

.sidebar-nav .nav-link.router-link-active {
  color: #9e7d11;
  background: #F3E5AB;
  border-left-color: var(--primary);
  font-weight: 600;
}

.sidebar-nav .nav-link i {
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
}

.nav-section-title {
  color: #9ca3af;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 1.2rem 1.5rem 0.4rem;
}

.main-content {
  margin-left: 260px;
  min-height: 100vh;
  background-color: var(--bg-dark);
}

.top-header {
  height: 60px;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1030;
}

.content-area {
  padding: 1.5rem;
}

.bg-gold-trans {
  background: rgba(212, 175, 55, 0.15) !important;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.show {
    transform: translateX(0);
  }
  .main-content {
    margin-left: 0;
  }
}
</style>
