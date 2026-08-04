# Gestor Financiero Personal

Aplicación móvil (**Android** e **iOS**) y **Web** para registrar y controlar ingresos y gastos personales. Incluye movimientos recurrentes automáticos, categorías personalizables, adjuntar comprobantes y exportación a PDF.

---

## Funcionalidades

| Módulo | Descripción |
|--------|-------------|
| **Autenticación** | Registro e inicio de sesión con email/contraseña y **Google Sign-In** (popup en web, nativo en Android/iOS). Perfil persistido en Firestore. |
| **Dashboard** | Balance, total de ingresos, gastos, cantidad de movimientos y **gráficos de torta** por categoría. Filtrable por rango de fechas. |
| **Historial** | Lista completa de movimientos con **filtros** (tipo, categoría, rango de fechas y búsqueda por descripción), edición, eliminación y **exportación a PDF**. |
| **Movimientos recurrentes** | Plantillas que generan movimientos automáticamente con frecuencia diaria, semanal, quincenal, mensual o anual. Pausar/reanudar, fechas de inicio/fin y motor de generación idempotente. |
| **Categorías** | Categorías personalizables por tipo (ingreso/gasto) con nombre, color e ícono. Se precargan categorías default al primer login. Validación de unicidad (nombre/color por tipo). |
| **Comprobantes** | Adjuntar foto del comprobante (cámara o galería en nativo, archivo en web) que se sube a **Cloudinary**. |
| **Recordatorio diario** | Notificación local a las 20:00 (solo nativo) para registrar movimientos del día. |

---

## Stack tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Framework | **React Native + Expo SDK 54** | Desarrollo multiplataforma (Android, iOS, Web) con DX moderna |
| Navegación | **Expo Router v6** | File-based routing, deep linking automático, typed routes |
| Lenguaje | **TypeScript (strict)** | Tipado estático, menor cantidad de bugs en runtime |
| Backend | **Firebase** (Auth + Firestore) | BaaS sin servidor, tiempo real, escalable |
| Estado global | **Zustand** | Mínimo boilerplate, sin providers, selectores puros memoizables |
| Formularios | **React Hook Form** | Componentes no controlados = mejor performance |
| Validaciones | **Zod** | Inferencia de tipos desde el schema, sin duplicar tipos |
| UI | **NativeWind v4** | Utility-first (Tailwind) para React Native, máxima flexibilidad |
| Gráficos | **react-native-chart-kit** | Gráficos de torta para distribución por categoría |
| PDF | **jsPDF + jspdf-autotable** (web) / **expo-print + expo-sharing** (nativo) | Exportación del historial filtrado |
| Fechas | **date-fns** | Cálculo de recurrencias y formateo localizado (es-AR) |
| Notificaciones | **expo-notifications** | Recordatorio diario local (sin push server) |
| Imágenes | **expo-image-picker** + **Cloudinary** | Adjuntar y subir comprobantes |
| Almacenamiento local | **@react-native-async-storage/async-storage** | Preferencias (ej: estado del recordatorio) |

---

## Arquitectura de capas

```
Pantallas (app/)
    ↓
Componentes (components/)
    ↓
Hooks (hooks/)     ←→     Store Zustand (store/)
    ↓
Servicios (services/)     ←→     Firebase (lib/firebase.ts)
```

**Regla principal**: las pantallas no importan Firebase directamente. Todo acceso a datos pasa por los servicios. Los hooks conectan los servicios con el store de Zustand y garantizan la limpieza de los listeners en tiempo real.

---

## Estructura del proyecto

```
gestor-financiero-app/
├── app/                         # Expo Router (file-based routing)
│   ├── _layout.tsx              # Root layout: auth listener, splash, suscripciones RT
│   ├── +not-found.tsx           # Pantalla 404
│   ├── (auth)/                  # Autenticación (sin tab bar)
│   │   ├── _layout.tsx
│   │   ├── login.tsx            # Inicio de sesión (email + Google)
│   │   └── register.tsx         # Registro de cuenta
│   ├── (tabs)/                  # Pestañas principales
│   │   ├── _layout.tsx          # Tab navigation (5 tabs)
│   │   ├── index.tsx            # Dashboard (balance, gráficos, filtro fechas)
│   │   ├── history.tsx          # Historial (filtros, PDF, CRUD)
│   │   ├── recurring.tsx        # Gestión de movimientos recurrentes
│   │   ├── categories.tsx       # Gestión de categorías personalizadas
│   │   └── settings.tsx         # Ajustes (recordatorio diario)
│   ├── transaction/
│   │   ├── new.tsx              # Modal: crear movimiento o plantilla recurrente
│   │   └── [id].tsx             # Modal: editar / eliminar movimiento
│   └── recurring/
│       └── [id].tsx             # Modal: editar plantilla recurrente
├── components/
│   ├── ui/                      # Componentes genéricos (Button, EmptyState, DateField)
│   ├── auth/                    # AuthForm, GoogleSignInButton
│   ├── categories/              # CategoryManager, ColorPicker
│   ├── dashboard/               # BalanceCard, SummaryItem, CategoryChart, DateRangeFilter
│   └── transactions/            # TransactionForm, RecurringConfig, TransactionList, TransactionFilters, TransactionItem
├── constants/
│   ├── categories.ts            # Categorías default para precarga
│   └── colors.ts                # Paleta de colores centralizada
├── hooks/
│   ├── useTransactions.ts       # Conecta Firestore listener (transactions) con el store
│   ├── useCategories.ts         # Conecta Firestore listener (categorías) con el store
│   ├── useRecurringTemplates.ts # Conecta Firestore listener (plantillas) con el store
│   ├── useRecurrenceEngine.ts   # Genera movimientos de plantillas cuya fecha ya llegó
│   └── useNotifications.ts      # Estado del recordatorio diario en la UI
├── lib/
│   └── firebase.ts              # Inicialización singleton de Firebase (multi-plataforma)
├── schemas/
│   ├── auth.schema.ts           # Zod schemas de login/registro
│   ├── category.schema.ts       # Zod schema + validación de unicidad de categorías
│   └── transaction.schema.ts    # Zod schema (movimientos + recurrencias)
├── services/
│   ├── transactions.service.ts  # CRUD + suscripción RT de movimientos
│   ├── recurring.service.ts     # CRUD + ejecución segura (transacción) de plantillas
│   ├── categories.service.ts    # CRUD + precarga de categorías default
│   ├── notifications.service.ts # Recordatorio diario (expo-notifications + AsyncStorage)
│   ├── upload.service.ts        # Subida de imágenes a Cloudinary
│   └── users.service.ts         # Perfil de usuario + eliminación de cuenta en cascada
├── store/
│   └── useFinanceStore.ts       # Store Zustand + selectores puros
├── types/
│   └── index.ts                 # Tipos de dominio (Transaction, RecurringTemplate, CustomCategory)
├── utils/
│   ├── dialog.ts                # Diálogos cross-platform (alert/confirm)
│   ├── exportPdf.ts             # Generación y compartición de PDF
│   ├── formatters.ts            # Funciones puras de formato (moneda ARS, fecha es-AR)
│   ├── network.ts               # Verificación de conectividad
│   └── recurrence.ts            # Cálculo de próxima fecha de ejecución
├── __tests__/
│   ├── unit/                    # Pruebas de schemas, services, store, utils
│   └── integration/             # Pruebas de hooks y componentes
└── __mocks__/                   # Mocks de expo/firebase para testing
```

---

## Modelos de datos (Firestore)

### Colección `transactions`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | ID generado por Firestore |
| `amount` | number | Monto del movimiento |
| `description` | string | Descripción (máx. 100 caracteres) |
| `category` | string | ID de la categoría |
| `date` | string | Fecha `YYYY-MM-DD` |
| `type` | enum | `income` \| `expense` |
| `userId` | string | UID del dueño |
| `createdAt` / `updatedAt` | string | Timestamps ISO 8601 |
| `isRecurring` | boolean (opcional) | `true` si fue generado por una plantilla |
| `receiptUrl` | string (opcional) | URL del comprobante en Cloudinary |

### Colección `recurringTemplates`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `frequency` | enum | `daily` \| `weekly` \| `biweekly` \| `monthly` \| `yearly` |
| `executionDay` | number \| null | `null` diaria; `0-6` semanal; `1-31` las demás |
| `startDate` / `endDate` | string | Rango de vigencia (`YYYY-MM-DD`) |
| `isActive` | boolean | Plantilla activa o pausada |
| `nextExecutionDate` | string | Próxima fecha de generación |
| `lastGeneratedDate` | string \| null | Última ejecución realizada |

### Subcolección `users/{userId}/categories`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `label` | string | Nombre (único por tipo, máx. 30 caracteres) |
| `type` | enum | `income` \| `expense` |
| `color` | string | Color hexadecimal (único por tipo) |
| `icon` | string | Nombre del ícono Ionicons |

---

## Primeros pasos

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase y Cloudinary

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar **Authentication** con los métodos: **Email/Contraseña** y **Google**
3. Crear una base de datos en **Firestore Database** (modo producción o prueba)
4. Configurar los **índices compuestos** que Firestore sugiera al ejecutar:
   - `transactions`: `userId` (Asc) + `date` (Desc)
   - `recurringTemplates`: `userId` (Asc) + `nextExecutionDate` (Asc)
5. Crear una cuenta en [Cloudinary](https://cloudinary.com) y un **unsigned upload preset**
6. Copiar las credenciales:

```bash
cp .env.example .env
# Completar las variables con los valores de Firebase Console y Cloudinary
```

Variables requeridas en `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=   # OAuth web client ID para Google Sign-In
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

### 3. Ejecutar la aplicación

```bash
# Con Expo Go (recomendado para desarrollo)
npm start

# Android (build nativo con expo-dev-client)
npm run android

# iOS (requiere macOS con Xcode)
npm run ios

# Web
npm run web
```

> **Nota**: Google Sign-In en nativo requiere un build con `expo-dev-client` (no funciona en Expo Go sin el módulo nativo).

---

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia Metro / Expo dev server |
| `npm run android` | Build nativo y ejecución en Android |
| `npm run ios` | Build nativo y ejecución en iOS |
| `npm run web` | Ejecuta la versión web |
| `npm run web:build` | Exporta la web estática a `dist/` |
| `npm run web:deploy` | Despliega la web a Firebase Hosting |
| `npm test` | Ejecuta la suite de tests (jest-expo) |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Tests con reporte de cobertura |

### Builds nativos con EAS

Configuración en `eas.json`:

```bash
# Build de desarrollo (expo-dev-client)
eas build --profile development --platform android

# Build preview (APK para Android)
eas build --profile preview --platform android

# Build de producción
eas build --profile production --platform android
```

---

## Reglas de seguridad de Firestore recomendadas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Movimientos: solo el dueño puede leer/escribir
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;
    }

    // Plantillas recurrentes
    match /recurringTemplates/{templateId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;
    }

    // Categorías personalizadas (subcolección por usuario)
    match /users/{userId}/categories/{categoryId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }

    // Perfil de usuario
    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

---

## Testing

La suite usa **jest-expo** con `@testing-library/react-native`.

```bash
├── __tests__/
│   ├── unit/                # Schemas (zod), services, store, utils
│   └── integration/         # Hooks y componentes
```

- **Schemas**: validan reglas de Zod para auth, transacciones y categorías (incluida la unicidad nombre/color por tipo).
- **Services/Store**: lógica de negocio pura (selectores, formatters, recurrencias, export PDF) con Firebase mockeado.
- **Hooks/Componentes**: integración entre hooks y store mediante mocks de expo-router y firebase.

---

## Decisiones de diseño

- **Fecha como string `YYYY-MM-DD`**: evita problemas de zona horaria al serializar/deserializar entre Firestore y el store.
- **Store solo guarda estado sincrónico**: las operaciones async (Firebase) viven en los servicios. Los selectores son funciones puras fuera del store para memoización con `useCallback`/`useMemo`.
- **Suscripciones en tiempo real vía hooks**: los hooks (`useTransactions`, `useCategories`, `useRecurringTemplates`) encapsulan suscripción/desuscripción con cleanup en `useEffect`.
- **Motor de recurrencias idempotente**: `executeDueRecurringTemplate` usa una **transacción de Firestore** para ser seguro ante snapshots repetidos o múltiples dispositivos con la misma cuenta.
- **Módulos nativos con `require()` dinámico en web**: `expo-notifications`, `expo-print`, `expo-sharing`, `@react-native-google-signin` se importan solo en nativo para no inflar el bundle web ni romper en el navegador.
- **Verificación de conectividad previa a escrituras**: `isOnline()` detecta falta de red (persistencia offline de Firestore no lanza error en `addDoc`/`updateDoc`).
- **`FlatList` sobre `ScrollView`**: virtualización para listas largas de movimientos.
- **`React.memo` en `TransactionItem`**: evita re-renders de ítems que no cambiaron al actualizar la lista.
- **Export PDF multiplataforma**: jsPDF en web (descarga directa), expo-print + expo-sharing en nativo (share sheet).
- **`DateField` cross-platform**: picker nativo (`@react-native-community/datetimepicker`) en RN, `<input type="date">` en web.
