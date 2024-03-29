import { ColumnConfig, FloatColumnConfig } from '../interfaces'
import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'
import { ValidityErrors } from '../enums'
import { ifDefined } from 'lit-html/directives/if-defined'

@customElement('m2-table-float-cell')
export class M2TableFloatCell extends AbstractM2TableCell<HTMLInputElement> {
  editorAccessor: string = 'input[type=number]'
  valueAccessKey: string = 'value'

  renderEditor(config: FloatColumnConfig): TemplateResult {
    const { min, max, step = 0.01 }: FloatColumnConfig = config

    return html`
      ${this._isEditing
        ? html`
            <input
              type="number"
              value="${ifDefined(this.value)}"
              min="${ifDefined(min)}"
              max="${ifDefined(max)}"
              step="${ifDefined(step)}"
              ?required="${this.isRequired}"
            />
          `
        : html`${this.renderDisplay}`}
    `
  }

  renderDisplay(config: ColumnConfig): TemplateResult {
    let { displayValue, step = 0.01 }: FloatColumnConfig = config

    if (displayValue && typeof displayValue === 'string') {
      return this.displayCellFactory(displayValue)
    } else if (displayValue && typeof displayValue === 'function') {
      return this.displayCellFactory(displayValue(this.config, this.record || {}, this.value, this.changedRecord))
    }

    if (typeof this.value === 'number') {
      const valueStr: string = this.value?.toString() || ''
      const stepStr: string = step.toString() || ''
      const parsedValue: string = valueStr?.substr(0, valueStr.split('.')[0].length + 1 + stepStr.split('.')[1].length)

      return this.displayCellFactory(Number(parsedValue))
    } else {
      return this.displayCellFactory(this.value)
    }
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  parseValue(value: any): number | null {
    if (value === '' || value === undefined || value === null || isNaN(value)) return null
    return Number(value)
  }

  checkValidity(value: any): void {
    const { min, max }: FloatColumnConfig = this.config
    if (this.isRequired && (value === null || value === undefined || isNaN(value) || value === ''))
      throw new Error(ValidityErrors.VALUE_MISSING)

    if (value) {
      if (min !== undefined && min > value) throw new Error(ValidityErrors.RANGE_UNDERFLOW)
      if (max !== undefined && max < value) throw new Error(ValidityErrors.RANGE_OVERFLOW)
    }
  }
}
