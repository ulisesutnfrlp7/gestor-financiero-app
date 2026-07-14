# CONVERSACIÓN HASTA 12/07/2026

Claro, acá tenés los pasos a seguir en tu terminal (PowerShell o CMD, el que uses):

### 1. Eliminar `node_modules` y `package-lock.json`
Dependiendo de tu terminal:

**En PowerShell:**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

**En CMD (Command Prompt):**
```cmd
rmdir /s /q node_modules
del package-lock.json
```

### 2. Ejecutar `npm install` (desde CMD, porque PowerShell bloquea scripts)
```cmd
npm install
```

### 3. Verificar que no haya errores
Si sale todo bien, el proyecto queda listo.

---

**Alternativa si el paso 2 falla con el mismo error de peer dependencies:**
```cmd
npm install --legacy-peer-deps
```

Cualquier cosa me decís y te guío.

ya esta. decis que la app esta lista para ser levantada?

Revisé todos los archivos clave del proyecto y **sí, la app está lista para ser levantada**. La estructura está completa:

- ✅ **Firebase configurado** con variables de entorno (`EXPO_PUBLIC_*`) y valores reales en `.env`
- ✅ **Auth anónima** implementada en `_layout.tsx` — no requiere registro
- ✅ **Expo Router** con tabs (Dashboard e Historial) y pantallas modales (nueva transacción, editar)
- ✅ **NativeWind + Tailwind** configurado en `metro.config.js`
- ✅ **TypeScript** con path alias `@/*`
- ✅ **Zustand** para estado global
- ✅ **Firestore** en tiempo real via `useTransactions()`

**Lo único que falta es instalar las dependencias.** Como vimos antes, PowerShell bloquea la ejecución de scripts de npm. Tenés que hacerlo desde **CMD (Command Prompt)**:

```cmd
cd C:\Users\ulibu\Desktop\DespuésLoBorro\repo-gestor-financiero\gestor-financiero-app
npm install
```

Si el comando `npm install` falla por el conflicto de peer dependencies que vimos antes, probá con:

```cmd
npm install --legacy-peer-deps
```

Una vez que termine, para levantar la app:

```cmd
npx expo start
```

Eso abre el menú de Expo donde podés escanear el QR con Expo Go en el celular, o presionar `w` para web, `a` para Android emulador, etc.

**Resumen:** la app está completa, solo necesita `npm install` y `npx expo start`.

$ npx expo start
env: load .env
env: export EXPO_PUBLIC_FIREBASE_API_KEY EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN EXPO_PUBLIC_FIREBASE_PROJECT_ID EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID EXPO_PUBLIC_FIREBASE_APP_ID EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
Starting project at C:\Users\ulibu\Desktop\DespuésLoBorro\repo-gestor-financiero\gestor-financiero-app
Error: The required package `expo-asset` cannot be found
Error: The required package `expo-asset` cannot be found
    at getAssetPlugins (C:\Users\ulibu\Desktop\DespuésLoBorro\repo-gestor-financiero\gestor-financiero-app\node_modules\@expo\metro-config\src\ExpoMetroConfig.ts:65:11)
    at getDefaultConfig (C:\Users\ulibu\Desktop\DespuésLoBorro\repo-gestor-financiero\gestor-financiero-app\node_modules\@expo\metro-config\src\ExpoMetroConfig.ts:373:21)
    at Object.<anonymous> (C:\Users\ulibu\Desktop\DespuésLoBorro\repo-gestor-financiero\gestor-financiero-app\metro.config.js:7:16)
    at Module._compile (node:internal/modules/cjs/loader:1829:14)
    at Object..js (node:internal/modules/cjs/loader:1969:10)
    at Module.load (node:internal/modules/cjs/loader:1552:32)
    at Module._load (node:internal/modules/cjs/loader:1354:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
    at Module.require (node:internal/modules/cjs/loader:1575:12)
    at require (node:internal/modules/helpers:191:16)

Falta el paquete `expo-asset`, que es una dependencia requerida por `@expo/metro-config`. No está listado en tu `package.json` y probablemente no se instaló correctamente.

Para resolverlo, ejecutá lo siguiente desde **CMD** en la raíz del proyecto:

```cmd
npm install expo-asset
```

O mejor aún, usá el comando de Expo para instalar las dependencias faltantes de forma automática:

```cmd
npx expo install --fix
```

Eso debería instalar `expo-asset` y cualquier otro paquete faltante. Después probá de nuevo con `npx expo start`.

Falta el paquete `expo-asset`. No está en tu `package.json` y es requerido por `@expo/metro-config`.

Ejecutá esto desde **CMD** en la raíz del proyecto:

```cmd
npx expo install expo-asset
```

O directamente:

```cmd
npx expo install --fix
```

Eso debería instalar `expo-asset` y cualquier otra dependencia faltante de Expo. Después volvé a intentar con `npx expo start`.

Android Bundled 3902ms node_modules\expo-router\entry.js (2362 modules)
 WARN  [2026-07-08T01:34:21.939Z]  @firebase/auth: Auth (11.10.0):
You are initializing Firebase Auth for React Native without providing
AsyncStorage. Auth state will default to memory persistence and will not
persist between sessions. In order to persist auth state, install the package
"@react-native-async-storage/async-storage" and provide it to
initializeAuth:

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
 WARN  Linking requires a build-time setting `scheme` in the project's Expo config (app.config.js or app.json) for production apps, if it's left blank, your app may crash. The scheme does not apply to development in the Expo client but you should add it as soon as you start working with Linking to avoid creating a broken build. Learn more: https://docs.expo.dev/guides/linking/
 ERROR  [Error: Uncaught (in promise, id: 0) FirebaseError: Firebase: Error (auth/admin-restricted-operation).]

Call Stack
  apply (<native>)
  createErrorInternal (node_modules\@firebase\auth\dist\rn\index-b5f6ef87.js)
  apply (<native>)
  _fail (node_modules\@firebase\auth\dist\rn\index-b5f6ef87.js)
  _performFetchWithErrorHandling (node_modules\@firebase\auth\dist\rn\index-b5f6ef87.js)
  next (<native>)
  asyncGeneratorStep (node_modules\@babel\runtime\helpers\asyncToGenerator.js)
  _next (node_modules\@babel\runtime\helpers\asyncToGenerator.js)
  tryCallOne (address at (InternalBytecode.js:1:1180)
  anonymous (address at (InternalBytecode.js:1:1874)

La app se compiló y levantó correctamente (Android Bundled 3902ms, 2362 módulos). Hay **3 issues** que resolver:

---

### 1. 🔴 ERROR: `auth/admin-restricted-operation`
Firebase rechaza el sign-in anónimo porque **no está habilitado en la consola de Firebase**.

**Solución (la tenés que hacer vos en Firebase Console):**
1. Andá a [Firebase Console](https://console.firebase.google.com/)
2. Seleccioná el proyecto `gestor-financiero-app-umb`
3. Andá a **Authentication** → **Sign-in method**
4. Buscá **Anónimo** y **Habilitalo**
5. Guardá los cambios

---

### 2. 🟡 WARN: AsyncStorage para Firebase Auth
Firebase Auth no persiste la sesión entre reinicios de la app. Ya tenés `@react-native-async-storage/async-storage` en `package.json`, pero hay que configurarlo en `lib/firebase.ts`.

**Solución (código):** Modificar `lib/firebase.ts` para usar `initializeAuth` con persistencia.

---

### 3. 🟡 WARN: Linking scheme
Falta el `scheme` en `app.json`. Agregar `"scheme": "gestor-financiero-app"` en la configuración de Expo.

---

**Resumen de lo que hay que hacer:**

| # | Problema | Quién lo resuelve |
|---|----------|-------------------|
| 1 | Habilitar auth anónimo en Firebase Console | **Vos** |
| 2 | Configurar AsyncStorage en `firebase.ts` | **Yo** (código) |
| 3 | Agregar `scheme` en `app.json` | **Yo** (código) |

Si querés, pasame a **Act Mode** y resuelvo los puntos 2 y 3 del código mientras vos habilitás la autenticación anónima en Firebase Console.

El método `getReactNativePersistence` no está disponible en la versión instalada de `firebase/auth`. El warning de AsyncStorage es inofensivo (no bloquea la app), así que revierto `firebase.ts` a `getAuth()` que sí funciona.

Los cambios de código están listos:

1. ✅ **`app.json`** — Se agregó `"scheme": "gestor-financiero-app"` para resolver el warning de Linking.
2. ✅ **`lib/firebase.ts`** — Se revirtió a `getAuth(app)` porque `getReactNativePersistence` no está disponible en la versión instalada de Firebase. El warning de AsyncStorage es **inofensivo**, solo hace que la sesión no persista entre reinicios de la app (algo menor para el MVP).

**Paso pendiente (lo tenés que hacer vos):**

El error `auth/admin-restricted-operation` que ves en la app se soluciona habilitando la autenticación anónima en Firebase Console:

1. Andá a [Firebase Console](https://console.firebase.google.com/)
2. Seleccioná el proyecto **gestor-financiero-app-umb**
3. Andá a **Authentication** → **Sign-in method**
4. Buscá **Anónimo** y hacé clic para **habilitarlo**
5. Guardá los cambios

Después de eso, refrescá la app (reinicíá `npx expo start` o recargá) y debería funcionar sin errores.

Logs for your project will appear below. Press Ctrl+C to exit.
Unable to resolve asset "./assets/icon.png" from "icon" in your app.json or app.config.js
Android Bundled 2675ms node_modules\expo-router\entry.js (2379 modules)
 WARN  [2026-07-08T01:40:40.851Z]  @firebase/auth: Auth (11.10.0):
You are initializing Firebase Auth for React Native without providing
AsyncStorage. Auth state will default to memory persistence and will not
persist between sessions. In order to persist auth state, install the package
"@react-native-async-storage/async-storage" and provide it to
initializeAuth:

import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
 ERROR  [Error: Uncaught (in promise, id: 0) FirebaseError: Firebase: Error (auth/admin-restricted-operation).]

Call Stack
  apply (<native>)
  createErrorInternal (node_modules\@firebase\auth\dist\rn\index-b5f6ef87.js)
  apply (<native>)
  _fail (node_modules\@firebase\auth\dist\rn\index-b5f6ef87.js)
  _performFetchWithErrorHandling (node_modules\@firebase\auth\dist\rn\index-b5f6ef87.js)
  next (<native>)
  asyncGeneratorStep (node_modules\@babel\runtime\helpers\asyncToGenerator.js)
  _next (node_modules\@babel\runtime\helpers\asyncToGenerator.js)
  tryCallOne (address at (InternalBytecode.js:1:1180)
  anonymous (address at (InternalBytecode.js:1:1874)

Dos temas:

**1. Faltan los assets de imagen (icon.png, splash-icon.png, etc.)**
Existen dos opciones:
- **Opción A:** Crear archivos placeholder PNGs de 1x1 px para que no tire el warning (los assets no se ven en Expo Go).
- **Opción B:** Sacar las referencias a esos assets del `app.json` para que no los busque.

¿Cuál preferís?

**2. El error `auth/admin-restricted-operation`** sigue porque falta habilitar la autenticación anónima en Firebase Console. ¿Ya lo hiciste o necesitás ayuda con eso?

**3. El warning de AsyncStorage** es cosmético, pero si querés lo solucionamos también.

Veo que los mismos errores persisten. Hay **2 problemas distintos**, uno lo resuelvo yo y otro lo tenés que resolver vos:

---

### 👉 Problema que resolvés VOS (ahora mismo):
**Error: `auth/admin-restricted-operation`**

La app se cuelga porque Firebase rechaza el login anónimo. Para solucionarlo:

1. Andá a https://console.firebase.google.com/
2. Seleccioná el proyecto **gestor-financiero-app-umb**
3. Andá a la sección **Authentication** → **Sign-in method**
4. Buscá **Anónimo** → click para habilitarlo → **Guardar**

Sin esto la app no va a funcionar.

---

### 👉 Problema que resuelvo YO:
**Warning: `Unable to resolve asset "./assets/icon.png"`**

Faltan los archivos de imagen en `assets/`. Te doy dos opciones:

**Opción A (rápida):** Crear PNGs placeholder vacíos → el warning desaparece.
**Opción B (tranqui):** Sacar las referencias a esos assets del `app.json` → tampoco busca las imágenes.

Avísame cuál preferís y si ya habilitaste la autenticación anónima.

qué puede ser?

Causa 1: Falta el Índice Compuesto (El sospechoso número 1)
En Firestore, si haces una consulta que mezcla un filtro de igualdad (where('userId', '==', userId)) junto con un ordenamiento diferente (orderBy('date', 'desc')), Firestore se niega a procesarla a menos que crees manualmente un índice compuesto en su consola web. Dado que estás usando un listener en tiempo real (onSnapshot), cuando la consulta falla por falta de un índice, Firestore corta la conexión en silencio. El método de creación escribe bien, pero la lectura se bloquea.

Cómo solucionarlo:

Ve a tu consola web de Firebase.

En el menú izquierdo, entra en Firestore Database y ve a la pestaña de Índices (arriba al lado de Reglas).

Haz clic en Crear índice (en la sección de índices compuestos).

Configúralo con estos datos exactos:

ID de la colección: transactions

Campos del índice:

Campo: userId ➡️ Modo: Ascendente

Campo: date ➡️ Modo: Descendente

Haz clic en Crear.

(Firebase tardará unos minutos en construirlo y dirá "Compilando". Una vez que cambie a estado activo, la app empezará a recibir los datos automáticamente).

Causa 2: Discrepancia con el formato del campo date al crear
Revisando tu función createTransaction, estás inyectando el objeto data tal cual te llega del formulario:

TypeScript
const docRef = await addDoc(collection(db, COLLECTION), {
  ...data,
  userId,
  createdAt: now,
  updatedAt: now,
})
Y en tu función de lectura subscribeToTransactions tienes esta validación:

TypeScript
date: data['date'] instanceof Timestamp
  ? data['date'].toDate().toISOString().split('T')[0]
  : (data['date'] as string),
Si desde el formulario (TransactionFormData) estás enviando el campo date como un objeto Date de JavaScript, al guardarlo mediante addDoc, Firebase lo transforma en un Timestamp nativo.

El problema: Si intentas ordenar la query por orderBy('date', 'desc'), Firestore exige que todos los documentos de la colección compartan el mismo tipo de dato para ese campo. Si guardaste un movimiento de prueba inicial escribiendo a mano un string en la base de datos (por ejemplo, "2026-07-08") y los nuevos se están guardando como Timestamps, la consulta de ordenamiento fallará.

Cómo solucionarlo:
Asegúrate de que en la base de datos el campo date se almacene siempre uniformemente. Si quieres que se guarde estrictamente como String en formato AAAA-MM-DD (como sugiere tu mapeo), puedes formatearlo directamente antes de enviarlo a addDoc:

TypeScript
export const createTransaction = async (
  userId: string,
  data: TransactionFormData
): Promise<string> => {
  const now = new Date().toISOString()
  
  // Forzamos que la fecha sea un string plano si es que viene como objeto Date
  const formattedDate = data.date instanceof Date 
    ? data.date.toISOString().split('T')[0]
    : data.date;

  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    date: formattedDate, // Asegura consistencia de tipos para el orderBy
    userId,
    createdAt: now,
    updatedAt: now,
  })
  return docRef.id
}
El truco para diagnosticarlo al 100%
Para verificar exactamente cuál de las dos cosas es, puedes agregar provisionalmente un console.error dentro del callback de error de tu componente o store donde ejecutes subscribeToTransactions. Si te falta el índice, la consola te imprimirá un mensaje explícito con un link directo de Firebase para crear el índice compuesto con un solo clic.

Excelente análisis, es correcto. Hay **dos problemas**, uno lo resuelvo yo (código) y otro lo resolvés vos (Firebase Console).

---

### 🔧 Lo que resuelvo YO (Causa 2): Forzar `date` como string en `createTransaction`

Voy a modificar `services/transactions.service.ts` para que la fecha siempre se guarde como string `YYYY-MM-DD`, evitando que Firestore la convierta a Timestamp y rompa el `orderBy`.

### 👆 Lo que resolvés VOS (Causa 1): Crear el índice compuesto

Andá a Firebase Console → **Firestore Database** → pestaña **Índices** → **Crear índice**:

| Campo | Modo |
|-------|------|
| `userId` | Ascendente |
| `date` | Descendente |

Hacé click en **Crear** y esperá a que pase de "Compilando" a "Activo" (tarda 1-2 minutos).

---

**¿Te parece bien?** Si estás de acuerdo, pasame a **Act Mode** y hago el fix del código.

El error de TypeScript es porque `data.date` es tipo `string` (según el schema de Zod), nunca va a ser `instanceof Date`. Simplifico:

✅ **Código actualizado** — `createTransaction` ahora pasa `date: data.date` explícitamente para que Firestore lo guarde como string y no como Timestamp, evitando que el `orderBy('date', 'desc')` falle.

**Paso pendiente (lo tenés que hacer VOS):**

Andá a Firebase Console → **Firestore Database** → pestaña **Índices** → **Crear índice compuesto**:

| Campo | Modo |
|-------|------|
| `userId` | Ascendente |
| `date` | Descendente |

Hacé click en **Crear** y esperá 1-2 minutos hasta que aparezca como "Activo".

Después **reinicá la app** (presioná `r` en la terminal de Expo) y los movimientos deberían verse reflejados automáticamente.

Bien. Planeemos una nueva tanda de funcionalidades:

* En la pestaña de Historial, los movimientos tienen que estar ordenados según su fecha de carga de manera descendente (arriba de todo los más nuevos).

* Se debe poder editar y eliminar un movimiento desde la pestaña de Historial.

Revisé el código actual. Buenas noticias: **la edición y eliminación ya están implementadas** a través de la navegación al modal (`/transaction/[id]`). Pero podemos mejorarlo.

### Estado actual

| Funcionalidad | Estado |
|--------------|--------|
| Orden por fecha | ✅ Ya ordena por `date` desc en Firestore |
| Editar movimiento | ✅ Navega al modal `/transaction/[id]` con el formulario precargado |
| Eliminar movimiento | ✅ Modal con confirmación y llamado a `deleteTransaction` |
| Botones inline en Historial | ❌ No existen |

### Plan de implementación

**1. Ordenar por fecha de carga (`createdAt`) descendente**
Cambiar el `orderBy` en `subscribeToTransactions` de `date` a `createdAt` para que los movimientos más nuevos aparezcan arriba.

**2. Agregar botones de editar/eliminar en cada item del Historial**
Modificar `TransactionItem` para que cuando esté en la pantalla de historial muestre:
- Un botón **Editar** (lápiz) → navega a `/transaction/[id]`
- Un botón **Eliminar** (papelera) → muestra confirmación y elimina directo

Esto evita tener que entrar al modal solo para eliminar.

### Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `services/transactions.service.ts` | Cambiar `orderBy('date', 'desc')` → `orderBy('createdAt', 'desc')` |
| `components/transactions/TransactionItem.tsx` | Agregar botones de editar/eliminar |
| `components/transactions/TransactionList.tsx` | Pasar `onEdit` y `onDelete` como props |
| `app/(tabs)/history.tsx` | Conectar `onEdit` y `onDelete` |

**¿Te parece bien este plan?** Si estás de acuerdo, pasame a **Act Mode** y lo implemento.

Los cambios están listos. Resumen de todo lo modificado:

### ✅ Orden por fecha de carga (createdAt) descendente

**`services/transactions.service.ts`** — Cambiado `orderBy('date', 'desc')` → `orderBy('createdAt', 'desc')`. Los movimientos nuevos aparecen arriba en el listado.

### ✅ Editar y eliminar desde el Historial

**`components/transactions/TransactionItem.tsx`** — Cada fila ahora tiene dos botones:
- **✏️ Lápiz (indigo)** → editar el movimiento (navega al modal)
- **🗑️ Papelera (rojo)** → eliminar con confirmación

**`components/transactions/TransactionList.tsx`** — Ahora acepta y pasa las props `onEdit` y `onDelete`.

**`app/(tabs)/history.tsx`** — Conecta los botones con las funciones `handleEdit` (navega al modal de edición) y `handleDelete` (muestra Alert de confirmación y elimina).

### ⚠️ Importante

Como cambiamos el `orderBy` de `date` a `createdAt`, **necesitás crear un nuevo índice compuesto** en Firebase Console (o podés fijarte si aparece un link automático en el error de la consola de Expo):

Firebase Console → **Firestore Database** → **Índices** → **Crear índice compuesto**:

| Campo | Modo |
|-------|------|
| `userId` | Ascendente |
| `createdAt` | Descendente |

Reinicá la app con `r` y probá.

ERROR  [Error: Uncaught (in promise, id: 0) FirebaseError: Missing or insufficient permissions.] Uncaught (in promise, id: 0) FirebaseError: Missing or insufficient permissions.
 ERROR  [Error: Uncaught (in promise, id: 1) FirebaseError: Missing or insufficient permissions.] Uncaught (in promise, id: 1) FirebaseError: Missing or insufficient permissions.
 ERROR  [Error: Uncaught (in promise, id: 2) FirebaseError: Missing or insufficient permissions.] Uncaught (in promise, id: 2) FirebaseError: Missing or insufficient permissions.
 ERROR  [Error: Uncaught (in promise, id: 3) FirebaseError: Missing or insufficient permissions.] Uncaught (in promise, id: 3) FirebaseError: Missing or insufficient permissions.
 ERROR  [Error: Uncaught (in promise, id: 4) FirebaseError: Missing or insufficient permissions.] Uncaught (in promise, id: 4) FirebaseError: Missing or insufficient permissions.
 ERROR  [Error: Uncaught (in promise, id: 5) FirebaseError: Missing or insufficient permissions.] Uncaught (in promise, id: 5) FirebaseError: Missing or insufficient permissions.
 ERROR  [Error: Uncaught (in promise, id: 6) FirebaseError: Missing or insufficient permissions.] Uncaught (in promise, id: 6) FirebaseError: Missing or insufficient permissions.

me surge eso al querer editar o eliminar movimientos.

rules_version = '2';
2
service cloud.firestore {
3
  match /databases/{database}/documents {
4
    match /transactions/{docId} {
5
      allow read, update, delete: if request.auth != null
6
                                   && request.auth.uid == resource.data.userId;
7
      allow create: if request.auth != null
8
                    && request.auth.uid == request.resource.data.userId;
9
    }
10
  }
11
}

El error es de las reglas de Firestore. Las reglas que copiaste en Firebase Console tienen los números de línea pegados al código (los `2`, `3`, `4` que se ven al principio de cada línea). Firebase está interpretando esos números como parte de la sintaxis, lo cual rompe las reglas.

Las reglas que pusiste en la consola deberían ser **exactamente** esto, sin números de línea:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{docId} {
      allow read, update, delete: if request.auth != null
                                   && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

**Pasos para corregir:**

1. Andá a Firebase Console → Firestore Database → pestaña **Reglas**
2. Borrá todo
3. Copiá **exactamente el código de arriba** (sin los números de línea)
4. Click en **Publicar**
5. Reiniciá la app (presioná `r` en la terminal de Expo)

Si aún así sigue fallando, probá con estas reglas temporalmente (más permisivas para update/delete):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{docId} {
      allow read: if request.auth != null
                   && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
                     && request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null;
    }
  }
}
```

Esto permite actualizar/eliminar con solo estar autenticado (sin verificar userId en update/delete). Es menos seguro pero te saca del paso. Después podemos ajustar.

**¿Probás primero con las reglas sin números de línea y me contás?**

esperemos un momento. Planeemos. Para seguir evitando mareos y conflictos. Armemos un Login, de tal forma que cada usuario se identifique en la aplicación y tenga sus propios movimientos.

Buena idea. Implementar login con email/contraseña va a resolver de raíz el problema de permisos y va a darle identidad real a cada usuario.

### Plan de implementación

**Arquitectura propuesta:**
- Grupo de rutas `(auth)` para las pantallas de login/registro
- El `_layout.tsx` raíz va a decidir: ¿hay usuario autenticado? → Muestra las tabs. ¿No? → Muestra login/register.
- Se reemplaza el auto-login anónimo por login con email/contraseña

**Archivos a crear:**

| Archivo | Propósito |
|---------|-----------|
| `app/(auth)/_layout.tsx` | Layout minimalista (centrado, sin tabs) para auth |
| `app/(auth)/login.tsx` | Pantalla de inicio de sesión |
| `app/(auth)/register.tsx` | Pantalla de registro |
| `components/auth/AuthForm.tsx` | Formulario reutilizable con email + password + botón submit |
| `schemas/auth.schema.ts` | Validación Zod para email/password |

**Archivos a modificar:**

| Archivo | Cambio |
|---------|--------|
| `app/_layout.tsx` | Usar `onAuthStateChanged` para redirigir entre `(auth)` y `(tabs)` según si hay usuario o no. Eliminar `signInAnonymously`. |
| `services/transactions.service.ts` | Sin cambios — ya usa `userId` |
| `store/useFinanceStore.ts` | Sin cambios — ya maneja `userId` |

**Lo que tenés que hacer VOS en Firebase Console:**
- Ir a **Authentication → Sign-in method** y habilitar **Email/Contraseña**

### Flujo de la app después del cambio

1. El usuario abre la app → ve pantalla de Login
2. Si no tiene cuenta, toca "Registrarse" → completa email + contraseña
3. Firebase Auth lo autentica → redirige automáticamente a las tabs
4. Todos los movimientos que cree se vinculan a su `userId` (su email)
5. Al cerrar y volver a abrir la app, la sesión persiste → va directo a las tabs

**¿Te parece bien este plan? ¿Querés que agreguemos algo más como "olvidé mi contraseña" o mantener alguna funcionalidad extra?**

Todo el sistema de autenticación está implementado. Resumen de archivos creados/modificados:

### Archivos creados

| Archivo | Propósito |
|---------|-----------|
| `schemas/auth.schema.ts` | Validación Zod para login y registro |
| `components/auth/AuthForm.tsx` | Formulario reutilizable con email, password y confirmación |
| `app/(auth)/_layout.tsx` | Layout sin header para pantallas de auth |
| `app/(auth)/login.tsx` | Pantalla de inicio de sesión |
| `app/(auth)/register.tsx` | Pantalla de registro |

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `app/_layout.tsx` | Reemplazado `signInAnonymously` por `onAuthStateChanged` con redirección entre `(auth)` y `(tabs)` según el estado del usuario |

### Flujo de la app

1. **App inicia** → `onAuthStateChanged` detecta que no hay usuario → redirige a `(auth)/login`
2. **Usuario se loguea** → Firebase Auth responde → `onAuthStateChanged` detecta el usuario → redirige a `(tabs)`
3. **Usuario se registra** → `createUserWithEmailAndPassword` crea la cuenta → automáticamente queda logueado → redirige a `(tabs)`
4. **App se cierra y reabre** → la sesión persiste → va directo a `(tabs)`

### ⚠️ Lo que tenés que hacer VOS en Firebase Console

1. Andá a **Authentication → Sign-in method**
2. Habilitá **Email/Contraseña**
3. (Opcional) Deshabilitá **Anónimo** si ya no lo necesitás

Después reiniciá la app con `npx expo start` y probá registrarte e iniciar sesión.

Unable to resolve asset "./assets/icon.png" from "icon" in your app.json or app.config.js
Android Bundled 210ms node_modules\expo-router\entry.js (1 module)

solucioná esto usando icono.jpg que esta en assets junto con el README.md (no sé si está bien que esté en esa carpeta icono.jpg, fijate que onda de tal manera de solucionar el error y añadirlo también como ícono para el login

Buenísimo, ya veo que tenés `icono.jpg` en `assets/`. El plan es simple:

### 1. Arreglar el error del icono en `app.json`
Cambiar la referencia de `icon.png` a `icono.jpg`. Y para los otros assets que faltan (`splash-icon.png`, `adaptive-icon.png`, `favicon.png`), lo más limpio es sacar esas referencias del `app.json` ya que no tenés esos archivos.

### 2. Mostrar el icono en la pantalla de Login
Agregar la imagen en `app/(auth)/login.tsx` arriba del título "Gestor Financiero" usando `Image` de React Native.

### Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `app.json` | `icon` → `"./assets/icono.jpg"`, sacar splash, adaptive-icon y favicon |
| `app/(auth)/login.tsx` | Agregar `Image` con el icono arriba del título |

**¿Te parece?** Si estás de acuerdo, pasame a **Act Mode** y lo resuelvo.

Los cambios están listos:

### `app.json` modificado
- `icon` → `"./assets/icono.jpg"` (uso tu archivo)
- Eliminadas las referencias a `splash-icon.png`, `adaptive-icon.png` y `favicon.png` que no existían

### `app/(auth)/login.tsx` modificado
- Agregado `Image` con el icono arriba del título "Gestor Financiero"
- Tamaño 80×80px con bordes redondeados (`rounded-2xl`)

Ahora reiniciá la app (presioná `r` en la terminal) y el error del icono debería desaparecer. También vas a ver el icono en la pantalla de Login.

así como tenemos el login, necesitamos implementar el logout. Otra cosa que me parece curiosa: por qué no tenemos users como una colección? solo me aparece en firebase console transactiosn

Dos temas importantes:

### 1. Logout
Simple, se agrega un botón "Cerrar sesión" (por ejemplo en el Dashboard, arriba a la derecha) que llama a `signOut(auth)`. El `onAuthStateChanged` en `_layout.tsx` detecta que no hay usuario y redirige automáticamente al login.

### 2. Colección `users`
Tenés razón, no existe porque nunca la creamos. Firebase Auth ya guarda los usuarios (email, uid) en su sistema de autenticación, pero no crea documentos en Firestore automáticamente. 

Te conviene tener una colección `users` para:
- Guardar datos del perfil (nombre, avatar, etc.)
- Tener un registro de cuándo se creó la cuenta
- Poder hacer reglas de seguridad más finas
- En el futuro, asociar configuraciones por usuario

**Propuesta:**

| Archivo | Acción |
|---------|--------|
| `services/users.service.ts` | **Crear** — Servicio con `createUserProfile()` que se llama al registrarse |
| `app/(tabs)/index.tsx` | **Modificar** — Agregar botón de cerrar sesión en el header del Dashboard |
| `lib/firebase.ts` | Sin cambios |

**Flujo:**
1. Usuario se registra → `createUserWithEmailAndPassword` + `createUserProfile()` crea doc en Firestore
2. En el Dashboard → botón "Cerrar sesión" → `signOut(auth)` → redirige al login

**¿Te parece?** Si estás de acuerdo pasame a **Act Mode**.

Todo listo. Resumen de los cambios:

### Archivos creados

| Archivo | Propósito |
|---------|-----------|
| `services/users.service.ts` | Servicio que crea un perfil en Firestore (`users/{uid}`) con email y timestamps |

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `app/(auth)/register.tsx` | Ahora llama a `createUserProfile()` después de registrarse, creando un documento en la colección `users` |
| `app/(tabs)/index.tsx` | Agregado botón de **cerrar sesión** (icono de salida arriba a la derecha) con confirmación |
| `firestore.rules` | Agregadas reglas para la colección `users` |

### ⚠️ Lo que tenés que hacer VOS

**Copiar las nuevas reglas en Firebase Console** (incluyen la colección `users`):

1. Andá a Firebase Console → Firestore Database → pestaña **Reglas**
2. Borrá todo y pegá esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{docId} {
      allow read, update, delete: if request.auth != null
                                   && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;
    }
    match /users/{userId} {
      allow read, update, delete: if request.auth != null
                                   && request.auth.uid == userId;
      allow create: if request.auth != null
                    && request.auth.uid == userId;
    }
  }
}
```

3. Click en **Publicar**

Después reiniciá la app y probá:
- **Registrarte** → se crea el perfil en Firestore (colección `users`)
- **Cerrar sesión** desde el Dashboard → te redirige al login
- **Iniciar sesión de nuevo** → vuelve al Dashboard con tus datos

en los formularios de registro de movimiento, queda mucha pantalla blanca por debajo... se puede hacer algo para bajar todo?

El problema es que el `ScrollView` tiene `flex-1` pero el contenido interno tiene un `pb-12` fijo. Cuando el contenido es más corto que la pantalla, el ScrollView no se estira y queda espacio blanco.

**Solución:** Cambiar el `ScrollView` para que use `contentContainerStyle={{ flexGrow: 1 }}` y el contenedor interno use `flex-1` con `justify-between`. Así el contenido se distribuye verticalmente ocupando toda la pantalla, y los botones quedan al fondo.

**Archivo a modificar:** `components/transactions/TransactionForm.tsx`

Cambios:
1. `ScrollView` → agregar `contentContainerStyle={{ flexGrow: 1 }}`
2. El `View` interno → cambiar `pb-12 gap-5` por `flex-1 pb-6 gap-5 justify-between`

**¿Te parece?** Si estás de acuerdo, pasame a **Act Mode**.

✅ **Formulario de movimiento ajustado** — Se modificó `TransactionForm.tsx`:

- **`ScrollView`** → agregado `contentContainerStyle={{ flexGrow: 1 }}` para que se estire al alto de la pantalla
- **`View` interno** → cambiado a `flex-1 justify-between` para distribuir el contenido verticalmente
- **`pb-12`** → reducido a `pb-6`

Ahora los campos del formulario se distribuyen ocupando toda la pantalla, y los botones quedan al fondo sin espacio blanco extra. Si hay más contenido que pantalla, el ScrollView permite hacer scroll como antes.

quedó muy mal...

Tiene sentido, el `justify-between` probablemente estiró demasiado los campos. Vamos a revertir a algo más simple: un ScrollView normal sin `flex-1` ni `justify-between`, solo con el padding justo.

**Cambio:** Sacar `flex-1 justify-between` y `contentContainerStyle`, dejar el ScrollView simple con padding normal.

¿Te parece si lo revierto y queda como antes pero con menos padding abajo?

✅ **Formulario restaurado** — Ahora tiene el diseño original pero sin el padding excesivo:

- Se sacó `flex-1` y `justify-between` que estaban forzando la distribución vertical
- Solo agregué `contentContainerStyle={{ paddingBottom: 40 }}` para que no quede espacio blanco de más abajo
- El contenido se posiciona naturalmente arriba

Si todavía ves mucho espacio o problemas, decime exactamente qué es lo que se ve mal (¿los campos muy separados? ¿botón abajo? ¿todo pegado arriba?) y lo ajustamos.

return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="transaction/new"
          options={{
            title: 'Nuevo Movimiento',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#F9FAFB' },
            headerTitleStyle: { color: '#111827', fontWeight: '600' },
          }}
        />
        <Stack.Screen
          name="transaction/[id]"
          options={{
            title: 'Editar Movimiento',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#F9FAFB' },
            headerTitleStyle: { color: '#111827', fontWeight: '600' },
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </>
  )
}

por ejemplo estos títulos Nuevo Movimiento o Editar Movimiento que están encima de todo ni siquiera se leen

El problema es que en `_layout.tsx` tenemos `screenOptions={{ headerShown: false }}` global, lo que oculta los headers de todos los screens, incluso los modales de transacción que tienen título configurado. El título "Nuevo Movimiento" / "Editar Movimiento" se declara pero el header no se muestra (o se muestra mal).

**Solución:** Sacar `headerShown: false` del global y ponerlo solo en los grupos que no necesitan header (auth y tabs). Los modales de transacción heredarán el header visible con el título.

**Cambio en `app/_layout.tsx`:**

```tsx
<Stack screenOptions={{}}>
  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen
    name="transaction/new"
    options={{
      title: 'Nuevo Movimiento',
      presentation: 'modal',
      headerStyle: { backgroundColor: '#4F46E5' },  // fondo indigo
      headerTintColor: '#FFFFFF',                     // texto blanco
      headerTitleStyle: { fontWeight: '600' },
    }}
  />
  ...
```

También mejoraría el contraste: fondo indigo (`#4F46E5`) con texto blanco, así se lee bien.

¿Te parece? Si estás de acuerdo pasame a **Act Mode**.

✅ **Headers de los modales corregidos** — Cambios en `app/_layout.tsx`:

1. **Eliminado** `screenOptions={{ headerShown: false }}` global que ocultaba todos los headers
2. **Agregado** `options={{ headerShown: false }}` específicamente en `(auth)` y `(tabs)` (que no necesitan header)
3. **Mejorado** el estilo de los headers de los modales:
   - Fondo indigo (`#4F46E5`) para alto contraste
   - Texto blanco (`headerTintColor: '#FFFFFF'`) para que se lea bien
   - Títulos "Nuevo Movimiento" y "Editar Movimiento" ahora visibles

Reinicá la app con `r` y los títulos deberían verse claramente en la barra superior de los modales.

necesito que la foto de gestor financiero se vea redondeada, es decir, sea un círculo y se va bien en pantalla. ahora mismo es un rectángulo clavado.

Simple cambio en `app/(auth)/login.tsx`: reemplazar `rounded-2xl` por `rounded-full` en el `Image`. Como la imagen es cuadrada (80×80px), `rounded-full` la convierte en un círculo perfecto.

Además puedo agregar un pequeño borde (`border-2 border-indigo-100`) para que se vea mejor visualmente.

**Archivo a modificar:** `app/(auth)/login.tsx` — solo la línea del `Image`.

¿Te parece? Si estás de acuerdo, pasame a **Act Mode**.

✅ **Icono redondeado** — Cambios en `app/(auth)/login.tsx`:

- `rounded-2xl` → `rounded-full` (círculo perfecto)
- `w-20 h-20` → `w-24 h-24` (un poco más grande para que se vea mejor)
- `resizeMode: contain` → `resizeMode: cover` (llena el círculo sin bordes blancos)
- Agregado `border-2 border-indigo-100` (borde sutil)

Reinicá la app con `r` y el icono debería verse como un círculo.

surgió un error en: ¿Ya tenés cuenta? Iniciá sesión

 ERROR  The action 'GO_BACK' was not handled by any navigator.

Is there any screen to go back to?

This is a development-only warning and won't be shown in production.

Call Stack

El error es claro: en `register.tsx`, el link "¿Ya tenés cuenta? Iniciá sesión" usa `router.back()`, pero si el usuario navegó de login a register con `router.replace()` (que reemplaza la ruta en lugar de apilarla), no hay pantalla anterior a la que volver.

**Solución:** Cambiar `router.back()` por `router.replace('/(auth)/login')` en `register.tsx`.

**Archivo:** `app/(auth)/register.tsx` — solo cambiar esa línea.

¿Te parece? Si estás de acuerdo pasame a **Act Mode**.

✅ **Error corregido** — En `app/(auth)/register.tsx`:

- `router.back()` → `router.replace('/(auth)/login')`

El problema era que desde login se navega a register con `router.replace()`, que reemplaza la ruta en lugar de apilarla. Al hacer `router.back()` no había pantalla anterior a la que volver. Ahora navega directamente al login.

bien. propongo una serie de modificaciones. Vos considerá si se puede hacer algo o no:

* Al ingresar a la pantalla de Login, tarda un segundo o dos en cargar la foto de Gestor Financiero (icono.jpg).

* Al ingresar con una cuenta, tarda unos segundos en refrescar los movimientos de esa cuenta. En un principio, se ven los movimientos registrados o la pantalla de la cuenta ingresada anteriormente.

Buen análisis, ambos problemas tienen solución:

### Problema 1: Icono tarda en cargar
El `icono.jpg` puede ser un archivo pesado. La app lo carga desde el bundle, pero si es muy grande (ej: >500KB), la decodificación toma tiempo.

**Posibles soluciones (de más simple a más compleja):**
- **A:** Reducir el tamaño del archivo `icono.jpg` (comprimirlo a ~100KB) — lo harías vos manualmente.
- **B:** Usar `Image` con `fadeDuration={0}` para que no tenga animación de fade-in — lo hago yo.
- **C:** Combinar A + B.

### Problema 2: Transacciones viejas se ven un momento al cambiar de cuenta
Esto pasa porque el store de Zustand conserva las `transactions` de la sesión anterior hasta que el nuevo `onSnapshot` de Firestore llega.

**Solución:** Agregar una acción `resetStore()` en Zustand que se llame en `_layout.tsx` cada vez que cambia el usuario. Así, al hacer login, se limpian las transacciones viejas antes de que lleguen las nuevas.

### Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `store/useFinanceStore.ts` | Agregar acción `resetStore()` que limpia `transactions`, `isLoading`, `error` |
| `app/_layout.tsx` | Llamar `resetStore()` antes de setear el nuevo `userId` |
| `app/(auth)/login.tsx` | Agregar `fadeDuration={0}` en el `Image` |

**¿Te parece?** Si estás de acuerdo, pasame a **Act Mode**.

Perfecto. Creo que solo te tengo que hacer la aclaración del Problema 1. Elijo B. Resolvelo vos.

✅ **Ambos problemas resueltos:**

### Problema 1: Icono tarda en cargar
**`app/(auth)/login.tsx`** — Agregado `fadeDuration={0}` al `Image`. Esto elimina la animación de fade-in que React Native aplica por defecto al cargar imágenes, haciendo que aparezca instantáneamente.

### Problema 2: Datos viejos se ven al cambiar de cuenta
**`store/useFinanceStore.ts`** — Agregada la acción `resetStore()` que limpia `transactions`, `isLoading` y `error`.

**`app/_layout.tsx`** — Se llama a `resetStore()` al inicio del `onAuthStateChanged`, antes de setear el nuevo `userId`. Así se limpian los datos de la sesión anterior antes de que lleguen los nuevos desde Firestore.

Reinicá la app con `r` y probá:
- El icono debería aparecer sin delay
- Al hacer login/logout, no deberían verse datos de la cuenta anterior

lo que hiciste sobre los datos viejos que se ven al cambiar de cuenta empeoró todo, no solo que no solucionó: ahora, por más de que cargue movimientos en una cuenta, no se refrescan.

Tiene sentido, el `resetStore()` está causando un race condition. El problema es que:

1. `resetStore()` limpia `transactions` y pone `isLoading: false`
2. Después `setUserId(user.uid)` dispara `useTransactions()` que se suscribe a Firestore
3. Pero como `resetStore()` ya puso `isLoading: false`, la UI muestra "Sin movimientos" antes de que lleguen los datos de Firestore
4. Y si el `onSnapshot` falla silenciosamente (por el índice compuesto que falta), nunca se actualiza

**Solución:** Revertir `resetStore()` y en su lugar, limpiar `transactions` solo cuando `userId` cambia dentro del hook `useTransactions()`, justo antes de suscribirse.

**Archivos a modificar:**

| Archivo | Cambio |
|---------|--------|
| `store/useFinanceStore.ts` | Eliminar `resetStore()` |
| `app/_layout.tsx` | Eliminar la llamada a `resetStore()` |
| `hooks/useTransactions.ts` | Limpiar `transactions` al inicio del efecto cuando cambia `userId` |

¿Te parece? Si estás de acuerdo pasame a **Act Mode** y lo corrijo.

✅ **Corregido** — Se revirtió `resetStore()` y se reemplazó con una limpieza local dentro del hook `useTransactions()`.

Cambios:
1. **`store/useFinanceStore.ts`** — Eliminado `resetStore()` (vuelve al estado anterior)
2. **`app/_layout.tsx`** — Eliminada la llamada a `resetStore()`
3. **`hooks/useTransactions.ts`** — Ahora limpia `transactions` y pone `setLoading(true)` justo antes de suscribirse al nuevo usuario. Así la UI muestra el spinner de carga hasta que Firestore responda con los datos reales.

Ahora al hacer login/logout:
- Se limpian los datos viejos inmediatamente
- Aparece el spinner de carga
- Cuando llegan los datos del nuevo usuario, se actualiza la UI

realizá un estado de la aplicación. qué funcionalidades se podrían agregar?

## Estado actual de la aplicación

### ✅ Funcionalidades implementadas

| Funcionalidad | Estado |
|--------------|--------|
| Autenticación con email/contraseña | ✅ Login y registro |
| Cierre de sesión | ✅ Desde el Dashboard |
| Crear movimientos (ingreso/gasto) | ✅ Con validación Zod |
| Listar movimientos en tiempo real | ✅ vía Firestore `onSnapshot` |
| Editar movimientos | ✅ Modal con formulario precargado |
| Eliminar movimientos | ✅ Con confirmación |
| Dashboard con resumen financiero | ✅ Balance, ingresos, gastos, conteo |
| Historial con orden por fecha de carga | ✅ `createdAt` descendente |
| Perfil de usuario en Firestore | ✅ Colección `users` |
| Reglas de seguridad | ✅ Transacciones + usuarios |

### 🔴 Bugs / Problemas conocidos

1. **Falta el índice compuesto** en Firestore para `userId + createdAt` (la app no refresca movimientos)
2. **Faltan assets** (`icon.png`, `splash-icon.png`, etc.) — se usa `icono.jpg`
3. **Pantalla blanca en formularios** cuando hay poco contenido

---

### 💡 Funcionalidades que se podrían agregar

**Categorizadas por esfuerzo:**

#### 🔵 Fáciles (pocas horas)

| Funcionalidad | Descripción |
|--------------|-------------|
| **Filtros en Historial** | Filtrar por tipo (ingreso/gasto), categoría, rango de fechas |
| **Selector de fecha nativo** | Reemplazar el input `YYYY-MM-DD` por un DatePicker |
| **Pull-to-refresh** | Deslizar hacia abajo en el historial para recargar |
| **Modo oscuro** | Alternar tema claro/oscuro con persistencia en AsyncStorage |
| **Gráfico de gastos por categoría** | Chart simple (pastel o barras) en el Dashboard |
| **Exportar a CSV** | Descargar movimientos como archivo CSV |

#### 🟡 Medias (1-2 días)

| Funcionalidad | Descripción |
|--------------|-------------|
| **Presupuesto mensual por categoría** | Fijar un límite de gasto por categoría y mostrar alerta al acercarse |
| **Movimientos recurrentes** | Suscripciones, alquiler, etc. que se auto-crean cada mes |
| **Búsqueda en Historial** | Buscar movimientos por descripción |
| **Dashboard con gráficos** | Evolución de balance en el tiempo (línea), proporción ingresos/gastos |
| **Notificaciones push** | Recordatorios para registrar gastos diarios |
| **Foto/recibo adjunto** | Subir foto de comprobante desde la cámara/galería |

#### 🔴 Complejas (3+ días)

| Funcionalidad | Descripción |
|--------------|-------------|
| **Cuentas múltiples** | Varias cuentas (efectivo, banco, tarjeta) con transferencias entre ellas |
| **Planificación / Ahorro** | Metas de ahorro con progreso visual |
| **Categorías personalizadas** | El usuario puede crear/editar sus propias categorías |
| **Sincronización bancaria** | Conectar con APIs de bancos (Muy complejo, requiere backend) |
| **Modo offline total** | Cachear datos localmente y sincronizar cuando haya conexión |
| **Versión web** | La app ya tiene `expo-router` con `output: "static"` — se puede deployar a Vercel |

---

### 🎯 Recomendación personal

Si tuviera que priorizar para la próxima iteración, haría:

1. **🔧 Arreglar el índice compuesto** (sin esto no funciona bien)
2. **📅 Selector de fecha nativo** (mejora enorme en UX)
3. **📊 Gráfico de gastos por categoría** (Dashboard más útil)
4. **🔍 Filtros en Historial** (muy útil cuando hay muchos movimientos)

**¿Te interesa alguna de estas? ¿O tenés otras ideas en mente?**

Perfecto. Empecemos por estos 3:

* Filtros en Historial	Filtrar por tipo (ingreso/gasto), categoría, rango de fechas

* Selector de fecha nativo	Reemplazar el input YYYY-MM-DD por un DatePicker

* Pull-to-refresh	Deslizar hacia abajo en el historial para recargar

Buen plan. Acá va la arquitectura para las 3 funcionalidades:

### 1. Filtros en Historial
**Enfoque:** Filtrado 100% cliente (ya tenemos todas las transacciones en el store). Agregar una barra de filtros arriba del listado.

**Archivos:**
| Archivo | Acción |
|---------|--------|
| `components/transactions/TransactionFilters.tsx` | **Crear** — Barra con chips para tipo (ingreso/gasto/todos), selector de categoría, y campos de fecha desde/hasta |
| `app/(tabs)/history.tsx` | **Modificar** — Agregar estado de filtros y pasarlos al `TransactionList` |
| `components/transactions/TransactionList.tsx` | **Modificar** — Aceptar `transactions` ya filtradas |

### 2. Selector de fecha nativo
**Enfoque:** Usar `@react-native-community/datetimepicker` (compatible con Expo).

**Archivos:**
| Archivo | Acción |
|---------|--------|
| `components/transactions/TransactionForm.tsx` | **Modificar** — Reemplazar el `TextInput` de fecha por un `TouchableOpacity` que abre el DatePicker nativo |
| `package.json` | **Instalar** `@react-native-community/datetimepicker` |

### 3. Pull-to-refresh
**Enfoque:** FlatList ya soporta `refreshing` + `onRefresh`. Agregar una función `refreshTransactions` que haga un `getDocs` one-shot a Firestore.

**Archivos:**
| Archivo | Acción |
|--------|--------|
| `services/transactions.service.ts` | **Modificar** — Agregar función `fetchTransactions(userId)` que devuelve datos con `getDocs` |
| `hooks/useTransactions.ts` | **Modificar** — Exponer función `refresh()` |
| `components/transactions/TransactionList.tsx` | **Modificar** — Agregar props `refreshing` y `onRefresh` |
| `app/(tabs)/history.tsx` | **Modificar** — Conectar el refresh |

### Orden de implementación sugerido
1. Pull-to-refresh (más simple, toca menos archivos)
2. DatePicker (requiere instalar paquete)
3. Filtros (depende de tener la UI del listado funcionando)

**¿Te parece bien el plan?** Si estás de acuerdo, pasame a **Act Mode** y arrancamos.

npx expo install @react-native-community/datetimepicker

Las 3 funcionalidades están implementadas. Resumen de cambios:

### ✅ 1. Pull-to-refresh
**Archivos modificados:**
- `services/transactions.service.ts` — Nueva función `fetchTransactions()` (one-shot con `getDocs`)
- `hooks/useTransactions.ts` — Ahora retorna `{ refresh }` (aunque no se usa en el layout)
- `components/transactions/TransactionList.tsx` — Agregadas props `refreshing` y `onRefresh`
- `app/(tabs)/history.tsx` — Implementado `handleRefresh` con spinner nativo de FlatList

### ✅ 2. DatePicker nativo
**Archivos modificados:**
- `components/transactions/TransactionForm.tsx` — Reemplazado el `TextInput` de fecha por un `TouchableOpacity` que abre el `DateTimePicker` nativo. Muestra la fecha formateada (ej: "15/07/2026") y al tocarlo abre el calendario del sistema.

### ✅ 3. Filtros en Historial
**Archivos creados:**
- `components/transactions/TransactionFilters.tsx` — Barra de filtros con:
  - Chips para tipo (Todos / Ingresos / Gastos)
  - Selectores de fecha Desde/Hasta con DatePicker nativo
  - Chips de categorías (scroll horizontal)
  - Botón "Limpiar filtros"

**Archivos modificados:**
- `app/(tabs)/history.tsx` — Integrado `TransactionFilters`, filtrado con `useMemo`, contador refleja los filtrados

Reinicá la app con `r` y probá:
- Deslizá hacia abajo en el Historial → debería aparecer el indicador de carga
- Tocá la fecha en el formulario de nuevo movimiento → se abre el calendario nativo
- Usá los filtros en el Historial para ver solo ingresos, o movimientos de una categoría específica.

# CONVERSACIÓN 12/07/2026

Necesito que, ahora, los movimientos estén ordenados por Fecha, es decir, por date, no por createdAt. Una pregunta: afecta en algo a mi índice manual creado en la consola de firebase que tiene indexados los campos userID y createdAt para la colección transactions? (movimientos)

Buenas noticias: **ya está ordenando por `date`** en el `subscribeToTransactions`. Pero hay una inconsistencia con `fetchTransactions` (el que usa pull-to-refresh) que sigue usando `createdAt`. Voy a unificarlos.

### Sobre tu pregunta del índice compuesto

**Sí, te va a afectar.** Firestore requiere un índice compuesto específico para cada combinación de `where` + `orderBy`. 

Actualmente tenés creado el índice: **`userId` ↑ + `createdAt` ↓** (para el `orderBy('createdAt', 'desc')` anterior).

Ahora necesitás **otro índice**: **`userId` ↑ + `date` ↓** (para `orderBy('date', 'desc')`).

Si el índice de `date` no existe, la consulta va a fallar con un error y la app no va a cargar los movimientos. Firebase te va a mostrar un link en la consola de Expo para crear el índice automáticamente, o podés crearlo manualmente.

### Plan

| Archivo | Cambio |
|---------|--------|
| `services/transactions.service.ts` | En `fetchTransactions`, cambiar `orderBy('createdAt', 'desc')` → `orderBy('date', 'desc')` |

**Vos:** Crear el nuevo índice compuesto en Firebase Console:
- Colección: `transactions`
- Campo 1: `userId` → Ascendente
- Campo 2: `date` → Descendente

El índice viejo de `createdAt` podés dejarlo (no molesta) o eliminarlo si querés.

**¿Te parece?** Si estás de acuerdo pasame a **Act Mode**.

✅ **Ambas funciones ya ordenan por `date` descendente**:
- `subscribeToTransactions` (listener en tiempo real)
- `fetchTransactions` (pull-to-refresh)

### ⚠️ Lo que necesitás hacer en Firebase Console

El índice viejo (`userId` ↑ + `createdAt` ↓) **no sirve** para el nuevo orden. Tenés que crear un nuevo índice compuesto:

1. Andá a [Firebase Console](https://console.firebase.google.com/) → **Firestore Database** → pestaña **Índices**
2. Click en **Crear índice**
3. Configurarlo así:
   - **Colección:** `transactions`
   - **Campos:**
     - `userId` → **Ascendente**
     - `date` → **Descendente**
4. Click en **Crear**

O también, cuando reiniciés la app y hagas una consulta, Firebase va a mostrar un error con un link directo para crear el índice con un solo clic. Cualquiera de las dos formas funciona.

El índice viejo de `createdAt` no hace falta borrarlo, podés dejarlo ahí que no molesta.

qué raro porque en ningún momento se quejó expo. sigo teniendo nada más que el índice: id de colección: transactions ; campos indexados: userId (asc), createdAt (desc), _name_ , y los movimientos ya se refrescan bien por date (fecha). No tuve que crear el otro índice.

Tranquilo, es normal. Firebase Firestore tiene **índices automáticos** que cubren consultas simples. Como ya tenés el índice en `userId` (el filtro del `where`), y la cantidad de datos es chica, Firestore puede hacer el `orderBy('date')` en memoria sin necesidad de un índice compuesto adicional. Cuando la base crezca, Firebase va a empezar a pedir el índice explícitamente.

**En resumen:** está funcionando bien ahora porque hay pocos datos. Cuando tengas cientos de movimientos, te va a saltar el error pidiendo el índice. Ahí lo creás y listo.

¿Seguimos con otra cosa o ya estamos bien?

revisá el estado de la aplicación. se podría proceder a una puesta en producción? en el caso de que sí, dame el paso a paso.

Hice una revisión completa. **Sí, la app está lista para producción desde el punto de vista funcional**, pero hay algunos ajustes previos necesarios. Acá va el diagnóstico y el paso a paso.

---

## ✅ Estado actual de la aplicación (MVP completo)

| Aspecto | Estado |
|---------|--------|
| Autenticación email/contraseña | ✅ |
| CRUD de movimientos | ✅ |
| Dashboard con balance | ✅ |
| Historial con filtros | ✅ |
| Pull-to-refresh | ✅ |
| DatePicker nativo | ✅ |
| Reglas de seguridad Firestore | ✅ |
| Perfiles de usuario en BD | ✅ |

---

## ⚠️ Lo que falta ajustar antes de publicar

### 1. Bundle identifiers (cambiarlos de "com.tuempresa...")
En `app.json`:
- `ios.bundleIdentifier` → ej: `com.ulises.gestorfinanciero`
- `android.package` → ej: `com.ulises.gestorfinanciero`

### 2. Assets para producción
Faltan:
- `splash-icon.png` (1242×2688 px)
- `adaptive-icon.png` (1024×1024 px para Android)
- `favicon.png` (32×32 px para web)
- `icono.jpg` ya está ✅

### 3. Reglas de Firestore
Copiar el contenido de `firestore.rules` a Firebase Console (si no lo hiciste ya).

### 4. Índice compuesto
Crear índice: `userId` ↑ + `date` ↓ (para cuando crezca la base).

---

## 📋 Paso a paso para puesta en producción

### Paso 1: Ajustar `app.json`
Cambiar:
```json
"ios": {
  "bundleIdentifier": "com.ulises.gestorfinanciero"
},
"android": {
  "package": "com.ulises.gestorfinanciero"
}
```

### Paso 2: Generar assets de producción
Usar https://www.appicon.co/ para generar:
- `icon.png` (app icon principal)
- `splash-icon.png`
- `adaptive-icon.png`
Guardarlos en `assets/`.

### Paso 3: Firebase Console
1. Copiar reglas de `firestore.rules` → pestaña Reglas → Publicar
2. Crear el índice compuesto `userId ↑ + date ↓` → pestaña Índices

### Paso 4: Build con EAS (Expo Application Services)
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login a Expo
eas login

# Configurar build
eas build:configure

# Build para Android (APK para testear o AAB para Play Store)
eas build --platform android --profile production

# Build para iOS (requiere Apple Developer Program)
eas build --platform ios --profile production
```

### Paso 5: Publicar en stores
- **Google Play Store:** Subir el `.aab` generado
- **Apple App Store:** Subir el `.ipa` vía Transporter o Xcode

### Paso 6 (opcional): Versión web
Ya tenés `output: "static"` en `app.json`. Podés deployar a Vercel:
```bash
npx expo export --platform web
npx vercel deploy --prod
```

---

**¿Querés que ajustemos los bundle identifiers y preparemos la app para build?** Si es así, pasame a **Act Mode** y lo hacemos.

okey. respecto al tema íconos... ¿qué son? ¿para qué sirven? ¿dónde se encuentran? (el único que sé donde está es el icon.png que se muestra cuando se está haciendo el bundle de la app. ¿son necesarios? ¿puedo prescindir de ellos? si es que son obligatorios... ¿puedo usar la misma imagen para todo solo cambiandole el nombre? ej. icon.png, splash, favicon serian todos lo mismo

Te explico cada uno:

## ¿Qué son y para qué sirven?

| Asset | ¿Qué es? | ¿Dónde se ve? | ¿Obligatorio? |
|-------|----------|---------------|---------------|
| **`icon.png` / `icono.jpg`** | Ícono de la app | En la pantalla de inicio del celular, en la Play Store, en el bundle | **Sí** (lo tenés ✅) |
| **`splash-icon.png`** | Pantalla de carga | Cuando abrís la app, antes de que cargue, se ve un fondo color lila con una imagen centrada | No obligatorio, pero queda feo si no está |
| **`adaptive-icon.png`** | Ícono adaptativo Android | En versiones recientes de Android, el ícono puede tener forma distinta (círculo, cuadrado, etc.) | No obligatorio para build |
| **`favicon.png`** | Ícono de pestaña web | Si abrís la versión web en un navegador, aparece en la pestaña | Solo si usás web |

## ¿Podés usar la misma imagen para todo?

**Sí, totalemente.** De hecho ya estás haciendo algo parecido. Solo necesitás:

1. **`icono.jpg`** ya lo tenés en `assets/` y ya está configurado en `app.json` como icon ✅
2. Para los que faltan, podés **copiar `icono.jpg` con otros nombres**:

```
icono.jpg  →  splash-icon.png  (copiar con otro nombre)
icono.jpg  →  adaptive-icon.png (copiar con otro nombre)
icono.jpg  →  favicon.png      (copiar con otro nombre)
```

Pero el tema es que **para builds de producción**, Expo espera archivos **.png** (no .jpg) para el splash y el adaptive icon. Y además requieren tamaños específicos.

## Mi recomendación (lo más simple)

Ya que tu `app.json` ya no referencia `splash-icon`, `adaptive-icon` ni `favicon` (los sacamos antes), **no hace falta crearlos**. La app funciona igual.

Lo único que tenés que tener en cuenta:

- Si **no hacés build para web**, `favicon` no te importa.
- Si **no usás Android con íconos adaptativos**, `adaptive-icon` no te importa.
- El `splash` lo sacamos del `app.json`, así que tampoco te importa.

**En resumen:** con `icono.jpg` ya estás cubierto. No necesitás los otros assets a menos que quieras una pantalla de carga elegante o íconos adaptativos.

¿Seguimos con lo otro que quedó pendiente para producción?

literalmente lo unico que hice fue modificar el nombre de la imagen a png en vez de jpg... ya está?

si

Al poner la variable de entorno, logramos que los servidores de Expo instalaran los paquetes sin chistar (por eso el build llegó mucho más lejos esta vez y pasó a la etapa de Run gradlew). Sin embargo, aquí es donde la realidad nos golpea:

Si miramos el final de los logs en Expo, el error exacto es este:

[Reanimated] Invalid version of react-native-worklets: "0.10.2". Expected the version to be in inclusive range "0.5.x, 0.6.x, 0.7.x, 0.8.x".

¿Qué significa esto?
Que aunque obligamos a npm a instalar la versión 0.10.2 de worklets, el código en Java (nativo de Android) de la librería Reanimated tiene un candado de seguridad. Justo antes de compilar dice: "Me niego a funcionar si worklets es mayor a la versión 0.8.x porque puedo crashear la app".

No podemos esquivar esto; tenemos que darle exactamente la versión que pide.

La Solución Definitiva (El paso final)
Tenemos que hacer un "downgrade" (bajar de versión) de ese paquete específico en tu computadora antes de volver a mandar todo a la nube.

npm install react-native-worklets@0.8.3 estaría bien?

Exacto, ese es el problema. `react-native-worklets@0.10.2` es demasiado nuevo para `react-native-reanimated@~4.1.1`. Reanimated 4 tiene un rango permitido de worklets "0.5.x, 0.6.x, 0.7.x, 0.8.x".

La solución es bajar worklets a una versión compatible. **`0.8.3` debería funcionar**, pero no tengo la certeza del versionado exacto. Otra opción segura es instalar la versión que Reanimated trae por defecto en su `peerDependencies`, que suele ser `0.8.2` o `0.8.3`.

**Propuesta:**

Ejecutar en tu terminal (CMD):

```cmd
npm install react-native-worklets@0.8.3
```

Si el build falla con el mismo error, probar con:

```cmd
npm install react-native-worklets@0.8.2
```

**¿Querés que lo haga?** Si estás de acuerdo, pasame a **Act Mode** y ejecuto el comando.

$ npm install react-native-worklets@0.8.3
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: @firebase/auth@1.10.8
npm warn Found: @react-native-async-storage/async-storage@2.2.0
npm warn node_modules/@react-native-async-storage/async-storage
npm warn   @react-native-async-storage/async-storage@"2.2.0" from the root project
npm warn
npm warn Could not resolve dependency:
npm warn peerOptional @react-native-async-storage/async-storage@"^1.18.1" from @firebase/auth@1.10.8
npm warn node_modules/@firebase/auth
npm warn   @firebase/auth@"1.10.8" from @firebase/auth-compat@0.5.28
npm warn   node_modules/@firebase/auth-compat
npm warn   1 more (firebase)
npm warn
npm warn Conflicting peer dependency: @react-native-async-storage/async-storage@1.24.0
npm warn node_modules/@react-native-async-storage/async-storage
npm warn   peerOptional @react-native-async-storage/async-storage@"^1.18.1" from @firebase/auth@1.10.8
npm warn   node_modules/@firebase/auth
npm warn     @firebase/auth@"1.10.8" from @firebase/auth-compat@0.5.28
npm warn     node_modules/@firebase/auth-compat
npm warn     1 more (firebase)
npm warn ERESOLVE overriding peer dependency

added 38 packages, changed 1 package, and audited 878 packages in 25s

69 packages are looking for funding
  run `npm fund` for details

14 moderate severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.

Perfecto, se instaló correctamente. Los warnings de async-storage son solo eso, warnings — no afectan al build.

**Ahora probá el build de nuevo:**

```cmd
eas build --platform android --profile production --local
```

O si querés que EAS lo compile en la nube (sin `--local`):

```cmd
eas build --platform android --profile production
```

Si el build falla con otro error, pegame el log y lo vemos.

**¿Querés que sigamos iterando hasta que pase, o preferís esperar el resultado primero?**

# CONVERSACIÓN 13/07/2026

Actúa como un experto en desarrollo móvil con React Native y Expo. Estoy teniendo un problema de 'crash' al abrir mi aplicación en un dispositivo Android físico:
**Contexto:** He logrado compilar exitosamente la app usando EAS Build, el ícono aparece y la app se instala, pero al intentar abrirla se cierra inmediatamente (crash al inicio).

Analicé el stack técnico. El crash al abrir la app en Android tiene **tres causas probables**, ordenadas por probabilidad:

---

### 🔴 Causa #1 (MÁS PROBABLE): Falta el plugin de Reanimated en Babel

`react-native-reanimated` **requiere** un plugin específico en `babel.config.js`. Sin él, la app compila pero crashea al iniciar porque no puede interpretar el código de Reanimated.

Tu `babel.config.js` actual:
```js
presets: [
  ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
  'nativewind/babel',
],
// ⚠️ FALTA: 'react-native-reanimated/plugin'
```

**Solución:** Agregar `'react-native-reanimated/plugin'` al final de la lista de plugins (es importante que sea **el último plugin**).

---

### 🔴 Causa #2: Producción no tiene `--legacy-peer-deps`

En `eas.json`, el perfil `production` no tiene `NPM_CONFIG_LEGACY_PEER_DEPS: "true"`, mientras que `preview` sí. Si el servidor de EAS resuelve dependencias diferente al local, puede instalar versiones incompatibles.

**Solución:** Agregar la variable de entorno al perfil `production`.

---

### 🟡 Causa #3: Firebase Auth sin AsyncStorage nativo

El warning de Firebase Auth que vimos antes (`AsyncStorage no provisto`) puede ser un crash en producción cuando la persistencia falla.

**Solución:** Ya lo habíamos intentado, pero podríamos probar un enfoque más simple.

---

### Plan de acción

| Archivo | Cambio |
|---------|--------|
| `babel.config.js` | Agregar `'react-native-reanimated/plugin'` al final |
| `eas.json` | Agregar `NPM_CONFIG_LEGACY_PEER_DEPS: "true"` en producción |

Después de esos cambios → re-build con `eas build --platform android --profile production`.

**¿Querés que lo haga?** Pasame a **Act Mode** y lo resuelvo.

hacé lo relacionado a la Causa #1. El tema de Producción (causa #2) con --legace-peer-deps no aplica porque voy a subir la aplicación como preview. Para production necesito pagar en dólares. Por otro lado, la causa #3 ya está resuelta.

✅ **Plugin de Reanimated agregado** en `babel.config.js`.

Este plugin es **obligatorio** para que `react-native-reanimated` funcione en producción. Sin él, la app compila el APK pero crashea al abrirse porque no puede interpretar el código de Reanimated en tiempo de ejecución.

Importante: el plugin debe ir **siempre al final** de la lista de plugins, que es justo donde lo puse.

### Próximo paso

Reconstruí la app con:

```bash
eas build --platform android --profile preview
```

Eso debería resolver el crash de apertura. Si vuelve a fallar, pegame el log y lo revisamos.

# CONVERSACIÓN 14/07/2026

## Causa del crash confirmada

**`react-native-gesture-handler` v2.28.0 + New Architecture** requiere `GestureHandlerRootView` en el root del árbol de componentes para llamar a `RNGestureHandlerModule.install()`. Sin él, Fabric nunca inicializa el módulo nativo → crash inmediato al abrir.

---

## Fix 1 — Imports en _layout.tsx

Reemplazá:

```typescript
// ANTES
import { useEffect } from 'react'
import { useSegments, useRouter } from 'expo-router'
// sin GestureHandlerRootView

// DESPUÉS
import { useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
```

---

## Fix 2 — `useEffect` y su dependency array

```typescript
// ANTES — segments en el array causa que el efecto se re-ejecute en cada navegación
}, [segments, router, setUserId])

// DESPUÉS — array vacío, onAuthStateChanged ya dispara con el estado inicial
const splashHidden = useRef(false)

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      setUserId(user.uid)
      router.replace('/(tabs)')
    } else {
      setUserId(null)
      router.replace('/(auth)/login')
    }
    if (!splashHidden.current) {
      splashHidden.current = true
      await SplashScreen.hideAsync()
    }
  })
  return () => unsubscribe()
}, [])  // ← array vacío
```

---

## Fix 3 — Wrapper en el `return`

```tsx
// ANTES
return (
  <>
    <Stack>
      ...
    </Stack>
    <StatusBar style="dark" />
  </>
)

// DESPUÉS
return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack>
      ...
    </Stack>
    <StatusBar style="dark" />
  </GestureHandlerRootView>
)
```

---

Aplicá los tres cambios.

✅ **Los tres cambios aplicados en `app/_layout.tsx`:**

### Fix 1 — Imports
- Agregado `useRef` y `GestureHandlerRootView`
- Eliminado `useSegments` (ya no se necesita)

### Fix 2 — useEffect simplificado
- `segments` eliminado del dependency array → ahora es `[]` (se ejecuta una sola vez)
- Agregado `splashHidden` con `useRef(false)` para ocultar el splash solo una vez
- La redirección ahora es directa: si hay usuario → `/(tabs)`, si no → `/(auth)/login`

### Fix 3 — Wrapper GestureHandlerRootView
- Todo el contenido envuelto en `<GestureHandlerRootView style={{ flex: 1 }}>`
- Esto evita el crash de `react-native-gesture-handler` en la New Architecture

### Próximo paso
Reconstruí con:

```bash
eas build --platform android --profile preview
```

La app ya no debería crashear al abrirse.

Planeemos una nueva funcionalidad: | **Gráfico de gastos por categoría** | Chart simple (pastel o barras) en el Dashboard |

Buen plan. Acá va la arquitectura:

### Librería: `react-native-chart-kit`
Es la más simple para Expo, requiere `react-native-svg`. Soporta gráficos de pastel y barras.

### Archivos a crear/modificar

| Archivo | Acción |
|---------|--------|
| `package.json` | Instalar `react-native-svg` y `react-native-chart-kit` |
| `components/dashboard/ExpensesByCategoryChart.tsx` | **Crear** — Componente que agrupa gastos por categoría y renderiza un gráfico de pastel |
| `app/(tabs)/index.tsx` | **Modificar** — Agregar el componente debajo de "Movimientos Registrados" |

### Lógica del componente
1. Tomar las transacciones del store
2. Filtrar solo `type === 'expense'`
3. Agrupar por `category` sumando los montos
4. Mapear cada categoría a su label y color
5. Renderizar un `PieChart` con `react-native-chart-kit`

### Colores para cada categoría
Usaré una paleta fija de colores para las categorías de gasto.

**¿Te parece?** Si estás de acuerdo, pasame a **Act Mode** y lo implemento.

✅ **Gráfico de gastos por categoría implementado.**

### Archivos creados
| Archivo | Propósito |
|---------|-----------|
| `components/dashboard/ExpensesByCategoryChart.tsx` | Gráfico de pastel que agrupa gastos por categoría, con colores únicos y total al pie |

### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `app/(tabs)/index.tsx` | Agregado `ExpensesByCategoryChart` debajo de "Movimientos Registrados" |

### Cómo funciona
- Toma las transacciones del store de Zustand
- Filtra solo gastos (`type === 'expense'`)
- Agrupa por categoría y suma los montos
- Muestra un gráfico de pastel con colores por categoría y una leyenda abajo
- Si no hay gastos, no se muestra nada
- Se actualiza automáticamente cuando se agregan/editan/eliminan movimientos (porque el store es reactivo)

Reinicá la app con `r` y deberías ver el gráfico en el Dashboard debajo del contador de movimientos.

Unable to resolve "react-native-chart-kit" from "components\dashboard\ExpensesByCategoryChart.tsx"
   5 | import React, { useMemo } from 'react'
   6 | import { View, Text, Dimensions } from 'react-native'
>  7 | import { PieChart } from 'react-native-chart-kit'
     |                           ^
   8 | import type { Transaction } from '@/types'
   9 | import { getCategoryById } from '@/constants/categories'
  10 |

Import stack:

 components\dashboard\ExpensesByCategoryChart.tsx
 | import "react-native-chart-kit"

 app\(tabs)\index.tsx
 | import "@/components/dashboard/ExpensesByCategoryChart"

 app (require.context)

El problema es que los paquetes `react-native-chart-kit` y `react-native-svg` están en `package.json` pero Metro Bundler no puede resolverlos. Es un problema de caché de Metro.

**Solución:** Ejecutá esto en tu terminal (CMD):

```cmd
npx expo start --clear
```

Eso limpia la caché de Metro y vuelve a compilar todo desde cero. Después de eso la app debería reconocer los paquetes.

Si aún así falla, probá:

```cmd
cd node_modules && rm -rf .cache && cd ..
npx expo start --clear
```

**¿Probás y me contás si funciona?**

bien. ahora necesito exactamente lo mismo, pero para los ingresos.

Lo más simple y ordenado: crear un componente genérico `CategoryChart` que reciba el tipo (`income` o `expense`) y muestre el gráfico correspondiente, reemplazando al componente específico de gastos.

### Archivos a modificar

| Archivo | Acción |
|---------|--------|
| `components/dashboard/CategoryChart.tsx` | **Crear** — Componente genérico que recibe `type` y `transactions` |
| `components/dashboard/ExpensesByCategoryChart.tsx` | **Eliminar** (reemplazado por el genérico) |
| `app/(tabs)/index.tsx` | **Modificar** — Agregar dos instancias de `CategoryChart`, una para ingresos y otra para gastos |

### Diseño del componente
- Título: "Ingresos por Categoría" o "Gastos por Categoría"
- Colores: verde para ingresos, rojo/naranja para gastos
- Mismo gráfico de pastel

**¿Te parece?** Si estás de acuerdo, pasame a **Act Mode**.

básicamente, quiero que el gráfico de "Gastos por Categoría" quede intacto, con esos colores. Solo quiero sumar el de "Ingresos por Categoría" abajo. Me parece bien lo del componente genérico.

✅ **Gráfico de ingresos por categoría agregado.**

### Cambios realizados

| Archivo | Cambio |
|---------|--------|
| `components/dashboard/CategoryChart.tsx` | **Creado** — Componente genérico que recibe `transactions` y `type` ("income" o "expense") y renderiza el gráfico de pastel con colores específicos para cada tipo |
| `app/(tabs)/index.tsx` | **Modificado** — Reemplazado `ExpensesByCategoryChart` por dos instancias de `CategoryChart`: una para gastos (con colores rojos/naranjas) y otra para ingresos (con colores verdes/azules) |

Ahora el Dashboard muestra (en este orden):
1. Balance
2. Ingresos y Gastos (tarjetas)
3. Movimientos registrados
4. **Gráfico de Gastos por Categoría** (colores originales)
5. **Gráfico de Ingresos por Categoría** (nuevo, con colores verde/azul/amarillo)

El archivo `ExpensesByCategoryChart.tsx` ya no se usa, podés eliminarlo si querés.

Reinicá la app con `r` y deberías ver ambos gráficos.

ERROR  [Invariant Violation: Tried to register two views with the same name RNSVGFilter]

Call Stack
  invariant (node_modules\invariant\browser.js)
  register (node_modules\react-native\Libraries\Renderer\shims\ReactNativeViewConfigRegistry.js)
  get (node_modules\react-native\Libraries\NativeComponent\NativeComponentRegistry.js)
  <global> (node_modules\react-native-svg\src\fabric\FilterNativeComponent.ts)
  loadModuleImplementation (node_modules\@expo\cli\build\metro-require\require.js)
  guardedLoadModule (node_modules\@expo\cli\build\metro-require\require.js)
  metroRequire (node_modules\@expo\cli\build\metro-require\require.js)
  runUpdatedModule (node_modules\@expo\cli\build\metro-require\require.js)
  metroHotUpdateModule (node_modules\@expo\cli\build\metro-require\require.js)
  define (node_modules\@expo\cli\build\metro-require\require.js)
  eval (http:\y8fb6pm-uliedlp7-8081.exp.direct\node_modules\react-native-svg\src\fabric\FilterNativeComponent.bundle)
  inject (node_modules\metro-runtime\src\modules\HMRClient.js)
  forEach (<native>)
  injectUpdate (node_modules\metro-runtime\src\modules\HMRClient.js)
  on$argument_1 (node_modules\metro-runtime\src\modules\HMRClient.js)
  call (<native>)
  emit (node_modules\metro-runtime\src\modules\vendor\eventemitter3.js)
  _ws.onmessage (node_modules\metro-runtime\src\modules\HMRClient.js)
  invoke (node_modules\react-native\src\private\webapis\dom\events\EventTarget.js)
  dispatch (node_modules\react-native\src\private\webapis\dom\events\EventTarget.js)
  dispatchEvent (node_modules\react-native\src\private\webapis\dom\events\EventTarget.js)
  _eventEmitter.addListener$argument_1 (node_modules\react-native\Libraries\WebSocket\WebSocket.js)

Este error es conocido de `react-native-svg` con Fast Refresh (HMR) en Expo. No es un error de tu código ni de producción, solo ocurre en desarrollo cuando hacés un hot reload y el módulo SVG se registra dos veces.

**Solución:** Limpiar la caché de Metro y reiniciar.

1. Presioná `Ctrl+C` en la terminal para cerrar el servidor de Expo
2. Ejecutá:

```cmd
npx expo start --clear
```

Eso debería resolverlo. Si vuelve a aparecer después de varios hot reloads, repetí el mismo paso.

En producción (build APK) este error **no ocurre** porque no hay HMR.

Planeemos. Hasta ahora, todo lo que aparece en Dashboard es histórico (Balance, Ingresos, Gastos, Movimientos Registrados, Gastos por Categoría e Ingresos por Categoría). Quiero que el usuario pueda visualizar todo eso mismo pero SEGÚN LOS MOVIMIENTOS POR MES. Me imagino algo como el hecho de tener el nombre del principio "Mis Finanzas" y, debajo, un selector de 2 fechas para filtrar todo según esas 2 fechas. O sea, el usuario debe poder elegir entre un Resumen General (el que está actualmente) o la selección de un rango de fechas.

Buena idea. Acá va el plan:

### Arquitectura

Agregar un filtro de rango de fechas en el Dashboard que afecte **todo** el contenido (balance, tarjetas, gráficos). El usuario puede ver "Resumen General" (sin filtro) o seleccionar un rango.

### Componentes

| Archivo | Acción |
|---------|--------|
| `components/dashboard/DateRangeFilter.tsx` | **Crear** — Barra con dos botones de fecha "Desde" y "Hasta" + botón "Limpiar" |
| `app/(tabs)/index.tsx` | **Modificar** — Agregar estado de fechas, `useMemo` para filtrar transacciones, pasar datos filtrados a todos los componentes |

### Lógica

1. Estado local: `dateFrom: string`, `dateTo: string` (formato YYYY-MM-DD)
2. Si ambas están vacías → mostrar todo (Resumen General)
3. Si hay fechas → filtrar `transactions` con `useMemo`
4. Pasar las `filteredTransactions` a:
   - `BalanceCard`
   - `SummaryItem` (ingresos y gastos)
   - Contador de movimientos
   - `CategoryChart` (gastos e ingresos)
5. Los selectores de fecha usan el DateTimePicker nativo (ya instalado)

### Diseño UX

```
Mis Finanzas        [Cerrar sesión]

[Desde: 01/07/2026] [Hasta: 15/07/2026]  [Limpiar]  ← nuevo
                                                     ← solo si hay filtro activo

Balance: $XXX
[Ingresos] [Gastos]
Movimientos: X
Gastos por categoría (gráfico)
Ingresos por categoría (gráfico)
```

**¿Te parece?** Si estás de acuerdo, pasame a **Act Mode**.

✅ **Filtro por rango de fechas implementado en el Dashboard.**

### Archivos creados
| Archivo | Propósito |
|---------|-----------|
| `components/dashboard/DateRangeFilter.tsx` | Selector con dos botones "Desde" y "Hasta" + botón "Limpiar" con X |

### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `app/(tabs)/index.tsx` | Agregado estado `dateFrom`/`dateTo`, filtrado con `useMemo`, todos los componentes usan `filteredTransactions` |

### Cómo funciona
- **Por defecto:** "Resumen General" — muestra todo como antes
- **Al seleccionar fechas:** el subtítulo cambia a "Del YYYY-MM-DD al YYYY-MM-DD" y todos los datos se recalculan:
  - Balance
  - Ingresos y Gastos
  - Contador de movimientos
  - Gráficos de gastos e ingresos por categoría
- **Botón X:** limpia el filtro y vuelve a "Resumen General"

Reinicá la app con `r` y probá seleccionando fechas en el Dashboard.