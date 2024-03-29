import { BaseColumnConfig } from './BaseColumnConfig'

export interface StringColumnConfig extends BaseColumnConfig {
  placeholder?: string
  maxlength?: number
  minlength?: number
}
