import './m2-table-cell'

import { AbstractM2TableCell, AbstractM2TablePart } from '../abstracts'
import { ButtonType, CellEvents, DataStatus, Events } from '../enums'
import { CSSResult, PropertyValues, TemplateResult, customElement, html, property } from 'lit-element'
import {
  ColumnConfig,
  IconButtonOptions,
  RowSelectorOption,
  Sorting,
  TableButton,
  TableChangeValueProperties,
  TableData,
  TextButtonOptions,
} from '../interfaces'
import { KeyActions, keyMapper } from '../utils/key-mapper'
import { bodyStyle, commonStyle } from '../assets/styles'

import { M2TableCell } from './m2-table-cell'

@customElement('m2-table-body')
export class M2TableBody extends AbstractM2TablePart {
  @property({ type: Array }) data: TableData[] = []
  @property({ type: Array }) private _data: TableData[] = []
  @property({ type: Boolean }) isEditing: boolean = false
  @property({ type: Object }) focusedCell?: M2TableCell
  @property({ type: Number }) focusedRowIdx?: number = -1
  @property({ type: Number }) startRowNumber: number = 1

  @property({ type: Array }) selectedData: TableData[] = []
  public selectedDataMap: Map<string, TableData> = new Map()

  static get styles(): CSSResult[] {
    return [commonStyle, bodyStyle]
  }

  private propertyAccessKey: string = '__props__'

  constructor() {
    super()
    this.addEventListener('keydown', this.onkeydownHandler.bind(this))
    this.addEventListener(CellEvents.CellValueChange, this.onValueChangeHandler.bind(this))
    this.addEventListener(CellEvents.EditNextRow, this.onEditNextRowHandler.bind(this))
    this.addEventListener(CellEvents.EditNextColumn, this.onEditNextColumnHandler.bind(this))
  }

  render(): TemplateResult {
    return html`
      <tbody>
        ${this._data.map(
          (record: TableData, rowIdx: number) => html`
            <tr
              rowIdx="${rowIdx}"
              ?changed="${record?.[this.propertyAccessKey]?.changed || false}"
              ?appended="${record?.[this.propertyAccessKey]?.appended || false}"
              ?deleted="${record?.[this.propertyAccessKey]?.deleted || false}"
              ?selected="${record?.[this.propertyAccessKey]?.selected || false}"
              @dblclick="${this.onDblClickHandler}"
              @click="${this.onClickHandler}"
              ?focused="${this.focusedRowIdx === rowIdx}"
            >
              ${this.selectable ? this.renderSelectInput(rowIdx, record) : ''}
              ${this.numbering ? this.renderRowNumbering(rowIdx) : ''}
              ${this.buttons.map((button: TableButton) => this.renderButton(button, record, rowIdx))}
              ${this.columns.map((column: ColumnConfig, columnIdx: number) =>
                this.renderTableCell(column, record, rowIdx, columnIdx)
              )}
            </tr>
          `
        )}
      </tbody>
    `
  }

  private renderRowNumbering(rowIdx: number): TemplateResult {
    return html`
      <td class="row-numbering numbering">
        <span class="row-num">${this.startRowNumber + rowIdx + 1}</span>
      </td>
    `
  }

  private renderSelectInput(rowIdx: number, record: TableData): TemplateResult {
    return html`<td class="row-selector selector">
      <input
        rowIdx="${rowIdx}"
        name="selector"
        type="checkbox"
        @change="${this.onSelectorChangeHandler.bind(this)}"
        .checked="${record?.[this.propertyAccessKey]?.selected || false}"
      />
    </td>`
  }

  private renderButton(button: TableButton, record: TableData, rowIdx: number): TemplateResult | void {
    const eventParams = { record, rowIdx }

    if (button.type === ButtonType.Icon) {
      let icon: any
      const buttonOptions: IconButtonOptions = button.options as IconButtonOptions
      if (typeof buttonOptions.icon === 'function') {
        icon = icon as HTMLElement
        icon = buttonOptions.icon(record)
      } else {
        icon = new Image()
        icon.src = buttonOptions.icon
      }

      return html`<td class="button">
        ${icon
          ? html` <button
              @click="${() => {
                const handler: any = buttonOptions?.handlers?.click
                if (handler && typeof handler === 'function') {
                  handler(eventParams)
                }
              }}"
              @dblclick="${() => {
                const handler: any = buttonOptions?.handlers?.dblclick
                if (handler && typeof handler === 'function') {
                  handler(eventParams)
                }
              }}"
            >
              ${icon}
            </button>`
          : html`<button disabled></button>`}
      </td>`
    } else if (button.type === ButtonType.Text) {
      const buttonOptions: TextButtonOptions = button.options as TextButtonOptions

      let text: any
      if (typeof buttonOptions.text === 'function') {
        text = buttonOptions.text(record)
      } else {
        text = buttonOptions.text
      }

      return html` <td>
        <button
          @click="${() => {
            const handler: any = buttonOptions?.handlers?.click
            if (handler && typeof handler === 'function') {
              handler(eventParams)
            }
          }}"
          @dblclick="${() => {
            const handler: any = buttonOptions?.handlers?.click
            if (handler && typeof handler === 'function') {
              handler(eventParams)
            }
          }}"
        >
          ${text}
        </button>
      </td>`
    }
  }

  private renderTableCell(column: ColumnConfig, record: TableData, rowIdx: number, columnIdx: number): TemplateResult {
    let value: any = record[column.name]
    if (record[this.propertyAccessKey]?.changed) {
      const changedFields: string[] = record[this.propertyAccessKey].changedValues.map((change: any) => change.field)
      if (changedFields.indexOf(column.name) >= 0) {
        value = record[this.propertyAccessKey].changedValues.find((change: any) => change.field === column.name).changes
      }
    }

    return html`
      <td columnIdx="${columnIdx}" style="width: ${column.width || 150}px;" ?hidden="${column.hidden}">
        <m2-table-cell
          rowIdx="${rowIdx}"
          columnIdx="${columnIdx}"
          .type="${column.type}"
          .config="${column}"
          .value="${value}"
          .record="${record}"
          @modeChange="${this.onModeChangeHandler}"
          @focusChange="${this.onFocusChangeHandler}"
        ></m2-table-cell>
      </td>
    `
  }

  private getRecordIdentifier(record: TableData): string {
    let identifier: any
    if (this.selectable.fieldIdentifier) {
      if (typeof this.selectable.fieldIdentifier === 'function') {
        identifier = this.selectable.fieldIdentifier(record)
      } else {
        identifier = record[this.selectable.fieldIdentifier]
      }
    } else {
      if ('id' in record) {
        identifier = record['id']
      } else {
        identifier = record[Object.keys(record)[0]]
      }
    }

    if (typeof identifier !== 'string') {
      identifier = JSON.stringify(identifier)
    }
    return identifier
  }

  stampSelected(record: TableData, selected: boolean = true): TableData {
    if (!record[this.propertyAccessKey]) record[this.propertyAccessKey] = {}
    Object.assign(record[this.propertyAccessKey], { selected })
    this.requestUpdate()
    return record
  }

  updated(changedProps: PropertyValues): void {
    super.updated(changedProps)

    if (changedProps.has('data') || changedProps.has('addable')) {
      this._data = (this.data || []).map((record: TableData) => {
        let cloned: TableData = Object.assign({}, record)

        if (this.selectable && this.selectable.stackSelection) {
          const identifier: string = this.getRecordIdentifier(cloned)
          if (this.selectedDataMap.has(identifier)) {
            this.stampSelected(cloned)
          }
        }

        return cloned
      })
      if (this.data?.length === 0 && this.addable) {
        this.appendData()
      }
    }

    if (
      this.selectable &&
      this.selectedData.length &&
      (changedProps.has('selectedData') || changedProps.has('selectable'))
    ) {
      this.selectedData.forEach((record: TableData) => {
        const identifier: string = this.getRecordIdentifier(record)
        this.selectedDataMap.set(identifier, record)
      })
    }

    if ((changedProps.has('_data') || changedProps.has('columns')) && this._data?.length && this.columns?.length) {
      this.setStickyColumnStyle()
    }
  }

  getRow(rowIdx: number): any {
    return this.renderRoot?.querySelector(`tr[rowidx="${rowIdx}"]`)
  }

  getSelectedRowElements(): HTMLTableRowElement[] {
    const selectedRowElements: HTMLTableRowElement[] = Array.from(this.renderRoot?.querySelectorAll('tr[selected]'))
    return selectedRowElements
  }

  getSelectedIndexes(): number[] {
    return this.getSelectedRowElements().map((rowEl: HTMLTableRowElement) => Number(rowEl.getAttribute('rowIdx')))
  }

  getRecords(withProps: boolean = false): TableData[] {
    return this._data.map((record: TableData) => {
      let clone: TableData = Object.assign({}, record)
      const changedValues: TableChangeValueProperties[] | undefined = clone[this.propertyAccessKey]?.changedValues
      if (changedValues?.length) {
        changedValues.forEach((changedValue: TableChangeValueProperties) => {
          clone[changedValue.field] = changedValue.changes
        })
      }

      if (!withProps) delete clone[this.propertyAccessKey]

      return clone
    })
  }

  /**
   * @description Returning selected data rows
   * @param withProps Whether this.propertyAccessKey of data is involved or not
   * @returns {TableData[]} selected data list
   */
  getSelected(withProps: boolean = false): TableData[] {
    const selectedDataIds: string[] = Array.from(this.selectedDataMap.keys())

    return this._data
      .filter((record: TableData) => {
        const id: string = this.getRecordIdentifier(record)
        if (selectedDataIds.indexOf(id) >= 0) return true
        return false
      })
      .map((record: TableData) => {
        let clone: TableData = Object.assign({}, record)
        const changedValues: TableChangeValueProperties[] | undefined = clone[this.propertyAccessKey]?.changedValues
        if (changedValues?.length) {
          changedValues.forEach((changedValue: TableChangeValueProperties) => {
            clone[changedValue.field] = changedValue.changes
          })
        }

        if (!withProps) delete clone[this.propertyAccessKey]

        return clone
      })
  }

  /**
   * @description Getting changes of specific data by row index
   * @param rowIdx
   * @returns {TableChangeValueProperties[]} changed value properties
   */
  getChangesByRowIdx(rowIdx: number): TableChangeValueProperties[] | null {
    return this._data[rowIdx]?.[this.propertyAccessKey]?.changedValues || null
  }

  /**
   * @description Returning changed data with non changed field of data as well
   * @param withProps Whether this.propertyAccessKey of data is involved or not
   * @returns {TableData[]}
   */
  getChanged(withProps: boolean = false): TableData[] {
    let changedData: TableData[] = this.getDataByStatus(DataStatus.Changed, true)
    return changedData.map((record: TableData) => {
      let clone: TableData = Object.assign({}, record)
      const changedValues: TableChangeValueProperties[] | undefined = clone[this.propertyAccessKey]?.changedValues
      if (changedValues?.length) {
        changedValues.forEach((changedValue: TableChangeValueProperties) => {
          clone[changedValue.field] = changedValue.changes
        })
      }

      if (!withProps) delete clone[this.propertyAccessKey]
      return clone
    })
  }

  /**
   * @description Returning changed data with only changed fields of data
   * @returns {TableData[]}
   */
  getChangedOnly(): TableData[] {
    const changedData: TableData = this.getDataByStatus(DataStatus.Changed, true)
    return changedData.map((record: TableData) => {
      let extractedRecord = record?.[this.propertyAccessKey]?.changedValues?.reduce(
        (changedData: TableData, changedValue: TableChangeValueProperties): TableData => {
          changedData[changedValue.field] = changedValue.changes
          return changedData
        },
        {}
      )

      return {
        ...this.getPrimaryField(record),
        ...extractedRecord,
      }
    })
  }

  /**
   * @description Returning appended data (Newly added)
   * @param withProps Whether this.propertyAccessKey of data is involved or not
   * @returns {TableData[]}
   */
  getAppended(withProps: boolean = false): TableData[] {
    return this.getDataByStatus(DataStatus.Appended, withProps)
  }

  /**
   * @description Returning deleted data
   * (Appended data will be deleted automatically when user press delete button (If key map is configured  as default)
   * but the deleting target data is not appended one, it will change the status of data and user can get those data by this function
   * @param withProps Whether this.propertyAccessKey of data is involved or not
   * @returns {TableData[]}
   */
  getDeleted(withProps: boolean = false): TableData[] {
    return this.getDataByStatus(DataStatus.Deleted, withProps)
  }

  /**
   * @description Returning data which has status as its status
   * @param status {DataStatus} Status of target data to get
   * @param withProps Whether this.propertyAccessKey of data is involved or not
   * @returns {TableData[]}
   */
  getDataByStatus(status: DataStatus, withProps: boolean = false): TableData[] {
    let filteredData: TableData[] = this._data
      .filter(
        (record: TableData) =>
          record?.[this.propertyAccessKey]?.[status] &&
          Object.keys(record).filter((key: string) => key !== this.propertyAccessKey).length
      )
      .map((record: TableData) => {
        const cloned: TableData = Object.assign({}, record)
        if (!withProps) delete cloned[this.propertyAccessKey]

        const keys: string[] = Object.keys(record)
        keys.forEach((key: string) => {
          if (!cloned[key]) {
            delete cloned[key]
          }
        })

        return cloned
      })

    return filteredData
  }

  /**
   * @description When the columns involves a column which has primary property
   * Returning object of primary key and value pair
   * @param record
   * @returns {TableData}
   */
  private getPrimaryField(record: TableData): TableData {
    const primaryColumn: ColumnConfig | undefined = this.columns.find((column: ColumnConfig) => column.primary)
    if (primaryColumn) {
      return { [primaryColumn.name]: record[primaryColumn.name] }
    } else {
      return {}
    }
  }

  /**
   * @description select true for every current row of indicator.
   */
  selectAll(): void {
    this._data = this._data.map((record: TableData) => {
      if (this.selectable) {
        record = this.stampSelected(record)
        const identifier: string = this.getRecordIdentifier(record)
        this.selectedDataMap.set(identifier, record)
      }

      return record
    })
  }

  /**
   * @description deselect to false for every current row of indicator
   */
  deselectAll(): void {
    this._data = this._data.map((record: TableData) => {
      record = this.stampSelected(record, false)

      if (this.selectable) {
        const identifier: string = this.getRecordIdentifier(record)
        this.selectedDataMap.delete(identifier)
      }

      return record
    })
  }

  /**
   * @description modeChange event handler
   * @param e
   */
  onModeChangeHandler(e: CustomEvent): void {
    this.isEditing = e.detail._isEditing
  }

  /**
   * @description focusChange event handler
   * @param e
   */
  onFocusChangeHandler(e: CustomEvent): void {
    this.focusedCell = e.currentTarget as M2TableCell
    this.focusedRowIdx = this.focusedCell.rowIdx
  }

  /**
   * @description change handler of select input
   * @param e
   */
  onSelectorChangeHandler(e: InputEvent): void {
    const checkbox: HTMLInputElement = e.currentTarget as HTMLInputElement
    const rowIdx: number = Number(checkbox.getAttribute('rowIdx'))
    const checked: boolean = checkbox.checked

    if (checked) {
      this.selectRow(rowIdx)
    } else {
      this.deselectRow(rowIdx)
    }
  }

  onClickHandler(e: MouseEvent) {
    const rowIdx: number = Number((e.currentTarget as HTMLTableRowElement).getAttribute('rowIdx'))

    const doDefaultAction: boolean = this.dispatchEvent(
      new CustomEvent(Events.RowClick, {
        detail: { record: this._data[rowIdx] },
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    )
    if (!doDefaultAction) return

    if (this.selectable?.oneClickSelect) {
      const tableRow: HTMLTableRowElement = e.currentTarget as HTMLTableRowElement
      const isSelected: boolean = tableRow.hasAttribute('selected')

      if (isSelected) {
        this.deselectRow(rowIdx)
      } else {
        this.selectRow(rowIdx)
      }
    }
  }

  onDblClickHandler(e: MouseEvent) {
    this.dispatchEvent(
      new CustomEvent(Events.RowDblClick, {
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    )
  }

  /**
   * @description keypress event handler to fire action by key pressing
   * @param event
   */
  onkeydownHandler(event: KeyboardEvent): void {
    const key: string = event.code
    if (keyMapper(key, KeyActions.MOVE_FOCUSING)) this.moveFocusingKeyHandler(key)
    if (keyMapper(key, KeyActions.SELECT_ROW)) this.selectRowKeyHandler()
    if (keyMapper(key, KeyActions.DELETE_ROW)) this.deleteRowKeyHandler()
  }

  private moveFocusingKeyHandler(key: string) {
    if (this.focusedCell && !this.isEditing) {
      this.moveFocusByKeycode(this.focusedCell, key)
    }
  }

  private selectRowKeyHandler() {
    if (this.focusedCell && this.selectable && !this.isEditing) {
      const rowIdx: number = this.focusedCell.rowIdx
      const isSelected: boolean = this._data[rowIdx]?.[this.propertyAccessKey]?.selected || false
      if (isSelected) {
        this.deselectRow(rowIdx)
      } else {
        this.selectRow(rowIdx)
      }
    }
  }

  private deleteRowKeyHandler() {
    if (this.focusedCell && !this.isEditing) {
      const rowIdx: number = this.focusedCell.rowIdx
      this.deleteRow(rowIdx)
    }
  }

  /**
   * @description Move focussing by pressed key
   * @param focusedCell
   * @param key
   */
  moveFocusByKeycode(focusedCell: M2TableCell, key: string) {
    if (keyMapper(key, KeyActions.MOVE_FOCUSING_LEFT)) {
      this.moveFocusLeft(focusedCell)
    } else if (keyMapper(key, KeyActions.MOVE_FOCUSING_UP)) {
      this.moveFocusUp(focusedCell)
    } else if (keyMapper(key, KeyActions.MOVE_FOCUSING_RIGHT)) {
      this.moveFocusRight(focusedCell)
    } else if (keyMapper(key, KeyActions.MOVE_FOCUSING_DOWN)) {
      this.moveFocusDown(focusedCell)
    }
  }

  /**
   * @description Move focussing from current to left
   * @param focusedCell
   */
  moveFocusLeft(focusedCell: M2TableCell): void {
    const rowIdx: number = focusedCell.rowIdx
    let columnIdx: number = focusedCell.columnIdx - 1

    let rightSideCell: M2TableCell | null = this.getCellByIndex(rowIdx, columnIdx)

    while (rightSideCell) {
      if (!rightSideCell.parentElement?.hidden) {
        rightSideCell.cell.focus()
        break
      }

      rightSideCell = this.getCellByIndex(rowIdx, columnIdx--)
    }
  }

  /**
   * @description Move focussing from current to right
   * @param focusedCell
   */
  moveFocusRight(focusedCell: M2TableCell): void {
    const rowIdx: number = focusedCell.rowIdx
    let columnIdx: number = focusedCell.columnIdx + 1

    let rightSideCell: M2TableCell | null = this.getCellByIndex(rowIdx, columnIdx)

    while (rightSideCell) {
      if (!rightSideCell.parentElement?.hidden) {
        rightSideCell.cell.focus()
        break
      }

      rightSideCell = this.getCellByIndex(rowIdx, columnIdx++)
    }
  }

  /**
   * @description Move focussing from current to up
   * @param focusedCell
   */
  moveFocusUp(focusedCell: M2TableCell): void {
    let rowIdx: number = focusedCell.rowIdx - 1
    const columnIdx: number = focusedCell.columnIdx

    let upperSideCell: M2TableCell | null = this.getCellByIndex(rowIdx, columnIdx)

    while (upperSideCell) {
      if (!upperSideCell.parentElement?.hidden) {
        upperSideCell.cell.focus()
        break
      }

      upperSideCell = this.getCellByIndex(rowIdx--, columnIdx)
    }
  }

  /**
   * @description Move focussing from current to down
   * If there's no more data downside, check the table is addable and if it can create new data row
   * @param focusedCell
   */
  async moveFocusDown(focusedCell: M2TableCell): Promise<void> {
    let rowIdx: number = focusedCell.rowIdx + 1
    const columnIdx: number = focusedCell.columnIdx

    if (rowIdx > this._data.length - 1 && this.addable) {
      await this.appendData()
    }

    let upperSideCell: M2TableCell | null = this.getCellByIndex(rowIdx, columnIdx)

    while (upperSideCell) {
      if (!upperSideCell.parentElement?.hidden) {
        upperSideCell.cell.focus()
        break
      }

      upperSideCell = this.getCellByIndex(rowIdx++, columnIdx)
    }
  }

  /**
   * @description append (push) new row into data of table
   */
  private async appendData(): Promise<void> {
    this._data.push({ [this.propertyAccessKey]: { appended: true } })
    this.setStickyColumnStyle()
    await this.requestUpdate()
  }

  /**
   * @description Delete row by row index if this.removable = true
   * If target row is appended => delete it
   * If target row is not appended one => flag up to be able to user knows (Soft delete)
   * @param rowIdx
   */
  async deleteRow(rowIdx: number): Promise<void> {
    if (this._data[rowIdx]?.[this.propertyAccessKey]?.appended && this._data?.length > 1) {
      this._data.splice(rowIdx, 1)

      if (rowIdx === this._data.length && this.focusedCell) {
        this.moveFocusUp(this.focusedCell)
      }
    } else if (!this._data[rowIdx]?.[this.propertyAccessKey]?.appended) {
      if (this.removable) {
        this._data[rowIdx] = this.getAdjustedDeleted(this._data[rowIdx])
      }
    }

    await this.requestUpdate()
  }

  /**
   * @description Change property of data to notify data is selected
   * @param rowIdx
   */
  selectRow(rowIdx: number): void {
    const { exclusive }: RowSelectorOption = this.selectable
    if (exclusive) {
      const selectedRowElements: HTMLTableRowElement[] = this.getSelectedRowElements()
      if (selectedRowElements?.length) {
        selectedRowElements.forEach((rowElement: HTMLTableRowElement) => {
          const rowIdx: string | null = rowElement.getAttribute('rowIdx')
          if (rowIdx) {
            this.deselectRow(Number(rowIdx))
          }
        })
      }
    }

    const identifier: string = this.getRecordIdentifier(this._data[rowIdx])
    this.selectedDataMap.set(identifier, this._data[rowIdx])
    this._data[rowIdx] = this.stampSelected(this._data[rowIdx])

    this.dispatchEvent(
      new CustomEvent(Events.RowSelected, {
        detail: { record: this._data[rowIdx], rowIdx },
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    )
  }

  /**
   * @description Change property of data back to deselected
   * @param rowIdx
   */
  deselectRow(rowIdx: number): void {
    const identifier: string = this.getRecordIdentifier(this._data[rowIdx])
    this.selectedDataMap.delete(identifier)
    this._data[rowIdx] = this.stampSelected(this._data[rowIdx], false)

    this.dispatchEvent(
      new CustomEvent(Events.RowDeselected, {
        detail: this._data[rowIdx],
        bubbles: true,
        composed: true,
        cancelable: true,
      })
    )
  }

  /**
   * @description valueChange handler from m2-table-cell
   * Update changed value to data
   * @param event
   */
  onValueChangeHandler(event: any): void {
    const field: string = event.detail.field
    const newValue: any = event.detail.newValue
    const rowIdx: number = event.detail.rowIdx

    if (!this._data[rowIdx]?.[this.propertyAccessKey]?.appended) {
      this._data[rowIdx] = this.getAdjustedChanges(this._data[rowIdx], field, newValue)
    } else {
      this._data[rowIdx] = this.getAdjustedAppend(this._data[rowIdx], field, newValue)
    }

    this.requestUpdate()
  }

  private async onEditNextRowHandler(event: any): Promise<void> {
    await this.moveFocusDown(event.detail.cell)
    if (this.focusedCell?.cell) {
      const cell: AbstractM2TableCell<any> = this.focusedCell.cell
      if (cell.checkEditable()) cell.toggleEditing()
    }
  }

  private onEditNextColumnHandler(event: any): void {
    this.moveFocusRight(event.detail.cell)
    if (this.focusedCell?.cell) {
      const cell: AbstractM2TableCell<any> = this.focusedCell.cell
      if (cell.checkEditable()) cell.toggleEditing()
    }
  }

  /**
   * @description Checking new values is changed from origin value
   * And it is changed, update status of record to changed.
   * @param record
   * @param field
   * @param newValue
   */
  getAdjustedChanges(record: TableData, field: string, newValue: any): TableData {
    newValue = this.convertEmptyStringToNull(newValue)

    let changedValues: TableChangeValueProperties[] = record?.[this.propertyAccessKey]?.changedValues || []

    if (changedValues.find((changedValue: TableChangeValueProperties) => changedValue.field === field)) {
      changedValues = changedValues
        .map((changedValue: TableChangeValueProperties) => {
          if (changedValue.field === field && changedValue.origin !== newValue) {
            changedValue.changes = newValue

            return changedValue
          } else if (changedValue.field !== field) {
            return changedValue
          }
        })
        .filter(Boolean) as TableChangeValueProperties[]
    } else {
      changedValues.push({
        field,
        origin: record[field],
        changes: newValue,
      })
    }

    return {
      ...record,
      [this.propertyAccessKey]: {
        ...record[this.propertyAccessKey],
        changed: Boolean(changedValues?.length),
        changedValues,
      },
    }
  }

  /**
   * @description Adjust record status to appended
   * @param record
   * @param field
   * @param appendedValue
   */
  getAdjustedAppend(record: TableData, field: string, appendedValue: any): TableData {
    return {
      ...record,
      [field]: appendedValue,
      [this.propertyAccessKey]: {
        ...record[this.propertyAccessKey],
        appended: true,
      },
    }
  }

  /**
   * @description Adjust record status to deleted (Soft delete)
   * @param record
   */
  getAdjustedDeleted(record: TableData): TableData {
    return {
      ...record,
      [this.propertyAccessKey]: {
        ...record[this.propertyAccessKey],
        deleted: !Boolean(record[this.propertyAccessKey]?.deleted),
      },
    }
  }

  sort(): void {
    if (!this.sortings?.length) {
      this._data = this.data.slice(0)
    } else {
      const cloned: TableData[] = this.data.slice(0)

      this.sortings.forEach((sorting: Sorting) => {
        if (!sorting.desc) {
          // Ascending sort
          cloned.sort((a: TableData, b: TableData) => a[sorting.name] - b[sorting.name])
        } else {
          // Descending sort
          cloned.sort((a: TableData, b: TableData) => b[sorting.name] - a[sorting.name])
        }
      })

      this._data = cloned.slice(0)
    }
  }

  /**
   * @description Returning specific cell by row index and column index
   * @param rowIdx
   * @param columnIdx
   */
  private getCellByIndex(rowIdx: number, columnIdx: number): any {
    return this.renderRoot?.querySelector(`m2-table-cell[rowIdx="${rowIdx}"][columnIdx="${columnIdx}"]`) as M2TableCell
  }

  private convertEmptyStringToNull(value: any): any {
    if (typeof value === 'string' && value === '') {
      return null
    } else {
      return value
    }
  }
}
