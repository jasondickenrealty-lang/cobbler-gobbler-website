/**
 * Mirror of client/src/utils/modifierRules.ts and the copy in online-ordering.
 *
 * The Settings screen saves `minSelection` / `maxSelection` (singular); this
 * app's types declared `minSelections` / `maxSelections` (plural), so its
 * required-group handling read undefined and never fired. Accept either.
 */

export interface ModifierGroupRule {
  /** Minimum options the guest must pick. 0 means the group is optional. */
  min: number
  /** Maximum options they may pick. 0 means no limit. */
  max: number
  /** Convenience: true when min > 0. */
  required: boolean
}

function firstCount(...values: unknown[]): number | null {
  for (const value of values) {
    // Presence decides, not value. Returning on the first *valid* number would
    // let a stored `minSelection: 0` shadow a `minSelections: 2` on the same
    // doc and silently downgrade a required group to optional.
    if (value === undefined) continue
    if (value === null || value === '') return null
    const n = Number(value)
    if (!Number.isFinite(n) || n < 0) continue
    return Math.floor(n)
  }
  return null
}

export function getModifierRule(category: any): ModifierGroupRule {
  const flagged = category?.isRequired === true || category?.required === true
  let min = firstCount(category?.minSelection, category?.minSelections) ?? 0
  const max = firstCount(category?.maxSelection, category?.maxSelections) ?? 0

  if (flagged && min < 1) min = 1
  if (max > 0 && min > max) min = max

  return { min, max, required: min > 0 }
}

/**
 * How many more options of this group the guest still has to pick. A required
 * group with no options on screen counts as satisfied, so bad menu data can
 * never make an item impossible to order.
 */
export function missingCount(category: any, selectedCount: number, availableCount: number): number {
  const { min } = getModifierRule(category)
  if (min <= 0) return 0
  const effectiveMin = Math.min(min, Math.max(availableCount, 0))
  return Math.max(effectiveMin - selectedCount, 0)
}

export function describeModifierRule(category: any, availableCount?: number): string {
  const { min, max } = getModifierRule(category)
  const effectiveMin = typeof availableCount === 'number'
    ? Math.min(min, Math.max(availableCount, 0))
    : min

  if (effectiveMin <= 0) {
    if (max === 1) return 'Optional · pick 1'
    if (max > 1) return `Optional · max ${max}`
    return 'Optional'
  }
  if (max > 0 && max === effectiveMin) return `Required · pick ${effectiveMin}`
  if (max > 0) return `Required · pick ${effectiveMin}-${max}`
  return `Required · pick at least ${effectiveMin}`
}
