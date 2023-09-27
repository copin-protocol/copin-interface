export enum ColumnState {
  DEFAULT = 'DEFAULT',
  MINIMIZED_LEFT = 'MINIMIZED_LEFT',
  MINIMIZED_RIGHT = 'MINIMIZED_RIGHT',
  EXPANDED_LEFT = 'EXPANDED_LEFT',
  EXPANDED_RIGHT = 'EXPANDED_RIGHT',
}
export enum RowState {
  DEFAULT = 'DEFAULT',
  MINIMIZED_BOTTOM = 'MINIMIZED_BOTTOM',
  MINIMIZED_TOP = 'MINIMIZED_TOP',
  EXPANDED_BOTTOM = 'EXPANDED_BOTTOM',
  EXPANDED_TOP = 'EXPANDED_TOP',
}
export interface ColumnConfig {
  ratioWidth: number
  minWidth: number
  maxWidth?: number
  state: ColumnState
}
export interface RowConfig {
  ratioHeight: number
  maxHeight?: number
  minHeight: number
  state: RowState
}

export const desktopConfigs = {
  // ratio
  MAIN_WIDTH_RATIO: 2,
  COLUMN_RIGHT_WIDTH_RATIO: 1,
  CHART_HEIGHT_RATIO: 1,
  LIST_HEIGHT_RATIO: 2,
  OPENINGS_HEIGHT_RATIO: 1,
  FILTERS_HEIGHT_RATIO: 2,
  // min
  MAIN_MIN_WIDTH: 500,
  COLUMN_RIGHT_MIN_WIDTH: 510,

  COLUMN_RIGHT_MAX_WIDTH: 510,

  CHART_MIN_HEIGHT: 280,
  LIST_MIN_HEIGHT: 0,
  OPENINGS_MIN_HEIGHT: 280,
  FILTERS_MIN_HEIGHT: 0,
}
export const mobileConfigs = {
  // ratio
  CHART_HEIGHT_RATIO: 1,
  LIST_HEIGHT_RATIO: 2,
  FILTERS_HEIGHT_RATIO: 1,

  CHART_MIN_HEIGHT: 40,
  CHART_MAX_HEIGHT: 40,
  LIST_MIN_HEIGHT: 0,
  FILTERS_MIN_HEIGHT: 40,
  FILTERS_MAX_HEIGHT: 40,
}
