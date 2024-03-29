import { CSSResult, css } from 'lit-element'

export const commonStyle: CSSResult = css`
  .selector {
    text-align: center;
    width: var(--m2-table-selector-width, 30px);
  }
  .numbering {
    width: var(--m2-table-numbering-width, 30px);
    position: sticky;
  }
  [sticky] {
    position: sticky;
    outline: 1px dashed transparent;
  }
`

export const headerStyle: CSSResult = css`
  :host {
    display: table-header-group;
    width: max-content;
    position: sticky;
    top: 0px;
    z-index: 5;
    border-bottom: var(--m2-table-header-border-bottom, 1px double gray);
  }
  :host > * {
    font-size: var(--m2-table-header-font-size, 12px);
    color: var(--m2-table-header-font-color, white);
  }
  :host .header-numbering {
    width: var(--m2-table-row-number-width, 30px);
  }
  button {
    visibility: hidden;
    display: flex;
    padding: var(--m2-table-button-padding, 0px);
    margin: var(--m2-table-button-margin, 0px);
    width: var(--m2-table-button-width, 20px);
    height: var(--m2-table-button-height, 20px);
  }
  thead {
    position: sticky;
    top: var(--m2-table-header-row-height, 30px);
  }
  tr {
    height: var(--m2-table-header-row-height, 30px);
    background-color: var(--m2-table-header-bg-color, darkgray);
  }
  th {
    box-sizing: border-box;
    padding: var(--m2-table-cell-padding, 5px);
    border-right-width: var(--m2-table-splitter-width, 2px);
    border-right-color: var(--m2-table-header-splitter-color, white);
    border-right-style: var(--m2-table-header-splitter-style, solid);
    background-color: inherit;
  }
  th[resizable] {
    border-right-color: var(--m2-table-header-splitter-hover-color, lightgreen);
    cursor: ew-resize;
  }
  span.header-text {
    width: inherit;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const headerDisplayStyle: CSSResult = css`
  :host {
    width: inherit;
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  ::slotted(*) {
    width: inherit;
    flex: 1;
  }
  ::slotted(span.header-text) {
    display: block !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  mwc-icon {
    font-size: var(--m2-table-header-icon-font-size, small);
    margin: auto 0px;
  }
  mwc-icon.batch-edit-icon {
    float: left;
  }
  mwc-icon.sort-icon {
    cursor: pointer;
  }
  mwc-icon.sort-icon:hover {
    color: var(--m2-table-sort-icon-hover-color, lightgreen);
  }
  mwc-icon.tooltip-icon {
    float: right;
    cursor: help;
    color: var(--m2-table-tooltip-icon-color, white);
  }
  mwc-icon.tooltip-icon:hover {
    color: var(--m2-table-tooltip-icon-hover-color, lightgreen);
  }
`

export const bodyStyle: CSSResult = css`
  :host {
    display: table-row-group;
    width: max-content;
    flex: 1;
    background-color: var(--m2-table-body-bg-color, lightgray);
  }
  :host > * {
    color: transparent;
    text-shadow: 0 0 0 var(--m2-table-font-color, black);
    font-size: var(--m2-table-font-size, 11px);
  }
  :host .row-numbering {
    text-align: var(--m2-table-row-number-align, right);
    width: var(--m2-table-row-number-width, 30px);
  }
  :host::-webkit-scrollbar {
    display: none;
  }
  tr {
    height: var(--m2-table-row-height, 30px);
  }
  tr[focused] {
    background-color: var(--m2-table-focused-row-bg-color, skyblue) !important;
  }
  tr:nth-child(even) {
    background-color: var(--m2-table-even-row-bg-color, lightgray);
  }
  tr:nth-child(odd) {
    background-color: var(--m2-table-odd-row-bg-color, white);
  }
  tr[appended] {
    background-color: var(--m2-table-appended-row-bg-color, lightblue);
  }
  tr[changed] {
    background-color: var(--m2-table-changed-row-bg-color, lightgreen);
  }
  tr[deleted] {
    background-color: var(--m2-table-deleted-row-bg-color, indianRed);
    text-decoration-line: var(--m2-table-deleted-row-text-decoration, line-through);
  }
  tr[selected] {
    background-color: var(--m2-table-selected-row-bg-color, yellow);
    font-style: var(--m2-table-selected-font-style, italic);
  }
  td {
    box-sizing: border-box;
    padding: var(--m2-table-cell-padding, 5px);
    border-right-width: var(--m2-table-splitter-width, 2px);
    border-right-color: var(--m2-table-body-splitter-color, darkgray);
    border-right-style: var(--m2-table-body-splitter-style, dotted);
    background-color: inherit;
  }
  td,
  span {
    font-size: inherit;
  }
  button {
    display: flex;
    padding: var(--m2-table-button-padding, 0px);
    margin: var(--m2-table-button-margin, 0px);
    width: var(--m2-table-button-width, 20px);
    height: var(--m2-table-button-height, 20px);
    background: var(--m2-table-button-bg-color, transparent);
    border: var(--m2-table-button-border, none);
    border-radius: var(--m2-table-button-border-radius, none);
    outline: none;
  }
  button:hover {
    background: var(--m2-table-button-hover-bg-color, inherit);
    border: var(--m2-table-button-hover-border, none);
  }
`

export const tableCellStyle: CSSResult = css`
  :host {
    display: flex;
    outline: none;
    width: inherit;
  }
`

export const cellStyle: CSSResult = css`
  :host {
    flex: 1;
    display: grid;
    outline: none;
    border: 0px;
    width: inherit;
    border: 1px solid transparent;
  }
  :host(:focus) {
    border: 1px dashed gray;
  }
  :host > * {
    margin: auto 0;
    overflow: hidden;
    white-space: nowrap;
    outline: none;
    border: none;
    background-color: transparent;
  }
  :host > img {
    margin: auto;
  }
  :host([invalid]) {
    background-color: var(--m2-table-cell-invalid-bg-color, inherit);
    border-width: var(--m2-table-cell-invalid-border-width, 0px 0px 1px 0px);
    border-style: var(--m2-table-cell-invalid-border-style, dashed);
    border-color: var(--m2-table-cell-invalid-border-color, tomato);
  }
  :host(.align-left) .dsp-cell > span {
    margin: auto auto auto 0px;
  }
  :host(.align-right) .dsp-cell > span {
    margin: auto 0px auto auto;
  }
  :host(.align-center) .dsp-cell > span {
    margin: auto;
  }
  .dsp-cell {
    display: flex;
  }
  .dsp-cell span {
    display: flex;
  }
  input,
  select,
  textarea {
    padding: 0;
    font-size: inherit;
    width: inherit;
  }
  .textarea-container {
    display: flex;
    flex-direction: column;
    height: var(--m2-table-textarea-cell-height, 60px);
  }
  textarea {
    flex: 1;
    resize: none;
  }
  .dsp-cell {
    width: inherit;
  }
  .dsp-cell.textarea {
    white-space: break-spaces;
  }
  .header-edit-icon {
    font-size: var(--m2-table-header-icon-font-size, small);
    margin: auto 5px auto auto;
  }
`

export const indicatorStyle = css`
  #page-indicator {
    margin: var(--m2-table-page-indicator-margin);
    padding: var(--m2-table-page-indicator-padding, 5px);
    font-size: var(--m2-table-page-indicator-font-size, 11px);
    display: flex;
    background-color: var(--m2-table-page-indicator-bg-color, gray);
  }
  #page-controller {
    display: flex;
    padding: var(--m2-table-section-padding, 5px);
    background-color: var(--m2-table-page-controller-bg-color, lightgray);
    border-radius: var(--m2-table-section-border-radius, 5px);
  }
  .move-button {
    margin: var(--m2-table-move-button-margin);
  }
  .move-button > mwc-icon {
    font-size: inherit;
    margin: auto;
  }
  #limit-controller {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 5px;
    margin: auto 0px auto auto;
    padding: var(--m2-table-section-padding, 5px);
    background-color: var(--m2-table-limit-controller-bg-color, lightgray);
    border-radius: var(--m2-table-section-border-radius, 5px);
  }
  #page-info {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 5px;
    margin: auto 0px auto 10px;
    padding: var(--m2-table-section-padding, 5px);
    background-color: var(--m2-table-page-info-bg-color, lightgray);
    border-radius: var(--m2-table-section-border-radius, 5px);
  }
  input {
    outline: none;
    border: none;
    padding: 0px;
    font-size: inherit;
    background-color: transparent;
    width: 30px;
  }
  button {
    padding: 0px;
    display: flex;
    outline: none;
    font-size: inherit;
    background-color: var(--m2-table-indicator-button-bg-color, transparent);
    border: var(--m2-table-indicator-button-border, none);
  }
`
