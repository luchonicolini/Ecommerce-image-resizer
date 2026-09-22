# PixelFit 1200 — Smart Image Resizer & Background Remover 

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![HTML5 & CSS3](https://img.shields.io/badge/HTML5_%26_CSS3-Modern_UI-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25_Client_Side-success)](https://github.com/luchonicolini/Cambio_Taman-o)

**PixelFit 1200** es una herramienta web ligera, moderna y ultrarrápida diseñada para resolver uno de los problemas más comunes en comercio electrónico (Mercado Libre, Shopify, Amazon, Tiendanube) y plataformas web: **la exigencia estricta de imágenes en dimensiones exactas cuadradas de 1200 × 1200 px con fondo blanco o transparente**.

Procesa tus imágenes directamente en el navegador del usuario utilizando la **API de Canvas de HTML5**, garantizando una privacidad absoluta (las imágenes nunca se suben a ningún servidor externo).

---

##  El Problema que Resuelve

Muchas plataformas de venta online y CMS exigen rigurosamente que las imágenes tengan dimensiones exactas de **1200 × 1200 px**. 
Cuando se obtienen fotos de catálogos o proveedores con medidas desproporcionadas (por ejemplo: `1088 × 1200 px`, `800 × 1000 px`, etc.), las plataformas rechazan la subida con errores molestos.

**PixelFit 1200** soluciona esto de manera inmediata:
1. Sin necesidad de software pesado (Photoshop, Illustrator, etc.).
2. Sin suscripciones ni marcas de agua de editores en línea.
3. Con procesamiento en lote y descarga individual o en formato `.ZIP`.

---

##  Características Principales

-  **100% Client-Side & Privacidad Total**: Todo el procesamiento se realiza localmente en la máquina del usuario; tus archivos nunca tocan la nube.
-  **3 Modos de Adaptación a 1200 × 1200 px**:
  - **Rellenar bordes (Sin recortar)**: Mantiene el producto al 100% de su escala original y rellena los márgenes faltantes.
  - **Recorte Inteligente (Cover)**: Llena todo el marco de 1200 × 1200 px recortando armónicamente los excesos.
  - **Estirar (Stretch)**: Fuerza la adaptación dimensional.
-  **Eliminador Inteligente de Fondo Blanco (White Background Remover)**:
  - Algoritmo de *Flood Fill* perimetral con suavizado *anti-aliasing* que elimina el fondo blanco exterior del producto sin alterar los detalles blancos internos (ideal para tecnología, calzado y electrodomésticos).
  - Selector de sensibilidad y tolerancia ajustable en tiempo real.
- **Personalización de Fondo**:
  - Fondo Transparente (cuadrícula de control visual).
  - Fondo Blanco o Negro puro.
  - Fondo desenfocado estético (*Blur Effect* extraído de la propia imagen).
  - Selector libre de color HEX.
-  **Exportación Flexible & Descarga Masiva**:
  - Exportación en formatos **PNG** (óptimo para transparencias), **JPG** (con compresor de calidad web) y **WebP**.
  - Descarga de todas las imágenes convertidas empaquetadas en un único archivo `.zip` mediante **JSZip**.
-  **Comodidad de Entrada**:
  - Arrastrar y soltar (*Drag & Drop* múltiple).
  - Pegar directo desde el portapapeles con `Cmd + V` / `Ctrl + V`.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5 Semántico**: Estructura accesible y modular.
- **CSS3 Moderno**: Variables personalizadas, CSS Grid, Flexbox y diseño responsivo adaptado a dispositivos móviles y escritorio.
- **Vanilla JavaScript (ES6+)**:
  - `HTMLCanvasElement` y manipulación de píxeles (`ImageData`).
  - Algoritmo de recorrido BFS (*Breadth-First Search*) para detección de contornos exteriores.
  - `FileReader API` y `Blob URL` para transferencias eficientes en memoria.
- **JSZip**: Compresión y generación de archivos ZIP en tiempo real del lado del cliente.

---

##  Instalación y Uso Rápido

No requiere instalación de dependencias, Node.js ni configuración previa de servidores.

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/luchonicolini/Cambio_Taman-o.git
   cd Cambio_Taman-o
   ```

2. **Abrir en el navegador**:
   - En macOS / Linux:
     ```bash
     open index.html
     ```
   - En Windows:
     ```cmd
     start index.html
     ```
   - O simplemente haz doble clic sobre el archivo `index.html`.

---

##  Casos de Uso

- **E-commerce Sellers**: Vendedores de Mercado Libre, Amazon, Tiendanube y WooCommerce que necesitan cumplir los estándares de publicación de catálogo.
- **Diseñadores & Desarrolladores Web**: Estandarización rápida de assets gráficos antes de integrarlos a maquetas o código.
- **Fotografía de Producto**: Limpieza de fondo y encuadre cuadrado rápido para catálogos digitales y redes sociales.

---

##  Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar el algoritmo de recorte, añadir nuevos formatos o enriquecer la interfaz:

1. Haz un Fork del proyecto.
2. Crea tu rama de características (`git checkout -b feature/NuevaCaracteristica`).
3. Confirma tus cambios (`git commit -m 'Añade una nueva característica'`).
4. Haz Push a la rama (`git push origin feature/NuevaCaracteristica`).
5. Abre un Pull Request.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más información.

---

Desarrollado con dedicación por [Luciano Nicolini](https://github.com/luchonicolini) 🚀
