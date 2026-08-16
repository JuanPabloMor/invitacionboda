# Invitación de boda - landing page

## 1. Objetivo

Crear una landing page elegante, emotiva y clara para la boda de Juan Pablo y Sandra. La web debe transmitir una estética editorial, sobria y cuidada, inspirada en una invitación premium de una sola página.

## 2. Información confirmada

- Novios: Juan Pablo Morales Salinas y Sandra Chaves Muros
- Fecha: 14 de noviembre de 2026
- Hora de inicio: 13:00 h
- Lugar: Hotel Restaurante Boabdil
- Google Maps: https://maps.app.goo.gl/bfryAwxdhYAtveXZ9
- Todo el evento se celebra en la misma ubicación
- No incluir música de fondo
- No incluir información de transporte, buses o alojamiento

## 3. Enfoque de la web

La página será una invitación digital de una sola vista, pensada sobre todo para móvil, con scroll vertical y secciones breves. Debe priorizar:

- claridad
- elegancia
- ritmo visual pausado
- buena legibilidad
- navegación simple

## 4. Contenido que debe mostrar

- presentación de la pareja
- fecha, hora y lugar
- programa básico del día
- galería de imágenes
- formulario de confirmación de asistencia
- formulario de petición de canciones para la fiesta
- álbum compartido de fotos
- cierre emocional

## 5. Estructura de la página

### 5.1 Hero / portada

Debe incluir:

- nombres de los novios
- fecha de la boda
- lugar de celebración
- frase principal: El destino nos tejio en la misma historia
- botón de Confirmar asistencia
- imagen principal de portada #faltainformacion

Referencia técnica:

- guardar la imagen principal en `assets/images/hero.jpg` #faltainformacion

### 5.2 Presentación

Texto base confirmado:

> Nos encantaría que nos acompañaras en este día tan importante para nosotros.

> Durante estos 15 años, hemos formado una familia con Marién y Leo y ahora queremos celebrar nuestro enlace con vosotros, otra parte muy importante de esta historia.

Debe mostrarse también:

- Sandra Chaves Muros
- Juan Pablo Morales Salinas
- 14 de noviembre de 2026
- Hotel Restaurante Boabdil

### 5.3 Fecha y lugar

Debe mostrar de forma clara:

- fecha exacta
- hora de inicio
- nombre del lugar
- enlace directo a Google Maps
- mensaje simple indicando que toda la celebración será en la misma ubicación

### 5.4 Programa del evento

Contenido actual:

- Ceremonia de enlace - 13:00 h
- Cóctel y almuerzo - 14:00 h
- Fiesta y baile: Durante toda la tarde-noche
- Cierre de la celebración - 00:00 h

Menú principal para adultos:

- Lomo de bacalao al alioli de aguacate, jengibre y lima sobre risoto de trigo con camarones y leche de coco
- Medallones de solomillo de cerdo en salsa de pimiento de jamaica con graten de patatas y calabacino relleno

### 5.5 Galería

- imágenes de la pareja #faltainformacion
- estilo limpio y editorial
- cuadrícula sencilla

### 5.6 Confirmación de asistencia

El formulario debe incluir únicamente:

- confirmación de asistencia
- número de adultos
- nombre y apellidos de cada adulto
- selección de plato para cada adulto
- intolerancias de cada adulto
- número de niños
- nombre y apellidos de cada niño
- intolerancias de cada niño
- botón de envío

Ejemplo de campos:

- ¿Asistirás?
- Número de adultos
- Nombre y apellidos / Adulto 1
- Plato / Adulto 1
- Intolerancias / Adulto 1
- Número de niños
- Nombre y apellidos / Niño 1
- Intolerancias / Niño 1

Validaciones mínimas:

- no permitir enviar el formulario si no se ha indicado al menos 1 adulto
- no permitir enviar el formulario si falta el nombre y apellidos del Adulto 1
- no permitir enviar el formulario si falta el plato del Adulto 1 cuando haya asistencia
- en intolerancias, mostrar por defecto `No`; si se marca `Sí`, abrir un campo de texto para detallar la información

### 5.7 Álbum compartido

Se añadirá un álbum compartido en Google Photos para que los invitados puedan subir fotos del enlace antes, durante y después de la boda.

Debe incluir:

- título del bloque: Álbum compartido o Álbum de fotos
- texto breve invitando a compartir recuerdos
- botón con enlace directo al álbum
- QR visible para abrir el álbum desde el móvil
- texto aclarando que se pueden subir fotos relevantes del enlace

Flujo recomendado:

- crear un álbum en Google Photos desde la cuenta que vaya a gestionarlo
- activar enlace compartido
- permitir que otras personas añadan fotos
- copiar el enlace público del álbum
- generar un QR con ese enlace
- mostrar enlace y QR en la web

Texto sugerido:

> Ayúdanos a guardar cada recuerdo de este día.

> Comparte aquí las fotos y vídeos que hagas antes, durante o después de la boda para que todos podamos disfrutarlos.

Notas prácticas:

- Google Photos es una opción sencilla y gratuita
- conviene comprobar antes del evento que el álbum permite aportaciones
- el propietario del álbum será quien centralice las fotos compartidas
- puede requerir cuenta de Google para subir contenido, según la configuración del álbum

### 5.8 Petición de canciones para la fiesta

Debe existir un segundo formulario, separado del RSVP, para que cualquier invitado pueda pedir canciones para la fiesta.

Objetivo del bloque:

- recoger canciones que los invitados quieran escuchar durante la fiesta
- permitir que una misma persona lo rellene varias veces si quiere proponer más de una canción
- generar un listado final que pueda compartirse con el DJ en los días previos a la boda

Texto base del bloque:

> Abajo del todo, pídele una canción al DJ durante la fiesta.

> Si quieres que sí o sí suene algo, deberás incluirlo en la lista.

Debe incluir:

- título del bloque, por ejemplo: Pide tu canción o Canciones para la fiesta
- texto explicativo breve
- campo nombre y apellidos
- campo canción
- campo artista o versión
- campo opcional para dedicatoria o comentario
- botón de enviar

Comportamiento esperado:

- este formulario debe poder enviarse tantas veces como se quiera
- no debe bloquearse a un único envío por invitado
- cada envío debe guardarse como una petición independiente
- debe poder exportarse o recopilarse fácilmente en un listado único para el DJ

Validaciones mínimas:

- no permitir enviar si falta el nombre
- no permitir enviar si falta el título de la canción
- limitar la longitud de los textos para evitar entradas demasiado largas

Resultado esperado:

- disponer de un listado consolidado de canciones sugeridas
- revisar ese listado manualmente antes del evento
- pasar la selección final al DJ unos días antes de la boda

### 5.9 Mensaje final

- cierre emocional con agradecimiento
- mensaje final breve y elegante

> Gracias por formar parte de nuestra historia y por acompañarnos en un día tan especial.

> Será un regalo celebrar este momento con vosotros.

## 6. Estilo visual

### 6.1 Dirección visual

- minimalista
- elegante
- sobria
- editorial
- con mucho espacio en blanco

### 6.2 Paleta sugerida

- fondo principal: #F7F3EE
- texto principal: #161616
- acento: #C8A96D
- detalle suave: #E9E1D8

### 6.3 Tipografía sugerida

- títulos: Cormorant Garamond, Playfair Display o Libre Baskerville
- texto general: Montserrat, Inter o Manrope

## 7. Alcance técnico

Para esta primera versión, el proyecto debe mantenerse simple:

- HTML5
- CSS3
- JavaScript
- estructura estática ligera

## 8. Gestión de datos

### 8.0 Estado actual del proyecto

Implementado en local:

- backend Node con Express en `server.js`
- formulario RSVP conectado a `POST /api/rsvp`
- formulario de canciones conectado a `POST /api/songs`

## 9. Despliegue en la nube (Render)

Este proyecto ya incluye configuración para desplegar como servicio web en Render usando [render.yaml](render.yaml).

### 9.1 Requisitos

- repositorio subido a GitHub
- cuenta en Render

### 9.2 Pasos

1. En Render, pulsa New y luego Blueprint.
2. Conecta tu repositorio de GitHub.
3. Render detectará [render.yaml](render.yaml) y creará el servicio web.
4. Define los secretos en Render:
	- `ADMIN_TOKEN`
	- `GOOGLE_SHEETS_ID`
	- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
	- `GOOGLE_PRIVATE_KEY`
5. Lanza el deploy.

### 9.3 Persistencia de datos

- En despliegue gratuito se usa almacenamiento efímero (`/tmp/invitacionesboda-data`).
- La persistencia real debe hacerse en Google Sheets.
- `SHEETS_REQUIRED=true` hace que la API falle si no puede escribir en Google Sheets.
- En local puedes seguir usando `./data` para pruebas.

### 9.4 Verificación

- Healthcheck: `GET /healthz`
- URL principal: `/`
- Panel admin: `/admin`

## 10. Despliegue en la nube (Vercel gratuito)

El proyecto ya está preparado para Vercel con:

- [api/index.js](api/index.js) como handler serverless
- [vercel.json](vercel.json) con rutas a Express

### 10.1 Pasos

1. En Vercel pulsa Add New y luego Project.
2. Importa el repo `JuanPabloMor/invitacionboda`.
3. Framework: Other.
4. Deploy.

### 10.2 Variables de entorno en Vercel

Define estas variables en el proyecto:

- `ADMIN_TOKEN`
- `GOOGLE_SHEETS_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `DATA_DIR=/tmp/invitacionesboda-data`
- `SHEETS_REQUIRED=true`

### 10.3 Nota importante

- En Vercel el almacenamiento local es efímero.
- Con `SHEETS_REQUIRED=true`, la API solo considera éxito cuando guarda en Google Sheets.
- almacenamiento en `data/rsvp.json` y `data/songs.json`
- panel de administración en `/admin`
- exportación CSV en:
	- `GET /api/admin/export/rsvp.csv`
	- `GET /api/admin/export/songs.csv`

Arranque:

- `npm install`
- `npm start`
- web principal: `http://localhost:3000`
- panel admin: `http://localhost:3000/admin`

Seguridad básica recomendada:

- definir `ADMIN_TOKEN` en variables de entorno para proteger `/admin` y rutas de exportación
- usar el archivo `.env.example` como referencia

### 8.4 Integración con Google Sheets

La aplicación ya está preparada para escribir RSVP y canciones en una hoja de cálculo de Google. Para activarlo hay que completar estas variables en `.env`:

- `GOOGLE_SHEETS_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`

Flujo de integración:

- crear una cuenta de servicio en Google Cloud
- descargar la clave JSON de esa cuenta
- compartir la hoja de cálculo con el correo de la cuenta de servicio
- copiar el ID de la hoja desde la URL
- pegar los valores en `.env` siguiendo el formato de `.env.example`

Una vez configurado:

- cada RSVP se guarda en `data/rsvp.json` y también se añade a la hoja `RSVP`
- cada canción se guarda en `data/songs.json` y también se añade a la hoja `Canciones`
- el botón de restablecer limpia los datos locales y reinicia ambas pestañas de Google Sheets

### 8.1 Cómo gestiona el RSVP la web de ejemplo

Del análisis de la demo de referencia se observa lo siguiente:

- la página está hecha con Next.js y carga la configuración del formulario en frontend
- el bloque de asistencia usa una estructura `assistForm` para definir campos, tipos, opciones y obligatoriedad
- al enviar, el formulario construye un JSON con datos generales y listas de adultos y niños
- el envío se hace por `fetch` a endpoints propios de la aplicación

Endpoints detectados en la demo:

- `POST /api/guests/create`
- `PATCH /api/guests/update`

Estructura de envío observada:

- `uid`: identificador de la invitación
- `responses`: objeto con las respuestas del formulario
- `lang`: idioma
- `group`: grupo de invitado, si existe
- `token`: token asociado al invitado, si existe
- `guestId`: solo cuando se actualiza una respuesta existente

Dentro de `responses`, la demo agrupa especialmente:

- `assist`
- `adultsCount`
- `adults`: array con los adultos
- `kidsCount`
- `kids`: array con los niños
- resto de campos adicionales definidos en la configuración

Conclusión práctica:

- la demo no usa Google Forms ni un proveedor externo visible para el RSVP
- usa backend propio con API para guardar y actualizar respuestas
- desde fuera no se puede verificar en qué base de datos exacta persisten esos datos

### 8.2 Recomendación para este proyecto

Para vuestra web, lo más razonable es una de estas dos opciones:

- opción simple: formulario conectado a un backend ligero que guarde respuestas en una hoja o base de datos
- opción más sólida: API propia con almacenamiento estructurado de invitados y respuestas

Datos que conviene guardar por cada confirmación:

- asistencia
- número de adultos
- nombre y apellidos de cada adulto
- plato elegido por cada adulto
- intolerancias de cada adulto
- número de niños
- nombre y apellidos de cada niño
- intolerancias de cada niño
- fecha de envío o actualización

### 8.3 Datos para el formulario de canciones

Este segundo formulario debe guardarse por separado del RSVP.

Datos mínimos por cada petición:

- nombre y apellidos del invitado
- título de la canción
- artista o versión
- comentario o dedicatoria, si se añade
- fecha de envío

Requisitos funcionales:

- admitir múltiples envíos del mismo invitado
- no sobrescribir peticiones anteriores
- permitir exportar fácilmente el listado completo
- poder revisar y limpiar duplicados manualmente antes de enviarlo al DJ

Formato de salida recomendado:

- una lista o tabla con una fila por canción solicitada
- opción sencilla de exportación a CSV, Google Sheets o documento compartido

## 9. Estructura de proyecto

```bash
project/
├── index.html
├── styles/
│   └── main.css
├── scripts/
│   └── main.js
├── assets/
│   └── images/
└── README.md
```

## 10. Requisitos pendientes

Falta completar:

- imagen principal de portada #faltainformacion
- imágenes de galería #faltainformacion
- enlace definitivo del álbum compartido #faltainformacion
- QR definitivo del álbum compartido #faltainformacion
- definir si el formulario de canciones tendrá dedicatoria #faltainformacion
- definir el canal final de entrega al DJ #faltainformacion

## 11. Checklist

- [x] definir novios, fecha y lugar
- [x] definir el tono general de la invitación
- [x] definir el contenido básico de la página
- [x] definir la lógica del formulario RSVP
- [ ] preparar imagen principal
- [ ] preparar imágenes de galería
- [ ] crear álbum compartido en Google Photos
- [ ] obtener enlace y QR del álbum
- [ ] definir y montar el formulario de canciones
- [ ] preparar exportado o listado para el DJ
- [ ] redactar mensaje final
- [ ] maquetar la landing
- [ ] implementar el formulario
- [ ] ajustar responsive
- [ ] probar en móvil y escritorio

## 12. Nota

Este README define el alcance actual de la web. Todo lo que no esté aquí debe considerarse fuera de alcance por ahora para mantener la invitación limpia, elegante y fácil de construir.
