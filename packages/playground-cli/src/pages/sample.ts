import '@m2-modules/dialog'
import '@m2-modules/tag-iframe'
import '@m2-modules/wysiwyg'

import { CSSResult, LitElement, PropertyValues, TemplateResult, css, customElement, html, property } from 'lit-element'
import {
  ColumnAlign,
  ColumnConfig,
  ColumnTypes,
  M2Table,
  M2TableFetchResult,
  M2TableStringCell,
  TableData,
} from '@m2-modules/table'
import { Dialog, closeDialog, openDialog } from '@m2-modules/dialog'

import { ExImport } from '@m2-modules/eximport'
import { connect } from 'pwa-helpers/connect-mixin'
import { navigate } from '@m2-modules/router'
import { store } from '@m2-modules/redux-manager'

interface User {
  id?: string
  name?: string
}

interface Setting {
  id?: string
  name?: string
  category?: string
  description?: string
  value?: string
  createdAt?: string
  creator?: User
  updatedAt?: string
  updater?: User
}
@customElement('sample-page')
export class Sample extends connect(store)(LitElement) {
  @property({ type: Array }) columns: ColumnConfig[] = [
    {
      name: 'img',
      header: '이미지',
      type: ColumnTypes.Image,
      editable: true,
      styles: { margin: 'auto' },
    },
    {
      name: 'name name name name name name name',
      header: '설정 이름',
      type: ColumnTypes.String,
      width: 40,
      hidden: false,
      editable: true,
      align: ColumnAlign.Center,
      tooltip: 'Tool tip test',
    },
    {
      name: 'category',
      header: '설정 유형',
      type: ColumnTypes.Select,
      options: [
        { display: 'Seller setting', value: 'SELLER_SETTING' },
        { display: 'Supplier setting', value: 'SUPPLIER_SETTING' },
      ],
      width: 140,
      hidden: false,
      editable: true,
      align: ColumnAlign.Center,
      displayValue: (config: ColumnConfig, record: TableData, value: string, changedRecord: TableData) => {
        return `Category: ${value}`
      },
      batchEditable: true,
    },
    {
      name: 'Integer',
      header: 'Integer',
      type: ColumnTypes.Integer,
      width: 150,
      min: 10,
      hidden: true,
      editable: true,
      align: ColumnAlign.Right,
    },
    {
      name: 'description',
      header: '설정 설명',
      type: ColumnTypes.String,
      width: 300,
      hidden: false,
      editable: true,
      align: ColumnAlign.Left,
      batchEditable: true,
      tooltip: 'Description tooltip',
      sortable: true,
    },
    {
      name: 'dynamicEditable',
      header: 'dynamic editable column',
      type: ColumnTypes.String,
      width: 30,
      editable: (config: ColumnConfig, record: TableData, value: any): boolean =>
        Number(record?.name.replace('Setting ', '')) % 2 === 0,
      batchEditable: true,
    },
    {
      name: 'a-z only looooooong header',
      type: ColumnTypes.String,
      width: 30,
      validator: /^[a-z]+$/,
      batchEditable: true,
      tooltip: 'asdf',
    },
    {
      name: 'value',
      header: '필수 설정 값',
      type: ColumnTypes.String,
      width: 200,
      hidden: false,
      editable: true,
      required: true,
      align: ColumnAlign.Left,
    },
    {
      name: 'hidden',
      header: '숨김',
      type: ColumnTypes.Boolean,
      width: 60,
      align: ColumnAlign.Center,
      editable: true,
    },
    {
      name: 'updatedAt',
      header: '수정일시',
      width: 180,
      hidden: false,
      type: ColumnTypes.Date,
      align: ColumnAlign.Center,
      editable: true,
    },
    {
      name: 'updater',
      header: '수정자',
      width: 200,
      hidden: false,
      type: ColumnTypes.Object,
      align: ColumnAlign.Center,
      editable: false,
    },
  ]

  @property({ type: Array }) data: Setting[] = []

  @property({ type: String }) route: string = location.pathname.replace(/^\//, '')

  get table(): M2Table {
    const table: M2Table | null = this.renderRoot?.querySelector('m2-table')
    if (!table) throw new Error('Failed to find table')

    return table
  }

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 10px;
        }
        .button-container {
          display: grid;
          grid-gap: 10px;
          grid-template-columns: repeat(4, 1fr);
        }
      `,
    ]
  }

  render(): TemplateResult {
    return html`
      <h2>M2 Table</h2>
      <m2-table
        .maxColumnWidth="${350}"
        .selectable="${false}"
        .numbering="${false}"
        .columns="${this.columns}"
        .addable="${false}"
        .fetchHandler="${this.generateRandomData as any}"
        @valueChange="${(e: CustomEvent) => {
          console.log(e.detail)
          if (e.detail.field === 'name' && !e.detail.value) {
            this.table
              .getCell<M2TableStringCell>(e.detail.rowIdx, 'description')
              .setValue('Please type proper name on this row')
          }
        }}"
        @validationFailed="${(e: CustomEvent) => alert(e.detail.error)}"
        .enableBulkEdit="${true}"
        .fixedColumnCount="${2}"
      ></m2-table>

      <div class="button-container">
        <button @click="${this.refreshData}">Refresh</button>
        <button @click="${this.getParams}">Get Params</button>
        <button @click="${this.openRandomDialog}">Open Random Dialog</button>
        <button @click="${() => navigate('demos')}">Navigate to Somewhere without query string</button>
        <button @click="${() => navigate('demos?query-str=value')}">Navigate to Somewhere with query string</button>
        <button @click="${() => ExImport.export('sample', this.data, 'xlsx')}">Export</button>
        <button
          @click="${async () => {
            const result: Record<string, any> = await ExImport.import(['xls', 'xlsx'])
            console.log(result)
          }}"
        >
          Import
        </button>
        <button @click="${this.openAdvEditor}">Open Advanced Editor</button>
      </div>

      <h2>Tag iframe</h2>
      <iframe style="border: none;" is="tag-iframe">
        <html>
          <head>
            <style>
              html,
              body {
                margin: 0px;
              }
              #container {
                background-color: tomato;
                margin: 50px auto;
                width: 400px;
                height: 200px;
                overflow: auto;
              }
              #header {
                background-color: skyblue;
                position: absolute;
                width: inherit;
              }
            </style>
          </head>

          <body>
            <div id="container">
              <div id="header">Header</div>

              <ul>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
                <li>Item</li>
              </ul>
            </div>
          </body>
        </html>
      </iframe>

      <m2-dialog></m2-dialog>
    `
  }

  updated(changedProps: PropertyValues): void {
    if (changedProps.has('route')) {
      if (this.route !== location.pathname.replace(/^\//, '')) {
        window.history.pushState('', '', this.route)
      }
    }
  }

  generateRandomData(page: number = 1, limit: number = 10): M2TableFetchResult {
    const settings: Setting[] = new Array(limit).fill('').map((_: void, idx: number) => {
      return {
        name: 'Setting ' + ((page - 1) * limit + idx + 1),
        description: 'Setting description ' + ((page - 1) * limit + idx + 1),
        value: 'Setting value ' + ((page - 1) * limit + idx + 1),
        'a-z only': '유효하지 않은 값',
        updatedAt: Date.now().toString(),
        updater: { name: 'Setting Updater' },
      }
    })

    return { data: settings, total: 5000 }
  }

  refreshData(): void {
    const tempData: Record<string, any>[] = this.data.splice(0)
    this.data = []
    this.data = tempData
  }

  getParams(): void {
    console.log('Appended', this.table?.getAppended<Setting>())
    console.log('Changed Only', this.table?.getChangedOnly<Setting>())
    console.log('Changed', this.table?.getChanged<Setting>())
    console.log('Deleted', this.table?.getDeleted<Setting>())
  }

  openRandomDialog() {
    openDialog({
      templateRenderer: {
        header: (html: any, dialog: Dialog) => {
          return html`<button @click="${() => closeDialog(dialog)}">X</button>`
        },
        content: (html: any) => {
          return html`<h2>Dialog Content</h2>`
        },
      },
    })
  }

  openAdvEditor() {
    openDialog({
      templateRenderer: {
        header: (html: any, dialog: Dialog) => html`<button @click="${() => closeDialog(dialog)}">X</button>`,
        content: (html: any) => html`<m2-wysiwyg></m2-wysiwyg>`,
      },
    })
  }

  stateChanged(state: any) {
    this.route = state.route?.route
  }
}
