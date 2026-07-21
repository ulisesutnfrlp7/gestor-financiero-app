# CONVERSACIÓN 21/7/2026

¿dónde le puedo cambiar el nombre al PDF? me salta de nombre muchas letras y números jskdaj9s78jadksa.pdf, algo así. Quisiera que el nuevo nombre sea movimientos-al-{fecha-de-hoy}.pdf.

Ya quedó cambiado en [utils/exportPdf.ts](/C:/Users/tauma/OneDrive/Escritorio/repo-gestor-financiero-app/gestor-financiero-app/utils/exportPdf.ts:190).

Ahora se exportará, por ejemplo, como:

`movimientos-al-2026-07-21.pdf`

La fecha se calcula automáticamente cada vez que generás el PDF. Verifiqué que TypeScript no reporte errores.

✅ **Verificación de conexión antes de cada operación implementada.**

### Archivos creados

| Archivo | Contenido |
|---------|-----------|
| `utils/network.ts` | Función `isOnline()` que hace un HEAD request a Google con timeout de 5s |

### Archivos modificados

| Archivo | Operaciones protegidas |
|---------|----------------------|
| `components/categories/CategoryManager.tsx` | ✅ Crear, ✅ Editar, ✅ Eliminar categoría |
| `app/transaction/new.tsx` | ✅ Crear movimiento |
| `app/transaction/[id].tsx` | ✅ Editar movimiento, ✅ Eliminar movimiento |

### Cómo funciona

Antes de ejecutar cualquier operación (crear, editar, eliminar):

1. Se llama a `isOnline()` que intenta un HEAD request a `google.com/generate_204`
2. Si el servidor responde (hay conexión) → se ejecuta la operación normalmente
3. Si no responde (timeout de 5s) → se muestra una alerta: **"Sin conexión a Internet. Verificá tu conexión."** y se cancela la operación

Esto evita que Firebase guarde datos localmente sin que el usuario lo sepa.

podés verificar qué es lo que pasa con la eliminación? no se estaría aplicando el "Verificá tu conexión a internet" al eliminar un movimiento desde el tacho de basura. Lo elimina localmente, y después cuando se recupera la conexión los borra definitivamente. No tiene que pasar eso.

Encontré y corregí el problema: el tacho del historial usaba un flujo distinto que no verificaba conexión.

Ahora, en [history.tsx](/C:/Users/tauma/OneDrive/Escritorio/repo-gestor-financiero-app/gestor-financiero-app/app/(tabs)/history.tsx:61), antes de eliminar un movimiento se llama a `isOnline()`.

Sin conexión, muestra:

> Sin conexión a Internet. Verificá tu conexión.

y no ejecuta `deleteTransaction`, por lo que Firestore no podrá dejar el borrado pendiente para sincronizarlo después. También verifiqué TypeScript sin errores.