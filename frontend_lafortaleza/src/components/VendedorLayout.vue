<template>
  <div class="d-flex theme-vendedor min-vh-100 bg-theme-blue-light">
    <!-- Sidebar -->
    <aside class="sidebar bg-blue-dark" :class="{ show: sidebarOpen }">
      <div class="sidebar-brand border-blue-bottom">
        <h4 class="text-white fw-bold"><i class="bi bi-cart-fill text-blue-light"></i> LA FORTALEZA</h4>
        <small class="text-blue-light-soft tracking-widest">Punto de Venta (POS)</small>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-title text-blue-light-soft">Operaciones</div>
        <router-link to="/vendedor/dashboard" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-grid-1x2-fill"></i> Dashboard
        </router-link>
        <router-link to="/vendedor/ventas/nueva" class="nav-link nav-link-pos" @click="sidebarOpen = false">
          <i class="bi bi-cart-plus-fill"></i> Nueva Venta
        </router-link>
        <router-link to="/vendedor/ventas" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-receipt"></i> Ventas
        </router-link>
        <router-link to="/vendedor/clientes" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-people-fill"></i> Clientes
        </router-link>
        <router-link to="/vendedor/productos" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-box-seam-fill"></i> Productos
        </router-link>

        <div class="nav-section-title text-blue-light-soft">Usuario</div>
        <router-link to="/vendedor/perfil" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-person-circle"></i> Mi Perfil
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
            <i class="bi bi-person-badge text-blue"></i> {{ authStore.fullName }}
          </span>
          <span class="badge text-uppercase bg-blue-trans text-blue">
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
.theme-vendedor {
  --primary: #2563EB;
  --secondary: #1E40AF;
  --bg-dark: #EFF6FF;
  --bg-card: #FFFFFF;
  --bg-sidebar: #1E40AF;
  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --border-color: rgba(37, 99, 235, 0.15);
  --success: #22C55E;
  --danger: #EF4444;
  --bg-glass: #FFFFFF;
}

.text-blue {
  color: var(--primary) !important;
}
.text-blue-light {
  color: #60a5fa !important;
}
.text-blue-light-soft {
  color: #93c5fd !important;
  opacity: 0.8;
}

.border-blue-bottom {
  border-bottom: 2px solid rgba(96, 165, 250, 0.2);
}

.border-bottom-soft {
  border-bottom: 1px solid rgba(37, 99, 235, 0.08);
}

.tracking-widest {
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.65rem;
}

/* Sidebar Local Styling - Dark Blue style */
.sidebar {
  width: 260px;
  min-height: 100vh;
  background: var(--bg-sidebar);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  transition: transform 0.3s ease;
}

.sidebar-brand {
  padding: 1.5rem;
  text-align: center;
}

.sidebar-nav {
  padding: 1rem 0;
}

.sidebar-nav .nav-link {
  color: #dbeafe; /* Very light blue for dark sidebar */
  padding: 0.7rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
  text-decoration: none;
}

.sidebar-nav .nav-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  border-left-color: #60a5fa;
}

.sidebar-nav .nav-link.router-link-active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.15);
  border-left-color: #ffffff;
  font-weight: 600;
}

/* POS specific visual focus */
.sidebar-nav .nav-link-pos {
  background: rgba(96, 165, 250, 0.15);
  margin: 0.25rem 0.75rem;
  border-radius: 8px;
  padding: 0.7rem 1rem;
}
.sidebar-nav .nav-link-pos:hover {
  background: rgba(96, 165, 250, 0.25);
}

.sidebar-nav .nav-link i {
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
}

.nav-section-title {
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

.bg-blue-trans {
  background: rgba(37, 99, 235, 0.12) !important;
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
