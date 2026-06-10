<template>
  <div class="d-flex min-vh-100" style="background: var(--bg-dark);">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ show: sidebarOpen }">
      <div class="sidebar-brand">
        <div class="d-flex align-items-center justify-content-center gap-2 mb-1">
          <i class="bi bi-shield-fill text-gold" style="font-size: 1.4rem;"></i>
          <h4 class="mb-0" style="font-family:'Outfit',sans-serif; font-size:1.1rem; font-weight:800; color:var(--primary); letter-spacing:1.5px;">LA FORTALEZA</h4>
        </div>
        <small class="tracking-widest" style="color:var(--text-secondary);">Centro de Control</small>
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

        <div class="nav-section-title">Catálogo</div>
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
          <i class="bi bi-percent text-gold"></i> Promociones
        </router-link>
        <router-link to="/admin/pagos" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-credit-card-fill"></i> Pagos
        </router-link>

        <div class="nav-section-title">Administración</div>
        <router-link to="/admin/auditoria" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-journal-text"></i> Auditoría
        </router-link>
        <router-link to="/admin/reportes" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-graph-up-arrow"></i> Reportes
        </router-link>
        <router-link to="/admin/configuracion" class="nav-link" @click="sidebarOpen = false">
          <i class="bi bi-gear-fill"></i> Configuración
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="main-content flex-grow-1">
      <header class="top-header">
        <button class="btn btn-sm d-md-none" style="border: 1px solid var(--border-color); color: var(--text-secondary);" @click="sidebarOpen = !sidebarOpen">
          <i class="bi bi-list"></i>
        </button>
        <span class="d-none d-md-block" style="font-size:0.75rem; color:var(--text-secondary);">
          Bienvenido, <strong class="text-gold">{{ authStore.fullName }}</strong>
        </span>
        <div class="d-flex align-items-center gap-2 ms-auto">
          <span class="badge bg-gold-trans text-gold text-uppercase" style="letter-spacing:1px; font-size:0.65rem;">
            <i class="bi bi-shield-fill me-1"></i>{{ authStore.user?.rol?.nombre }}
          </span>
          <button class="btn btn-sm" style="border:1px solid rgba(239,68,68,0.3); color:#ef4444; border-radius:8px;" @click="handleLogout">
            <i class="bi bi-box-arrow-right me-1"></i> Salir
          </button>
        </div>
      </header>
      <div class="content-area">
        <router-view />
      </div>
    </div>

    <!-- Mobile Backdrop -->
    <div
      v-if="sidebarOpen"
      class="position-fixed top-0 start-0 w-100 h-100 d-md-none"
      style="background:rgba(0,0,0,0.7); z-index:1035; backdrop-filter:blur(4px);"
      @click="sidebarOpen = false"
    ></div>
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
