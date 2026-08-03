// utils/exportPdf.ts
// Genera y comparte un PDF con los movimientos filtrados del historial.
//
// Multiplataforma:
//   - Nativo: expo-print (HTML → PDF) + expo-sharing (share sheet nativo)
//   - Web: genera y descarga un PDF directo con jsPDF
//
// Nota: los módulos nativos (expo-print, expo-sharing, expo-file-system) se
// cargan con require() dinámico SOLO en nativo, para no incluirlos en el bundle web.

import { Platform } from 'react-native'
import type { Transaction, CustomCategory } from '@/types'
import type { Filters } from '@/components/transactions/TransactionFilters'

const IS_WEB = Platform.OS === 'web'

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
  <title>Gestor Financiero — Historial</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; background: #F9FAFB; color: #111827; }
    table { border-collapse: collapse; width: 100%; }
    @media print {
      body { background: #fff; }
    }
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

// ─── Exportar en web (descarga directa) ─────────────────────────────────────

const exportWebPdf = async (
  transactions: Transaction[],
  categories: CustomCategory[],
  filters: Filters,
  fileName: string,
): Promise<void> => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf/dist/jspdf.es.min.js'),
    import('jspdf-autotable/es'),
  ])

  const categoryMap = new Map(categories.map((c) => [c.id, c]))
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('Gestor Financiero', 40, 44)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Historial de Movimientos', 40, 64)

  const summary = buildFilterSummary(filters, categories)
  doc.setFontSize(9)
  doc.setTextColor(79, 70, 229)
  doc.text(`Filtros: ${summary}`, 40, 84)

  doc.setFontSize(10)
  doc.setTextColor(31, 41, 55)
  doc.text(`Ingresos: ${formatCurrencyLocal(totalIncome)}`, 40, 108)
  doc.text(`Gastos: ${formatCurrencyLocal(totalExpense)}`, 210, 108)
  doc.text(`Balance: ${formatCurrencyLocal(balance)}`, 360, 108)
  doc.text(`Movimientos: ${transactions.length}`, 510, 108)

  const rows = transactions.map((t) => {
    const cat = categoryMap.get(t.category)
    return [
      formatDateLocal(t.date),
      t.description,
      cat?.label ?? t.category,
      t.type === 'income' ? 'Ingreso' : 'Gasto',
      formatCurrencyLocal(t.amount),
    ]
  })

  autoTable(doc, {
    startY: 124,
    head: [['Fecha', 'Descripcion', 'Categoria', 'Tipo', 'Monto']],
    body: rows,
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 6,
      textColor: [31, 41, 55],
    },
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      4: { halign: 'right' },
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: 40, right: 40, bottom: 40 },
  })

  doc.save(fileName)
}

// ─── Función principal ───────────────────────────────────────────────────────

export const exportTransactionsPdf = async (
  transactions: Transaction[],
  categories: CustomCategory[],
  filters: Filters,
  fileName = `movimientos-al-${new Date().toLocaleDateString('en-CA')}.pdf`,
): Promise<void> => {
  if (IS_WEB) {
    await exportWebPdf(transactions, categories, filters, fileName)
    return
  }

  const html = buildHtmlTemplate(transactions, categories, filters)

  // Cargar módulos nativos solo en nativo (no entran al bundle web)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Print = require('expo-print') as typeof import('expo-print')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Sharing = require('expo-sharing') as typeof import('expo-sharing')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const FileSystem = require('expo-file-system/legacy') as typeof import('expo-file-system/legacy')

  const { uri } = await Print.printToFileAsync({ html, base64: false })

  // Renombrar el archivo a un nombre legible
  const dir = FileSystem.documentDirectory

  if (!dir) throw new Error('No se pudo acceder al directorio de documentos.')

  const newUri = `${dir}${fileName}`

  await FileSystem.moveAsync({ from: uri, to: newUri })

  const canShare = await Sharing.isAvailableAsync()
  if (!canShare) throw new Error('El dispositivo no soporta compartir archivos.')

  await Sharing.shareAsync(newUri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Exportar movimientos',
    UTI: 'com.adobe.pdf',
  })
}