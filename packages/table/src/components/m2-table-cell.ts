import './m2-table-boolean-cell'
import './m2-table-date-cell'
import './m2-table-datetime-cell'
import './m2-table-float-cell'
import './m2-table-image-cell'
import './m2-table-integer-cell'
import './m2-table-object-cell'
import './m2-table-select-cell'
import './m2-table-string-cell'
import './m2-table-textarea-cell'

import { CSSResult, LitElement, TemplateResult, customElement, html, property } from 'lit-element'
import { ColumnAlign, ColumnTypes } from '../enums'
import { ColumnConfig, TableData } from '../interfaces'
import { commonStyle, tableCellStyle } from '../assets/styles'

import { ifDefined } from 'lit-html/directives/if-defined'

@customElement('m2-table-cell')
export class M2TableCell extends LitElement {
  @property({ type: String }) type?: ColumnTypes
  @property({ type: Object }) config: ColumnConfig | any
  @property({ type: Object }) record?: TableData
  @property() value: any
  @property({ type: Boolean }) _isFocused: boolean = false
  @property({ type: Number }) rowIdx: number = -1
  @property({ type: Number }) columnIdx: number = -1
  @property({ type: Object }) TAG_MAPPER: Record<ColumnTypes, string> = {
    [ColumnTypes.Boolean]: 'm2-table-boolean-cell',
    [ColumnTypes.Float]: 'm2-table-float-cell',
    [ColumnTypes.Integer]: 'm2-table-integer-cell',
    [ColumnTypes.Select]: 'm2-table-select-cell',
    [ColumnTypes.String]: 'm2-table-string-cell',
    [ColumnTypes.Object]: 'm2-table-object-cell',
    [ColumnTypes.Date]: 'm2-table-date-cell',
    [ColumnTypes.DateTime]: 'm2-table-datetime-cell',
    [ColumnTypes.Image]: 'm2-table-image-cell',
    [ColumnTypes.Textarea]: 'm2-table-textarea-cell',
  }

  static get styles(): CSSResult[] {
    return [commonStyle, tableCellStyle]
  }

  constructor(config: ColumnConfig) {
    super()
    this.config = config
  }

  render(): TemplateResult {
    if (this.value === undefined || this.value === null) this.value = ''

    return html`
      ${this.type === ColumnTypes.String
        ? html`
            <m2-table-string-cell
              class="${ifDefined(this._computeClasses(this.config))}"
              .config="${this.config}"
              .record="${this.record}"
              .value="${String(this.value)}"
              .rowIdx="${this.rowIdx}"
              .columnIdx="${this.columnIdx}"
            ></m2-table-string-cell>
          `
        : this.type === ColumnTypes.Boolean
        ? html`
            <m2-table-boolean-cell
              class="${ifDefined(this._computeClasses(this.config))}"
              .config="${this.config}"
              .record="${this.record}"
              .value="${Boolean(this.value)}"
              .rowIdx="${this.rowIdx}"
              .columnIdx="${this.columnIdx}"
            ></m2-table-boolean-cell>
          `
        : this.type === ColumnTypes.Float
        ? html`
            <m2-table-float-cell
              class="${ifDefined(this._computeClasses(this.config))}"
              .config="${this.config}"
              .record="${this.record}"
              .value="${this.value}"
              .rowIdx="${this.rowIdx}"
              .columnIdx="${this.columnIdx}"
            ></m2-table-float-cell>
          `
        : this.type === ColumnTypes.Integer
        ? html`
            <m2-table-integer-cell
              class="${ifDefined(this._computeClasses(this.config))}"
              .config="${this.config}"
              .record="${this.record}"
              .value="${this.value}"
              .rowIdx="${this.rowIdx}"
              .columnIdx="${this.columnIdx}"
            ></m2-table-integer-cell>
          `
        : this.type === ColumnTypes.Select
        ? html`
            <m2-table-select-cell
              class="${ifDefined(this._computeClasses(this.config))}"
              .config="${this.config}"
              .record="${this.record}"
              .value="${this.value}"
              .rowIdx="${this.rowIdx}"
              .columnIdx="${this.columnIdx}"
            ></m2-table-select-cell>
          `
        : this.type === ColumnTypes.Object
        ? html`
            <m2-table-object-cell
              class="${ifDefined(this._computeClasses(this.config))}"
              .config="${this.config}"
              .record="${this.record}"
              .value="${this.value}"
              .rowIdx="${this.rowIdx}"
              .columnIdx="${this.columnIdx}"
            >
            </m2-table-object-cell>
          `
        : this.type === ColumnTypes.Date
        ? html`<m2-table-date-cell
            class="${ifDefined(this._computeClasses(this.config))}"
            .config="${this.config}"
            .record="${this.record}"
            .value="${Number(this.value)}"
            .rowIdx="${this.rowIdx}"
            .columnIdx="${this.columnIdx}"
          ></m2-table-date-cell>`
        : this.type === ColumnTypes.DateTime
        ? html`
            <m2-table-datetime-cell
              class="${ifDefined(this._computeClasses(this.config))}"
              .config="${this.config}"
              .record="${this.record}"
              .value="${Number(this.value)}"
              .rowIdx="${this.rowIdx}"
              .columnIdx="${this.columnIdx}"
            ></m2-table-datetime-cell>
          `
        : this.type === ColumnTypes.Image
        ? html`
            <m2-table-image-cell
              class="${ifDefined(this._computeClasses(this.config))}"
              .config="${this.config}"
              .record="${this.record}"
              .value="${String(this.value)}"
              .rowIdx="${this.rowIdx}"
              .columnIdx="${this.columnIdx}"
            ></m2-table-image-cell>
          `
        : this.type === ColumnTypes.Textarea
        ? html`
            <m2-table-textarea-cell
              class="${ifDefined(this._computeClasses(this.config))}"
              .config="${this.config}"
              .record="${this.record}"
              .value="${String(this.value)}"
              .rowIdx="${this.rowIdx}"
              .columnIdx="${this.columnIdx}"
            ></m2-table-textarea-cell>
          `
        : html` <m2-table-string-cell
            class="${ifDefined(this._computeClasses(this.config))}"
            .config="${this.config}"
            .record="${this.record}"
            .value="${String(this.value)}"
            .rowIdx="${this.rowIdx}"
            .columnIdx="${this.columnIdx}"
          ></m2-table-string-cell>`}
    `
  }

  public get cell(): any {
    if (!this.type) throw new Error(`'${this.config.name}' field doesn't have column 'type'`)
    const tag: string = this.TAG_MAPPER[this.type]
    if (!tag) {
      throw new Error(
        `Failed to find cell by '${this.type}', which is defined in '${this.config.name}' column, the type may not be supported`
      )
    }

    return this.renderRoot?.querySelector(this.TAG_MAPPER[this.type])
  }

  /**
   * @description Set class list for every single cell
   * currently alignment for insert text of cell is only supported.
   * @param config Object having class list
   */
  private _computeClasses(config?: ColumnConfig): string {
    let { align, type } = config || {}
    if (this.rowIdx < 0) align = ColumnAlign.Center
    let classes: string[] = []
    if (align) {
      classes.push(align)
    } else {
      if (type === ColumnTypes.Integer || type === ColumnTypes.Float) {
        align = ColumnAlign.Right
        classes.push(align)
      }
    }

    return classes.join(' ')
  }
}
