import { ButtonType, Events } from '../enums'
import { CSSResult, TemplateResult, customElement, html } from 'lit-element'
import {
  ColumnConfig,
  IconButtonOptions,
  TableButton,
  TextButtonOptions,
} from '../interfaces'

import { AbstractM2TablePart } from '../abstracts'
import { headerStyle } from '../assets/styles'

@customElement('m2-table-header')
export class M2TableHeader extends AbstractM2TablePart {
  static get styles(): CSSResult[] {
    return [headerStyle]
  }

  render(): TemplateResult {
    return html`
      <thead>
        <tr>
          ${this.selectable ? this.renderSelectInput() : ''}
          ${this.numbering ? this.renderRowNumbering() : ''}
          ${this.buttons.map((button: TableButton) =>
            this.renderButton(button)
          )}
          ${this.columns.map((column: ColumnConfig) =>
            this.renderTableCell(column)
          )}
        </tr>
      </thead>
    `
  }

  private renderRowNumbering(): TemplateResult {
    return html` <th class="header-numbering" width="30">No.</th> `
  }

  private renderButton(button: TableButton): TemplateResult | void {
    if (button.type === ButtonType.Icon) {
      let icon: any
      const buttonOptions: IconButtonOptions = button.options as IconButtonOptions
      if (typeof buttonOptions.icon === 'function') {
        icon = icon as HTMLElement
        icon = buttonOptions.icon.call(this)
      } else {
        icon = new Image()
        icon.src = buttonOptions.icon
      }

      return html`<th>
        <button>${icon}</button>
      </th>`
    } else if (button.type === ButtonType.Text) {
      const buttonOptions: TextButtonOptions = button.options as TextButtonOptions

      return html` <th>
        <button>${buttonOptions.text}</button>
      </th>`
    }
  }

  private renderSelectInput(): TemplateResult {
    return html`
      <th>
        <input
          id="select-all"
          type="checkbox"
          @change="${this.onSelecterAllChangeHandler.bind(this)}"
        />
      </th>
    `
  }

  private renderTableCell(column: ColumnConfig): TemplateResult {
    return html`
      <th width="${column.width || 150}" ?hidden="${column.hidden}">
        ${this.displayHeader(column)}
      </th>
    `
  }

  /**
   * @description This is the function to concrete how header looks like.
   * @param config configuration for header
   */
  displayHeader(config: ColumnConfig): string {
    if (config.header) {
      if (typeof config.header === 'function') {
        return config.header()
      } else {
        return config.header
      }
    } else {
      return config.name
    }
  }

  /**
   * @description Change event handler of select-all check box.
   * It will distach custom event (select-all, deselect-all) based on the value of current checkbox.
   * @param e
   */
  onSelecterAllChangeHandler(e: InputEvent): void {
    const checked: boolean = (e.currentTarget as HTMLInputElement).checked
    if (checked) {
      this.dispatchEvent(
        new CustomEvent(Events.SelectorSelectAll, {
          bubbles: true,
          composed: true,
          cancelable: true,
        })
      )
    } else {
      this.dispatchEvent(
        new CustomEvent(Events.SelectorDeselectAll, {
          bubbles: true,
          composed: true,
          cancelable: true,
        })
      )
    }
  }
}
