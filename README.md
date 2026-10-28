# Bloque 00 · Preparación

## Resultado
- Qué preparé: continué en el workspace existente del proyecto, con `backend/` y `mobile/`; no cloné el cuaderno web dentro de la aplicación.
- Herramientas comprobadas: usé Node 22.23.4 temporalmente para validar las versiones que fija el curso.

## Comprensión
- Recorrido del dato, explicado con mis palabras: el cuaderno contiene las instrucciones y este repositorio contiene el código de Festival Control.
- Cambio guiado y resultado: conservé la ubicación actual del repositorio y añadí la estructura mobile solicitada en el bloque 05.
- Error encontrado y cómo lo resolví: el Node global es 24, fuera del rango del curso; ejecuté las comprobaciones necesarias con Node 22 sin cambiar la instalación global.

## Evidencias
- Captura o transcripción breve, sin credenciales: `node --version` con el runtime temporal → `v22.23.4`.
- Limitaciones del ejercicio: el repositorio ya existía fuera de la ruta de ejemplo de Windows, así que no lo moví ni lo volví a clonar.

# Festival Control · Bloque 01

## Qué he construido
Un handler TypeScript (`hello`) que devuelve un JSON con estado HTTP 200 y se puede consultar por HTTP en local.

## Qué he comprendido
El cliente envía una petición HTTP; Serverless Offline interpreta la ruta de `serverless.yml`, invoca el handler compilado y devuelve su respuesta. `tsc` transforma el código fuente de `src` en JavaScript dentro de `dist`.

## Qué he modificado
He trabajado en `backend/src/hello.ts`, `backend/tsconfig.json` y `backend/serverless.yml`. El archivo compilado de `dist` se genera con el build.

## Cómo lo he comprobado
La ruta `GET /dev/hello` devuelve HTTP 200 y un JSON. La compilación y la comprobación de tipos se ejecutan desde `backend`.

# Bloque 02

## Resultado
- Qué añadí al proyecto: el handler `getEvent` y la ruta dinámica `GET /events/{id}`.
- Ruta o pantalla comprobada: `GET http://localhost:3000/dev/events/EVT-101`.
- Estado y respuesta observados: HTTP 200 y el JSON de la actuación con id `EVT-101`.

## Comprensión
- Recorrido del dato, explicado con mis palabras: Serverless Offline obtiene el id de la URL, lo incluye en `event.pathParameters.id` y llama al handler; este devuelve el resultado como JSON.
- Cambio guiado y resultado: añadí un parámetro de ruta y una validación para responder 400 si falta el id. En el bloque 04 la consulta queda limitada al catálogo fijo y un id desconocido responde 404.
- Error encontrado y cómo lo resolví: no se detectó un error pendiente en este ejercicio.

## Evidencias
- Captura o transcripción breve, sin credenciales: `GET /dev/events/EVT-101` → `200`; `GET /dev/events/EVT-999` → `404`.
- Limitaciones del ejercicio: en el bloque 02 se devolvía una ficha simulada; el catálogo real de esta práctica se incorpora en el bloque 04.

# Bloque 03

## Resultado
- Qué añadí al proyecto: un endpoint `POST /events` para validar y recibir una actuación en JSON.
- Ruta o pantalla comprobada: `POST http://localhost:3000/dev/events`.
- Estado y respuesta observados: los datos válidos responden 201 con id `EVT-NEW`; JSON mal formado o campos inválidos responden 400.

## Comprensión
- Recorrido del dato, explicado con mis palabras: el body llega como texto; el handler lo analiza, comprueba el tipo y valida artista, espacio, hora y estado antes de responder.
- Cambio guiado y resultado: añadí `backend/src/events/create.ts` y reutilicé su contrato en el API CRUD del bloque 04.
- Error encontrado y cómo lo resolví: los datos externos se tratan como desconocidos y se validan en tiempo de ejecución; el tipado de TypeScript por sí solo no valida una petición.

## Evidencias
- Captura o transcripción breve, sin credenciales: `POST /dev/events` válido → HTTP 201; body inválido → HTTP 400.
- Limitaciones del ejercicio: el id `EVT-NEW` es didáctico; no se guarda una nueva actuación.

# Bloque 04

## Resultado
- Qué añadí al proyecto: handlers para listar, consultar, crear, sustituir, actualizar parcialmente y eliminar actuaciones.
- Ruta o pantalla comprobada: `GET /dev/events`, `GET /dev/events/EVT-101` y métodos POST, PUT, PATCH y DELETE sobre `/dev/events/{id}`.
- Estado y respuesta observados: el catálogo conocido devuelve 200; creación, 201; entradas inválidas, 400; ids inexistentes, 404.

## Comprensión
- Recorrido del dato, explicado con mis palabras: `serverless.yml` enlaza cada método/ruta con su handler; `events/model.ts` comparte el catálogo, validación y respuestas JSON.
- Cambio guiado y resultado: añadí el modelo y los handlers en `backend/src/events/`. Las respuestas habilitan CORS para poder leerlas desde la aplicación web.
- Error encontrado y cómo lo resolví: separé el contrato común de los handlers para mantener la validación coherente en todas las operaciones.

## Evidencias
- Captura o transcripción breve, sin credenciales: la lista contiene `EVT-101` y `EVT-102`; un PATCH válido responde `{"id":"EVT-101","changes":{"status":"CANCELLED"},"operation":"UPDATED"}`.
- Limitaciones del ejercicio: las escrituras son simuladas. El catálogo no cambia tras POST, PUT, PATCH o DELETE; no hay base de datos.

# Bloque 05

## Resultado
- Qué añadí al proyecto: una aplicación Expo/React Native con TypeScript en `mobile/`, tarjetas seleccionables y estado de selección.
- Ruta o pantalla comprobada: aplicación web Expo con dos tarjetas del catálogo y selección `EVT-101`.
- Estado y respuesta observados: la pantalla muestra las actuaciones y permite seleccionar una sin depender del backend para el estado de selección.

## Comprensión
- Recorrido del dato, explicado con mis palabras: `App.tsx` representa componentes nativos; `useState` conserva la selección y React vuelve a renderizar al cambiarla.
- Cambio guiado y resultado: fijé las versiones de Expo SDK 54 y añadí los tipos, configuración y scripts del cliente.
- Error encontrado y cómo lo resolví: el host informa Node 24, fuera del rango fijado por el curso. Comprobé el cliente con Node 22.23.4 temporal, sin cambiar la instalación global.

## Evidencias
- Captura o transcripción breve, sin credenciales: `npm run typecheck` y `npm run build:web` completan con Node 22.23.4.
- Limitaciones del ejercicio: la aplicación final obtiene los datos por HTTP en los bloques 06 y 07.

# Bloque 06

## Resultado
- Qué añadí al proyecto: un cliente HTTP centralizado en `mobile/src/api.ts` y carga inicial del catálogo en la pantalla.
- Ruta o pantalla comprobada: `GET http://localhost:3000/dev/events`.
- Estado y respuesta observados: la pantalla muestra las dos actuaciones que responde el backend; expone el error y permite reintentar la carga.

## Comprensión
- Recorrido del dato, explicado con mis palabras: `useEffect` llama a `getEvents`, `fetch` consulta el endpoint, se valida el JSON y el estado de la interfaz dibuja las tarjetas.
- Cambio guiado y resultado: comprobé `response.ok`, validé la forma de los datos y añadí los estados de carga y error.
- Error encontrado y cómo lo resolví: el navegador necesita CORS aunque app y API estén en el mismo ordenador; el backend devuelve los headers necesarios.

## Evidencias
- Captura o transcripción breve, sin credenciales: Expo Web mostró las tarjetas `EVT-101` y `EVT-102` recibidas por `http://localhost:3000/dev/events`.
- Limitaciones del ejercicio: `localhost` apunta al ordenador que ejecuta el navegador; para un teléfono físico se necesita la dirección accesible del ordenador.

# Bloque 07

## Resultado
- Qué añadí al proyecto: acciones de interfaz para POST, PUT, PATCH y DELETE, además de GET.
- Ruta o pantalla comprobada: operaciones de la pantalla hacia `/dev/events` y `/dev/events/{id}`.
- Estado y respuesta observados: la pantalla enseña el JSON devuelto y bloquea los botones mientras espera la respuesta.

## Comprensión
- Recorrido del dato, explicado con mis palabras: cada botón llama al helper de `api.ts`, que traduce la acción a método, ruta y body; el handler devuelve el resultado que se muestra en pantalla.
- Cambio guiado y resultado: añadí manejo asíncrono de operaciones y errores sin alterar optimistamente la lista.
- Error encontrado y cómo lo resolví: mantuve el catálogo visible sin afirmar que se guardaron cambios que el backend no persiste.

## Evidencias
- Captura o transcripción breve, sin credenciales: PATCH de `EVT-101` desde la pantalla → HTTP 200 y operación `UPDATED`.
- Limitaciones del ejercicio: las operaciones de escritura responden como simulaciones y no se reflejan en una consulta GET posterior.

# Bloque 08

## Resultado
- Qué añadí al proyecto: configuración para desplegar las siete funciones con región, código de alumno y ARN de rol tomados de variables de entorno.
- Ruta o pantalla comprobada: servicio `festival-control-api-iker-66`, stage `dev`, región `us-east-1`; perfil AWS local `default` y rol de ejecución existente `LabRole`.
- Estado y respuesta observados: despliegue completado. Serverless informó las siete rutas HTTPS y las funciones Lambda correspondientes.

## Comprensión
- Recorrido del dato, explicado con mis palabras: el Framework compila el código y prepara CloudFormation; API Gateway llama a Lambda y sus registros se consultan en CloudWatch.
- Cambio guiado y resultado: la configuración no contiene credenciales ni ARN de rol; desplegué con `STUDENT_CODE=iker-66`, `AWS_REGION=us-east-1` y `LAMBDA_ROLE_ARN` apuntando al rol `LabRole`.
- Error encontrado y cómo lo resolví: las credenciales se habían actualizado en el perfil `default` y no en `academy`. Verifiqué la identidad STS sin mostrar claves y usé el perfil existente.

## Evidencias
- Captura o transcripción breve, sin credenciales: `serverless info` → `https://w28t1j5gwb.execute-api.us-east-1.amazonaws.com/dev`; GET devuelve HTTP 200 y CloudWatch registra las invocaciones de Lambda.
- Limitaciones del ejercicio: el perfil usa credenciales temporales del laboratorio; renueva la sesión si caducan. El servicio crea recursos de AWS en la cuenta del laboratorio mientras permanezca desplegado.

Para volver a desplegar desde PowerShell con una sesión vigente del laboratorio:

```powershell
Set-Location backend
$env:AWS_PROFILE = "default"
$env:AWS_REGION = "us-east-1"
$env:STUDENT_CODE = "iker-66"
$env:LAMBDA_ROLE_ARN = aws iam get-role --role-name LabRole --query "Role.Arn" --output text
npx serverless deploy --stage dev
```

# Bloque 09

## Resultado
- Qué añadí al proyecto: la app conserva el contrato y concentra su URL base en `mobile/src/api.ts`.
- Ruta o pantalla comprobada: Expo Web consume `https://w28t1j5gwb.execute-api.us-east-1.amazonaws.com/dev/events`.
- Estado y respuesta observados: cliente configurado contra API Gateway HTTPS; se verifica la misma respuesta del catálogo y los métodos de escritura simulados.

## Comprensión
- Recorrido del dato, explicado con mis palabras: al desplegar, se cambia la URL base por el endpoint HTTPS real; los mismos handlers y métodos siguen atendiendo las peticiones.
- Cambio guiado y resultado: cambié `API_URL` al endpoint real y validé el acceso HTTPS desde el cliente web.
- Error encontrado y cómo lo resolví: las escrituras devuelven resultados, pero no actualizan el catálogo; la interfaz lo aclara en lugar de simular persistencia.

## Evidencias
- Captura o transcripción breve, sin credenciales: GET cloud devuelve `EVT-101` y `EVT-102`; POST cloud devuelve HTTP 201; PATCH cloud devuelve HTTP 200.
- Limitaciones del ejercicio: la API solo está disponible mientras el laboratorio y los recursos desplegados sigan activos. No hay persistencia ni base de datos.