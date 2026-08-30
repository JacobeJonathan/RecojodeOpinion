# Sistema de Supervisión CAR — Web + Google Sheets

Este paquete contiene un prototipo funcional de:
- formulario web para la Lista de Cotejo Observacional 0–3 años;
- 10 niños;
- indicadores físicos, emocionales, socialización, lenguaje y psicomotores;
- respuestas Sí / No / vacío;
- creación de un ID único por supervisión;
- guardado en Google Sheets;
- modificación del mismo registro/fila cuando se vuelve a guardar usando el mismo ID;
- consulta y apertura de registros existentes.

## 1. Crear Google Sheet
Crea una hoja de cálculo de Google. Luego ve a:
Extensiones → Apps Script.

Copia el contenido de `Code.gs` en el editor y guarda.

## 2. Publicar el backend
En Apps Script:
Implementar → Nueva implementación → Aplicación web.

Ejecutar como: Tú
Quién tiene acceso: según la política de tu organización (para una prueba puedes usar "Cualquiera").

Copia la URL que termina en `/exec`.

## 3. Conectar la web
Abre `index.html` y busca:

PEGA_AQUI_LA_URL_DE_TU_WEB_APP_DE_APPS_SCRIPT

Reemplázalo por la URL `/exec` que te dio Apps Script.

Ejemplo:
WEB_APP_URL:"https://script.google.com/macros/s/XXXXX/exec"

## 4. Abrir la web
Puedes abrir `index.html` localmente para probarla. Para uso institucional conviene publicarla en un hosting web o, mejor aún, servirla desde Apps Script/Google Workspace según las políticas de tu entidad.

## Cómo funciona la actualización
Cada supervisión recibe un ID como:
CAR-A1B2C3D4

Al registrar por primera vez, se crea una fila.
Si luego cargas ese registro, cambias una respuesta y vuelves a pulsar "Registrar / actualizar", Apps Script busca ese ID en la columna A y actualiza esa misma fila.

## PDF
La importación de un PDF rellenable todavía no está conectada en este prototipo. Para hacerla de forma fiable, el PDF debe tener campos de formulario con nombres/IDs consistentes con los indicadores. El siguiente paso puede ser generar ese PDF y agregar "Subir PDF → detectar campos → cargar formulario → Registrar".
