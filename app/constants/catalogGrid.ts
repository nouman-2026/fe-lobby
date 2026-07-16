export const CATALOG_GRID_BREAKPOINTS = [
  { minWidth: 1600, columns: 6 },
  { minWidth: 1300, columns: 5 },
  { minWidth: 868, columns: 4 },
  { minWidth: 0, columns: 3 },
] as const

/** Target cards per load — rounded up to full rows for the active column count. */
export const CATALOG_TARGET_CARDS = 12

export function getCatalogGridColumns(viewportWidth: number) {
  for (const breakpoint of CATALOG_GRID_BREAKPOINTS) {
    if (viewportWidth >= breakpoint.minWidth) {
      return breakpoint.columns
    }
  }

  return 3
}

export function getCatalogPageSize(
  columns: number,
  target = CATALOG_TARGET_CARDS
) {
  return columns * Math.ceil(target / columns)
}
