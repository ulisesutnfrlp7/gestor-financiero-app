# Gestor Financiero Personal

Aplicación móvil para Android e iOS que permite registrar y controlar ingresos y gastos personales.

---

## Stack tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Framework | React Native + Expo SDK 52 | Desarrollo multiplataforma con DX moderno |
| Navegación | Expo Router v4 | File-based routing, deep linking automático |
| Lenguaje | TypeScript (strict) | Tipado estático, menor cantidad de bugs en runtime |
| Backend | Firebase (Auth + Firestore) | BaaS sin servidor, tiempo real, escalable |
| Estado global | **Zustand** | Mínimo boilerplate, sin providers, TypeScript nativo |
| Formularios | **React Hook Form** | Componentes no controlados = mejor performance |
| Validaciones | **Zod** | Inferencia de tipos desde el schema, sin duplicar tipos |
| UI | **NativeWind v4** | Utility-first (Tailwind) para React Native, máxima flexibilidad |

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

**Regla principal**: las pantallas no importan Firebase directamente. Todo acceso a datos pasa por los servicios.

---

## Estructura del proyecto

```
gestor-financiero-app/
├── app/
│   ├── _layout.tsx              # Root layout: auth anónima + splash screen
│   ├── +not-found.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation
│   │   ├── index.tsx            # Dashboard (balance, ingresos, gastos)
│   │   └── history.tsx          # Historial de movimientos
│   └── transaction/
│       ├── new.tsx              # Modal: crear movimiento
│       └── [id].tsx             # Modal: editar / eliminar movimiento
├── components/
│   ├── ui/                      # Componentes genéricos reutilizables
│   │   ├── Button.tsx
│   │   └── EmptyState.tsx
│   ├── dashboard/
│   │   ├── BalanceCard.tsx
│   │   └── SummaryItem.tsx
│   └── transactions/
│       ├── TransactionItem.tsx
│       ├── TransactionList.tsx
│       └── TransactionForm.tsx  # Formulario compartido (crear + editar)
├── constants/
│   ├── categories.ts            # Categorías fijas del MVP
│   └── colors.ts                # Paleta de colores centralizada
├── hooks/
│   └── useTransactions.ts       # Conecta Firestore listener con el store
├── lib/
│   └── firebase.ts              # Inicialización singleton de Firebase
├── schemas/
│   └── transaction.schema.ts    # Zod schema (fuente de verdad de tipos del form)
├── services/
│   └── transactions.service.ts  # Acceso a Firestore (CRUD + suscripción RT)
├── store/
│   └── useFinanceStore.ts       # Store Zustand + selectores
├── types/
│   └── index.ts                 # Tipos de dominio
└── utils/
    └── formatters.ts            # Funciones puras de formato (moneda, fecha)
```

---

## Primeros pasos

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar **Authentication → Métodos de inicio de sesión → Anónimo**
3. Crear una base de datos en **Firestore Database** (modo producción o prueba)
4. Agregar el índice compuesto requerido (Firestore lo sugiere al ejecutar la primera query):
   - Colección: `transactions` | Campo 1: `userId` (Asc) | Campo 2: `date` (Desc)
5. Copiar las credenciales de la app web:

```bash
cp .env.example .env
# Completar las variables en .env con los valores de Firebase Console
```

### 3. Ejecutar la aplicación

```bash
# Con Expo Go (recomendado para desarrollo)
npm start

# Android
npm run android

# iOS
npm run ios
```

---

## Reglas de seguridad de Firestore recomendadas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{transactionId} {
      // Solo el dueño puede leer/escribir sus movimientos
      allow read, write: if request.auth != null
                         && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## Decisiones de diseño del MVP

- **Auth anónima**: cada instalación obtiene un `userId` único sin registro. Los datos persisten mientras no se desinstale la app.
- **Categorías fijas**: definidas en `constants/categories.ts`. En versiones futuras pueden moverse a Firestore para que el usuario las personalice.
- **Fecha como string YYYY-MM-DD**: evita problemas de zona horaria al serializar/deserializar entre Firestore y el store.
- **FlatList sobre ScrollView**: virtualización para listas largas de movimientos.
- **`React.memo` en TransactionItem**: evita re-renders de ítems que no cambiaron al actualizar la lista.

