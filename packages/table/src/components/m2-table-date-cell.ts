import { DateColumnConfig, StringColumnConfig } from '../interfaces'
import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'
import { ValidityErrors } from '../enums'
import { ifDefined } from 'lit-html/directives/if-defined'

@customElement('m2-table-date-cell')
export class M2TableDateCell extends AbstractM2TableCell<HTMLInputElement> {
  editorAccessor: string = 'input'
  valueAccessKey: string = 'value'

  renderEditor(config: DateColumnConfig): TemplateResult {
    const { max, min, step }: DateColumnConfig = config

    let dateStr: string | undefined = undefined
    if (this.value) {
      const date: Date = new Date(this.value)
      dateStr = this.convertDateToString(date)
    }

    let maxDateStr: string | undefined = undefined
    let minDateStr: string | undefined = undefined

    if (max) maxDateStr = this.convertDateToString(new Date(max))
    if (min) minDateStr = this.convertDateToString(new Date(min))

    return html`
      <input
        value="${ifDefined(dateStr)}"
        max="${ifDefined(maxDateStr)}"
        min="${ifDefined(minDateStr)}"
        step="${ifDefined(step)}"
        ?required="${this.isRequired}"
        type="date"
      />
    `
  }

  renderDisplay(config: StringColumnConfig): TemplateResult {
    const { displayValue }: StringColumnConfig = config

    if (displayValue && typeof displayValue === 'string') {
      return this.displayCellFactory(displayValue)
    } else if (displayValue && typeof displayValue === 'function') {
      return this.displayCellFactory(displayValue(this.config, this.record || {}, this.value, this.changedRecord))
    }

    if (this.value) {
      const date: Date = new Date(this.value)

      return this.displayCellFactory(date.toDateString())
    } else {
      return this.displayCellFactory('')
    }
  }

  parseValue(value: any) {
    if (value) {
      return new Date(value).getTime()
    } else if (isNaN(value)) {
      return null
    } else {
      return value
    }
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  convertDateToString(standardDate: Date): string {
    const year: string = String(standardDate.getFullYear())
    const month: string = String(standardDate.getMonth() + 1).padStart(2, '0')
    const date: string = String(standardDate.getDate()).padStart(2, '0')

    return `${year}-${month}-${date}`
  }

  checkValidity(value: any): void {
    const { min, max }: DateColumnConfig = this.config
    if (this.isRequired && (value === null || value === undefined || isNaN(value) || value === ''))
      throw new Error(ValidityErrors.VALUE_MISSING)

    if (value) {
      if (typeof min === 'number' && min > value) throw new Error(ValidityErrors.RANGE_UNDERFLOW)
      if (typeof max === 'number' && max < value) throw new Error(ValidityErrors.RANGE_OVERFLOW)
    }
  }
}
