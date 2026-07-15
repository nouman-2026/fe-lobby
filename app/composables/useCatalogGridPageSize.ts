import {
  getCatalogGridColumns,
  getCatalogPageSize,
} from '~/constants/catalogGrid'

export function useCatalogGridPageSize() {
  const columns = ref(3)
  const pageSize = computed(() => getCatalogPageSize(columns.value))

  function syncColumns() {
    if (!import.meta.client) return

    columns.value = getCatalogGridColumns(window.innerWidth)
  }

  onMounted(() => {
    syncColumns()
    window.addEventListener('resize', syncColumns, { passive: true })
  })

  onUnmounted(() => {
    if (!import.meta.client) return

    window.removeEventListener('resize', syncColumns)
  })

  return { columns, pageSize }
}
