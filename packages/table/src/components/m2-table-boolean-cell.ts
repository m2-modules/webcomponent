import { BooleanColumnConfig, ColumnConfig } from '../interfaces'
import { TemplateResult, customElement, html, property } from 'lit-element'

import { AbstractM2TableCell } from '../abstracts/abstract-m2-table-cell'
import { ValidityErrors } from '../enums'

@customElement('m2-table-boolean-cell')
export class M2TableBooleanCell extends AbstractM2TableCell<HTMLInputElement> {
  @property({ type: Boolean }) value?: boolean

  editorAccessor: string = 'input[type=checkbox]'
  valueAccessKey: string = 'checked'

  renderEditor(_config: BooleanColumnConfig): TemplateResult {
    return html` <input type="checkbox" .checked="${this.value || false}" ?required="${this.isRequired}" /> `
  }

  renderDisplay(_config: ColumnConfig): TemplateResult {
    
    const { displayValue }: BooleanColumnConfig = this.config
    if(this.rowIdx && this.rowIdx < 0) return this.displayCellFactory(this.config.header || this.config.name)
    let value: boolean = Boolean(this.value)
    if (typeof displayValue === 'function') {
      value = displayValue(this.config, this.record || {}, this.value, this.changedRecord)
    }

    return this.displayCellFactory(html` <input type="checkbox" disabled ?checked="${value || false}" /> `)
  }

  focusOnEditor(): void {
    this.editor?.select()
  }

  parseValue(value: any): boolean {
    return Boolean(value)
  }

  checkValidity(value: boolean): void {
    if (this.isRequired && !(value === true || value === false)) throw new Error(ValidityErrors.VALUE_MISSING)
  }
}
