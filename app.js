// PixelFit 1200 - Motor de adaptación y renderizado de imágenes a 1200x1200 px
const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 1200;

// Estado de la aplicación
const state = {
  items: [], // { id, file, originalImage, name, origWidth, origHeight }
  mode: 'contain', // 'contain' | 'cover' | 'stretch'
  bgType: 'transparent', // Por defecto transparente para máxima compatibilidad PNG
  format: 'image/png', // Por defecto PNG
  quality: 0.92,
  removeWhiteBg: false,
  tolerance: 25
};

// Referencias del DOM
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const btnBrowse = document.getElementById('btnBrowse');
const workspace = document.getElementById('workspace');
const cardsGrid = document.getElementById('cardsGrid');
const galleryCount = document.getElementById('galleryCount');
const countBadge = document.getElementById('countBadge');
const btnClearAll = document.getElementById('btnClearAll');
const btnDownloadAll = document.getElementById('btnDownloadAll');
const btnDownloadAllPng = document.getElementById('btnDownloadAllPng');
const exportFormat = document.getElementById('exportFormat');
const exportQuality = document.getElementById('exportQuality');
const qualityVal = document.getElementById('qualityVal');
const qualityControlContainer = document.getElementById('qualityControlContainer');
const backgroundOptions = document.getElementById('backgroundOptions');
const customColorInput = document.getElementById('customColorInput');
const radioCustom = document.getElementById('radioCustom');
const modeButtons = document.querySelectorAll('.mode-btn');
const bgRadios = document.querySelectorAll('input[name="bgType"]');
const chkRemoveWhiteBg = document.getElementById('chkRemoveWhiteBg');
const removeBgControls = document.getElementById('removeBgControls');
const toleranceSlider = document.getElementById('toleranceSlider');
const toleranceVal = document.getElementById('toleranceVal');

// Inicialización de Eventos
function init() {
  // Arrastrar y soltar
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  });

  // Selector de archivos
  btnBrowse.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  dropzone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      fileInput.value = ''; // permitir re-selección
    }
  });

  // Pegar desde el portapapeles (Cmd/Ctrl + V)
  window.addEventListener('paste', (e) => {
    const clipboardFiles = [];
    if (e.clipboardData && e.clipboardData.items) {
      for (let item of e.clipboardData.items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) clipboardFiles.push(file);
        }
      }
    }
    if (clipboardFiles.length > 0) {
      handleFiles(clipboardFiles);
    }
  });

  // Selección de modo
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;
      
      // Ocultar opciones de fondo si es "cover" o "stretch", ya que no quedan márgenes
      if (state.mode === 'contain') {
        backgroundOptions.style.display = 'block';
      } else {
        backgroundOptions.style.display = 'none';
      }
      
      rerenderAll();
    });
  });

  // Selección de Fondo
  bgRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'custom') {
        state.bgType = customColorInput.value;
      } else {
        state.bgType = e.target.value;
      }
      rerenderAll();
    });
  });

  customColorInput.addEventListener('input', (e) => {
    radioCustom.checked = true;
    state.bgType = e.target.value;
    rerenderAll();
  });

  // Formato y Calidad
  exportFormat.addEventListener('change', (e) => {
    state.format = e.target.value;
    if (state.format === 'image/png') {
      qualityControlContainer.style.opacity = '0.4';
      qualityControlContainer.style.pointerEvents = 'none';
    } else {
      qualityControlContainer.style.opacity = '1';
      qualityControlContainer.style.pointerEvents = 'auto';
    }
    rerenderAll();
  });

  exportQuality.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    qualityVal.textContent = `${val}%`;
    state.quality = val / 100;
  });

  // Quitar Fondo Blanco (Transparencia Automática)
  chkRemoveWhiteBg.addEventListener('change', (e) => {
    state.removeWhiteBg = e.target.checked;
    removeBgControls.style.display = state.removeWhiteBg ? 'block' : 'none';
    rerenderAll();
  });

  toleranceSlider.addEventListener('input', (e) => {
    state.tolerance = parseInt(e.target.value, 10);
    toleranceVal.textContent = state.tolerance;
    rerenderAll();
  });

  // Limpiar todo
  btnClearAll.addEventListener('click', () => {
    state.items = [];
    updateWorkspaceVisibility();
  });

  // Descargar todo
  btnDownloadAll.addEventListener('click', () => downloadAllImages());
  btnDownloadAllPng.addEventListener('click', () => downloadAllImages('image/png'));
}

// Manejo de archivos entrantes
function handleFiles(files) {
  const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
  if (validFiles.length === 0) return;

  validFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const item = {
          id: 'img_' + Math.random().toString(36).substr(2, 9),
          file,
          name: file.name,
          originalImage: img,
          origWidth: img.naturalWidth,
          origHeight: img.naturalHeight
        };
        state.items.push(item);
        renderCard(item);
        updateWorkspaceVisibility();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function updateWorkspaceVisibility() {
  const count = state.items.length;
  galleryCount.textContent = `${count} ${count === 1 ? 'imagen' : 'imágenes'}`;
  countBadge.textContent = count;
  
  if (count > 0) {
    workspace.style.display = 'block';
  } else {
    workspace.style.display = 'none';
    cardsGrid.innerHTML = '';
  }
}

// Renderizado del Canvas para una imagen según los ajustes
function renderToCanvas(item, canvas) {
  canvas.width = TARGET_WIDTH;
  canvas.height = TARGET_HEIGHT;
  const ctx = canvas.getContext('2d');
  
  // Limpiar canvas
  ctx.clearRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

  const img = item.originalImage;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  if (state.mode === 'contain') {
    // Modo Rellenar Bordes (Padding)
    // 1. Dibujar el fondo
    if (state.bgType === 'blur') {
      // Fondo blur: dibujamos la imagen estirada con filtro blur
      ctx.save();
      ctx.filter = 'blur(35px) brightness(0.9)';
      // Dibujamos un poco más grande para evitar esquinas transparentes por el blur
      ctx.drawImage(img, -20, -20, TARGET_WIDTH + 40, TARGET_HEIGHT + 40);
      ctx.restore();
    } else if (state.bgType === 'transparent') {
      // Si el formato es JPG no soporta transparencia; si es JPG forzamos blanco o fondo gris si fuera el caso
      if (state.format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
      }
      // Si es PNG/WebP se deja transparente
    } else {
      ctx.fillStyle = state.bgType;
      ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
    }

    // 2. Dibujar la imagen centrada respetando aspecto
    const scale = Math.min(TARGET_WIDTH / iw, TARGET_HEIGHT / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const x = (TARGET_WIDTH - nw) / 2;
    const y = (TARGET_HEIGHT - nh) / 2;

    if (state.removeWhiteBg) {
      drawProcessedImage(ctx, img, x, y, nw, nh);
    } else {
      ctx.drawImage(img, x, y, nw, nh);
    }

  } else if (state.mode === 'cover') {
    // Modo Recorte Inteligente (Cover) - Llena todo el 1200x1200
    const scale = Math.max(TARGET_WIDTH / iw, TARGET_HEIGHT / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const x = (TARGET_WIDTH - nw) / 2;
    const y = (TARGET_HEIGHT - nh) / 2;

    if (state.removeWhiteBg) {
      drawProcessedImage(ctx, img, x, y, nw, nh);
    } else {
      ctx.drawImage(img, x, y, nw, nh);
    }

  } else if (state.mode === 'stretch') {
    // Modo Estirar
    if (state.removeWhiteBg) {
      drawProcessedImage(ctx, img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
    } else {
      ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
    }
  }
}

// Función para procesar y remover fondo blanco exterior usando flood fill de bordes
function drawProcessedImage(ctx, img, destX, destY, destW, destH) {
  const offCanvas = document.createElement('canvas');
  offCanvas.width = img.naturalWidth;
  offCanvas.height = img.naturalHeight;
  const offCtx = offCanvas.getContext('2d');
  offCtx.drawImage(img, 0, 0);

  const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
  const data = imgData.data;
  const w = offCanvas.width;
  const h = offCanvas.height;

  // Umbral de color blanco según la tolerancia
  // A tolerancia 25: los píxeles con R, G, B >= 230 se consideran blancos/fondo
  const threshold = 255 - (state.tolerance * 1.8);
  const visited = new Uint8Array(w * h);

  function isWhiteLike(idx) {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];
    if (a < 10) return true; // ya transparente
    // Verifica si es claro y sin demasiada saturación de color
    const isBright = (r >= threshold && g >= threshold && b >= threshold);
    const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
    return isBright && maxDiff <= 25;
  }

  // Flood Fill desde todo el perímetro exterior de la imagen
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;

  // Encolar bordes superior e inferior
  for (let x = 0; x < w; x++) {
    const topIdx = (0 * w + x) * 4;
    if (isWhiteLike(topIdx)) {
      visited[x] = 1;
      queue[tail++] = x; // y=0, x
    }
    const btmPos = (h - 1) * w + x;
    const btmIdx = btmPos * 4;
    if (isWhiteLike(btmIdx)) {
      visited[btmPos] = 1;
      queue[tail++] = btmPos;
    }
  }

  // Encolar bordes izquierdo y derecho
  for (let y = 0; y < h; y++) {
    const leftPos = y * w + 0;
    const leftIdx = leftPos * 4;
    if (!visited[leftPos] && isWhiteLike(leftIdx)) {
      visited[leftPos] = 1;
      queue[tail++] = leftPos;
    }
    const rightPos = y * w + (w - 1);
    const rightIdx = rightPos * 4;
    if (!visited[rightPos] && isWhiteLike(rightIdx)) {
      visited[rightPos] = 1;
      queue[tail++] = rightPos;
    }
  }

  // Ejecutar Flood Fill en BFS
  while (head < tail) {
    const pos = queue[head++];
    const px = pos % w;
    const py = (pos / w) | 0;

    // Convertir a transparente
    data[pos * 4 + 3] = 0;

    // Vecinos 4-direccionales
    const neighbors = [
      py > 0 ? pos - w : -1,
      py < h - 1 ? pos + w : -1,
      px > 0 ? pos - 1 : -1,
      px < w - 1 ? pos + 1 : -1
    ];

    for (let i = 0; i < 4; i++) {
      const nPos = neighbors[i];
      if (nPos !== -1 && !visited[nPos]) {
        const nIdx = nPos * 4;
        if (isWhiteLike(nIdx)) {
          visited[nPos] = 1;
          queue[tail++] = nPos;
        }
      }
    }
  }

  // Suavizado de bordes: anti-aliasing leve para no dejar halos blancos duros
  for (let pos = 0; pos < w * h; pos++) {
    if (visited[pos]) {
      const px = pos % w;
      const py = (pos / w) | 0;
      const neighbors = [
        py > 0 ? pos - w : -1,
        py < h - 1 ? pos + w : -1,
        px > 0 ? pos - 1 : -1,
        px < w - 1 ? pos + 1 : -1
      ];
      for (let i = 0; i < 4; i++) {
        const nPos = neighbors[i];
        if (nPos !== -1 && !visited[nPos]) {
          const nIdx = nPos * 4;
          const r = data[nIdx];
          const g = data[nIdx + 1];
          const b = data[nIdx + 2];
          // Si el borde aún tiene un tono muy claro, atenuamos su alfa para un corte perfecto
          const brightness = (r + g + b) / 3;
          if (brightness > threshold) {
            data[nIdx + 3] = Math.round(data[nIdx + 3] * 0.4);
          }
        }
      }
    }
  }

  offCtx.putImageData(imgData, 0, 0);
  ctx.drawImage(offCanvas, destX, destY, destW, destH);
}

// Crear la tarjeta en la galería
function renderCard(item) {
  const card = document.createElement('div');
  card.className = 'image-card';
  card.id = `card-${item.id}`;

  card.innerHTML = `
    <div class="preview-container">
      <canvas class="preview-canvas" id="canvas-${item.id}"></canvas>
    </div>
    <div class="card-body">
      <div class="card-title" title="${item.name}">${item.name}</div>
      <div class="dimension-tags">
        <span class="tag-original">${item.origWidth} × ${item.origHeight} px</span>
        <span class="tag-arrow">➔</span>
        <span class="tag-target">1200 × 1200 px</span>
      </div>
      <div class="card-actions">
        <button class="btn btn-primary btn-sm btn-download" title="Descargar en formato seleccionado (1200×1200)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Descargar 1200×1200
        </button>
        <button class="btn btn-secondary btn-sm btn-download-png" title="Convertir y descargar directamente como imagen PNG (1200×1200)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          PNG
        </button>
        <button class="btn btn-danger btn-sm btn-icon-only btn-remove" title="Quitar de la lista">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  `;

  cardsGrid.appendChild(card);

  const canvas = card.querySelector(`#canvas-${item.id}`);
  renderToCanvas(item, canvas);

  // Botón descargar individual (formato configurado)
  card.querySelector('.btn-download').addEventListener('click', () => {
    downloadSingleImage(item, canvas);
  });

  // Botón descargar directo en PNG
  card.querySelector('.btn-download-png').addEventListener('click', () => {
    downloadSingleImage(item, canvas, 'image/png');
  });

  // Botón remover
  card.querySelector('.btn-remove').addEventListener('click', () => {
    state.items = state.items.filter(i => i.id !== item.id);
    card.remove();
    updateWorkspaceVisibility();
  });
}

function rerenderAll() {
  state.items.forEach(item => {
    const canvas = document.getElementById(`canvas-${item.id}`);
    if (canvas) {
      renderToCanvas(item, canvas);
    }
  });
}

function getFileExtension(formatOverride) {
  const fmt = formatOverride || state.format;
  if (fmt === 'image/jpeg') return 'jpg';
  if (fmt === 'image/webp') return 'webp';
  return 'png';
}

function getOutputFilename(originalName, formatOverride) {
  const dotIndex = originalName.lastIndexOf('.');
  const baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
  return `${baseName}_1200x1200.${getFileExtension(formatOverride)}`;
}

// Descargar una imagen individual
function downloadSingleImage(item, canvas, formatOverride) {
  const exportFormat = formatOverride || state.format;
  const quality = exportFormat === 'image/png' ? undefined : state.quality;
  const filename = getOutputFilename(item.name, exportFormat);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, exportFormat, quality);
}

// Descargar todas las imágenes (como ZIP si hay múltiples, o una sola si hay una)
async function downloadAllImages(formatOverride) {
  if (state.items.length === 0) return;

  const exportFormat = formatOverride || state.format;
  const isPngMode = exportFormat === 'image/png';

  if (state.items.length === 1) {
    const item = state.items[0];
    const canvas = document.getElementById(`canvas-${item.id}`);
    downloadSingleImage(item, canvas, exportFormat);
    return;
  }

  const activeBtn = isPngMode ? btnDownloadAllPng : btnDownloadAll;
  activeBtn.disabled = true;
  const originalText = activeBtn.innerHTML;
  activeBtn.innerHTML = `Generando ZIP (${isPngMode ? 'PNG' : ''})...`;

  try {
    const zip = new JSZip();
    const folderName = isPngMode ? "imagenes_1200x1200_png" : "imagenes_1200x1200";
    const folder = zip.folder(folderName);

    for (let item of state.items) {
      const canvas = document.getElementById(`canvas-${item.id}`);
      if (canvas) {
        const quality = isPngMode ? undefined : state.quality;
        const dataUrl = canvas.toDataURL(exportFormat, quality);
        const base64Data = dataUrl.split(',')[1];
        folder.file(getOutputFilename(item.name, exportFormat), base64Data, { base64: true });
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = isPngMode ? `imagenes_1200x1200_png.zip` : `imagenes_adaptadas_1200x1200.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al generar ZIP:", error);
    alert("Hubo un error al empaquetar el archivo ZIP. Descarga individualmente las imágenes.");
  } finally {
    activeBtn.disabled = false;
    activeBtn.innerHTML = originalText;
  }
}

// Inicializar la aplicación al cargar
document.addEventListener('DOMContentLoaded', init);
