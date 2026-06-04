<template>
  <div class="configuracion-view animate-fade-in">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="mb-1 text-gold fw-bold"><i class="bi bi-gear-fill me-2"></i>Configuración</h4>
        <p class="text-secondary mb-0">Configuración general de la licorería La Fortaleza</p>
      </div>
    </div>

    <div class="row g-4">
      <!-- General details -->
      <div class="col-md-6">
        <div class="glass-card p-4 h-100">
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

      <!-- Video background manager -->
      <div class="col-md-6">
        <div class="glass-card p-4 h-100">
          <h5 class="text-gold fw-bold mb-3 border-bottom border-gold-trans pb-2"><i class="bi bi-play-btn me-2"></i>Video de Fondo (Página de Inicio)</h5>
          <p class="text-secondary mb-3" style="font-size: 0.88rem;">
            Sube o reemplaza el video de fondo que ven los compradores al inicio de la página web. Se mostrará con un filtro borroso premium automático.
          </p>

          <div class="mb-4">
            <label class="form-label d-block fw-semibold mb-2">Video de Fondo Actual:</label>
            <div v-if="currentVideoUrl" class="video-preview-container border border-secondary-subtle rounded p-2 text-center bg-dark bg-opacity-10">
              <video :src="currentVideoUrl" controls autoplay muted loop playsinline class="w-100 rounded" style="max-height: 180px; object-fit: cover;"></video>
              <small class="text-secondary d-block mt-2 text-truncate" style="font-size: 0.75rem;">{{ currentVideoUrl }}</small>
            </div>
            <div v-else class="text-center py-4 text-secondary border border-secondary-subtle rounded bg-dark bg-opacity-10">
              Cargando video actual...
            </div>
          </div>

          <div class="d-flex flex-wrap gap-2">
            <input 
              type="file" 
              ref="fileInputRef" 
              class="d-none" 
              accept="video/mp4,video/webm,video/ogg,video/quicktime" 
              @change="onFileSelected"
            />
            <button class="btn btn-primary-custom" @click="triggerFileInput">
              <i class="bi bi-upload me-1"></i> Subir Video de Fondo
            </button>
            <button v-if="currentVideoUrl && currentVideoUrl !== '/video/hero.mp4'" class="btn btn-outline-danger" @click="restoreDefault">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Restablecer Predeterminado
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import http from '@/plugins/axios'
import Swal from 'sweetalert2'

const currentVideoUrl = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  await loadVideoConfig()
})

async function loadVideoConfig() {
  try {
    const res = await fetch('/video/config.json?t=' + Date.now())
    if (res.ok) {
      const data = await res.json()
      currentVideoUrl.value = data.videoUrl || '/video/hero.mp4'
    } else {
      currentVideoUrl.value = '/video/hero.mp4'
    }
  } catch (e) {
    console.error('Error al cargar config de video', e)
    currentVideoUrl.value = '/video/hero.mp4'
  }
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

async function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    
    // Only accept video files
    if (!file.type.startsWith('video/')) {
      return Swal.fire({
        icon: 'warning',
        title: 'Archivo no admitido',
        text: 'Por favor selecciona un archivo de video válido (.mp4, .webm, etc.)'
      })
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      Swal.fire({
        title: 'Subiendo video...',
        text: 'Esto puede tomar unos segundos.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      const res = await http.post('productos/upload-hero', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      currentVideoUrl.value = res.data.url
      Swal.fire({
        icon: 'success',
        title: 'Video actualizado',
        text: 'El fondo de la página de inicio se actualizó exitosamente.',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (e: any) {
      console.error(e)
      Swal.fire({
        icon: 'error',
        title: 'Error al subir',
        text: e.response?.data?.message || 'Hubo un error al guardar el video en el servidor.'
      })
    } finally {
      target.value = ''
    }
  }
}

async function restoreDefault() {
  const r = await Swal.fire({
    title: '¿Restablecer predeterminado?',
    text: 'Se volverá a mostrar el video original de la licorería.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, restablecer',
    cancelButtonText: 'Cancelar'
  })

  if (r.isConfirmed) {
    try {
      Swal.fire({
        title: 'Restableciendo...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      const res = await http.post('productos/restore-hero')
      currentVideoUrl.value = res.data.url
      
      Swal.fire({
        icon: 'success',
        title: 'Video restablecido',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (e: any) {
      console.error(e)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: e.response?.data?.message || 'Hubo un error al restablecer el video.'
      })
    }
  }
}
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
.video-preview-container {
  overflow: hidden;
  background-color: var(--bg-dark) !important;
}
</style>
