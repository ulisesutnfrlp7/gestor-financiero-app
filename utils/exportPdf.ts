// utils/exportPdf.ts
// Genera y comparte un PDF con los movimientos filtrados del historial.
// Usa expo-print (HTML → PDF) + expo-sharing (share sheet nativo).

import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system/legacy'
import type { Transaction, CustomCategory } from '@/types'
import type { Filters } from '@/components/transactions/TransactionFilters'

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatCurrencyLocal = (amount: number): string =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

const formatDateLocal = (dateString: string): string => {
  try {
    const [y, m, d] = dateString.split('-')
    return `${d}/${m}/${y}`
  } catch {
    return dateString
  }
}

// ─── Resumen de filtros activos ──────────────────────────────────────────────

export const buildFilterSummary = (
  filters: Filters,
  categories: CustomCategory[],
): string => {
  const parts: string[] = []

  if (filters.type === 'income') parts.push('Solo ingresos')
  else if (filters.type === 'expense') parts.push('Solo gastos')
  else parts.push('Todos los movimientos')

  if (filters.category) {
    const cat = categories.find((c) => c.id === filters.category)
    if (cat) parts.push(`Categoría: ${cat.label}`)
  }
  if (filters.dateFrom) parts.push(`Desde: ${formatDateLocal(filters.dateFrom)}`)
  if (filters.dateTo) parts.push(`Hasta: ${formatDateLocal(filters.dateTo)}`)
  if (filters.searchQuery) parts.push(`Búsqueda: "${filters.searchQuery}"`)

  return parts.join('  ·  ')
}

// ─── Template HTML ───────────────────────────────────────────────────────────

const buildHtmlTemplate = (
  transactions: Transaction[],
  categories: CustomCategory[],
  filters: Filters,
): string => {
  const categoryMap = new Map(categories.map((c) => [c.id, c]))

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense
  const filterSummary = buildFilterSummary(filters, categories)
  const exportDate = new Date().toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  const rows = transactions
    .map((t) => {
      const cat = categoryMap.get(t.category)
      const catLabel = cat?.label ?? t.category
      const catColor = cat?.color ?? (t.type === 'income' ? '#16A34A' : '#DC2626')
      const isIncome = t.type === 'income'
      const rowBg = isIncome ? '#F0FDF4' : '#FEF2F2'
      const amountColor = isIncome ? '#16A34A' : '#DC2626'
      const typeLabel = isIncome ? 'Ingreso' : 'Gasto'
      const typeBg = isIncome ? '#DCFCE7' : '#FEE2E2'
      const typeColor = isIncome ? '#15803D' : '#B91C1C'

      return `
        <tr style="background:${rowBg}">
          <td style="padding:10px 12px;border-bottom:1px solid #E5E7EB;color:#374151;font-size:13px;white-space:nowrap">${formatDateLocal(t.date)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #E5E7EB;color:#111827;font-size:13px">${t.description}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #E5E7EB">
            <span style="display:inline-flex;align-items:center;gap:5px">
              <span style="width:9px;height:9px;border-radius:50%;background:${catColor};display:inline-block"></span>
              <span style="color:#374151;font-size:13px">${catLabel}</span>
            </span>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #E5E7EB;text-align:center">
            <span style="background:${typeBg};color:${typeColor};padding:3px 8px;border-radius:9999px;font-size:11px;font-weight:600">${typeLabel}</span>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #E5E7EB;text-align:right;color:${amountColor};font-weight:700;font-size:13px;white-space:nowrap">${formatCurrencyLocal(t.amount)}</td>
        </tr>`
    })
    .join('')

  const balanceColor = balance >= 0 ? '#16A34A' : '#DC2626'

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; background: #F9FAFB; color: #111827; }
    table { border-collapse: collapse; width: 100%; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div style="background:#4F46E5;padding:28px 32px 24px;color:white">
    <div style="font-size:22px;font-weight:700;letter-spacing:-0.3px">Gestor Financiero</div>
    <div style="font-size:13px;margin-top:4px;opacity:0.85">Historial de Movimientos</div>
    <div style="font-size:12px;margin-top:12px;opacity:0.7">Generado el ${exportDate}</div>
  </div>

  <!-- FILTROS -->
  <div style="background:#EEF2FF;border-bottom:1px solid #C7D2FE;padding:10px 32px">
    <span style="font-size:11px;font-weight:600;color:#4338CA;text-transform:uppercase;letter-spacing:0.5px">Filtros aplicados</span>
    <span style="font-size:12px;color:#4F46E5;margin-left:10px">${filterSummary}</span>
  </div>

  <div style="padding:24px 32px">

    <!-- TARJETAS RESUMEN -->
    <div style="display:flex;gap:12px;margin-bottom:28px">
      <div style="flex:1;background:white;border:1px solid #E5E7EB;border-radius:12px;padding:14px 16px;border-top:3px solid #16A34A">
        <div style="font-size:10px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Ingresos</div>
        <div style="font-size:16px;font-weight:700;color:#16A34A">${formatCurrencyLocal(totalIncome)}</div>
      </div>
      <div style="flex:1;background:white;border:1px solid #E5E7EB;border-radius:12px;padding:14px 16px;border-top:3px solid #DC2626">
        <div style="font-size:10px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Gastos</div>
        <div style="font-size:16px;font-weight:700;color:#DC2626">${formatCurrencyLocal(totalExpense)}</div>
      </div>
      <div style="flex:1;background:white;border:1px solid #E5E7EB;border-radius:12px;padding:14px 16px;border-top:3px solid #4F46E5">
        <div style="font-size:10px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Balance</div>
        <div style="font-size:16px;font-weight:700;color:${balanceColor}">${formatCurrencyLocal(balance)}</div>
      </div>
      <div style="flex:1;background:white;border:1px solid #E5E7EB;border-radius:12px;padding:14px 16px;border-top:3px solid #9CA3AF">
        <div style="font-size:10px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Movimientos</div>
        <div style="font-size:16px;font-weight:700;color:#111827">${transactions.length}</div>
      </div>
    </div>

    <!-- TABLA -->
    <div style="background:white;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden">
      <table>
        <thead>
          <tr style="background:#EEF2FF">
            <th style="padding:11px 12px;text-align:left;font-size:11px;font-weight:700;color:#4338CA;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #C7D2FE">Fecha</th>
            <th style="padding:11px 12px;text-align:left;font-size:11px;font-weight:700;color:#4338CA;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #C7D2FE">Descripción</th>
            <th style="padding:11px 12px;text-align:left;font-size:11px;font-weight:700;color:#4338CA;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #C7D2FE">Categoría</th>
            <th style="padding:11px 12px;text-align:center;font-size:11px;font-weight:700;color:#4338CA;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #C7D2FE">Tipo</th>
            <th style="padding:11px 12px;text-align:right;font-size:11px;font-weight:700;color:#4338CA;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #C7D2FE">Monto</th>
          </tr>
        </thead>
        <tbody>
          ${rows || '<tr><td colspan="5" style="padding:24px;text-align:center;color:#9CA3AF;font-size:13px">Sin movimientos para exportar</td></tr>'}
        </tbody>
      </table>
    </div>

  </div>

  <!-- FOOTER -->
  <div style="padding:16px 32px 28px;text-align:center;color:#9CA3AF;font-size:11px;border-top:1px solid #E5E7EB;margin-top:8px">
    Gestor Financiero Personal · Exportado el ${exportDate}
  </div>

</body>
</html>`
}

// ─── Función principal ───────────────────────────────────────────────────────

export const exportTransactionsPdf = async (
  transactions: Transaction[],
  categories: CustomCategory[],
  filters: Filters,
  fileName = `movimientos-al-${new Date().toLocaleDateString('en-CA')}.pdf`,
): Promise<void> => {
  const html = buildHtmlTemplate(transactions, categories, filters)

  const { uri } = await Print.printToFileAsync({ html, base64: false })

  // Renombrar el archivo a un nombre legible
  // Ya no hace falta usar (FileSystem as any) porque el legacy exporta bien los tipos
  const dir = FileSystem.documentDirectory
  
  if (!dir) throw new Error('No se pudo acceder al directorio de documentos.')
  
  const newUri = `${dir}${fileName}`
  
  // Ahora moveAsync funcionará perfectamente sin tirar error ni romper en runtime
  await FileSystem.moveAsync({ from: uri, to: newUri })

  const canShare = await Sharing.isAvailableAsync()
  if (!canShare) throw new Error('El dispositivo no soporta compartir archivos.')

  await Sharing.shareAsync(newUri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Exportar movimientos',
    UTI: 'com.adobe.pdf',
  })
}