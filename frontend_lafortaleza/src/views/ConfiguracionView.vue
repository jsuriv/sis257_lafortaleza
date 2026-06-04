<template>
  <div class="configuracion-view animate-fade-in">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="mb-1 text-gold fw-bold"><i class="bi bi-gear-fill me-2"></i>Configuración</h4>
        <p class="text-secondary mb-0">Configuración general de la licorería La Fortaleza</p>
      </div>
    </div>

    <div class="glass-card p-4" style="max-width: 600px;">
      <h5 class="text-gold fw-bold mb-3 border-bottom border-gold-trans pb-2"><i class="bi bi-shop me-2"></i>Datos de la Licorería</h5>
      <div class="row g-3">
        <div class="col-md-12">
          <label class="form-label">Nombre Comercial</label>
          <input type="text" class="form-control" value="LA FORTALEZA" readonly />
        </div>
        <div class="col-md-12">
          <label class="form-label">Eslogan</label>
          <input type="text" class="form-control" value="Donde la confianza se celebra." readonly />
        </div>
        <div class="col-md-6">
          <label class="form-label">Moneda</label>
          <input type="text" class="form-control" value="Bolivianos (Bs.)" readonly />
        </div>
        <div class="col-md-6">
          <label class="form-label">País</label>
          <input type="text" class="form-control" value="Bolivia" readonly />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuration options
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
