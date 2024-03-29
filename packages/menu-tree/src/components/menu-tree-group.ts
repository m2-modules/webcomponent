import { AccessKeyMapper, MenuItem } from '../interfaces'
import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element'

import { connect } from 'pwa-helpers/connect-mixin'
import { store } from '@m2-modules/redux-manager'

@customElement('menu-tree-group')
export class MenuTreeGroup extends connect(store)(LitElement) {
  @property({ type: String }) text: string = ''
  @property({ type: Object }) accessKeyMapper: AccessKeyMapper = {
    text: 'name',
    routing: 'routing',
    subMenus: 'menus',
  }
  @property({ type: Array }) subMenus: MenuItem[] = []
  @property({ type: Boolean }) opened: boolean = false
  @property({ type: Object }) router?: Function

  static get styles(): CSSResult {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        background-color: green;
      }
      ul > * {
        display: none;
      }
      ul[opened] > * {
        display: inherit;
      }
    `
  }

  render(): TemplateResult {
    return html`
      <ul
        ?opened="${this.opened}"
        @click="${(e: MouseEvent): void => {
          e.stopPropagation()
          this.opened = !this.opened
        }}"
      >
        ${this.text}
        ${this.subMenus.map(
          (menu: any): TemplateResult =>
            menu[this.accessKeyMapper.subMenus]?.length
              ? html`<menu-tree-group
                  .text="${menu[this.accessKeyMapper.text]}"
                  .subMenus="${menu[this.accessKeyMapper.subMenus]}"
                  .accessKeyMapper="${this.accessKeyMapper}"
                  .router="${this.router}"
                ></menu-tree-group>`
              : html`<menu-tree-item
                  .menu="${menu}"
                  .text="${menu[this.accessKeyMapper.text]}"
                  .routing="${menu[this.accessKeyMapper.routing]}"
                  .router="${this.router}"
                ></menu-tree-item>`
        )}
      </ul>
    `
  }
}
