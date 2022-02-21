export type LDError =
  | 'Launch Darkly: user key is not defined'
  | 'Launch Darkly: unable to initialise'

export interface LDVariation {
  variation: boolean
}
