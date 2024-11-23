import { BaseEditor } from 'handsontable/editors';
import { CellProperties } from 'handsontable/settings';

export class SelectEditor extends BaseEditor {
  [x: string]: any;
  timer: any;
  focus() {
    this.selectInput.focus();
  }
  close() {
    this._opened = false;
    this.selectInput.value = '';
    this.listDiv.classList.remove('open');
  }
  getValue() {
    return this.selectInput.value;
  }
  setValue(value) {
    this.selectInput.value = value;
  }
  open() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { top, start, width } = this.getEditedCellRect();
    this._opened = true;
    this.selectInput.focus();

    this.listDiv.classList.add('open');
    const selectStyle = this.listDiv.style;

    selectStyle.top = `${top}px`;
    selectStyle.minWidth = `${width}px`;
    selectStyle[this.hot.isRtl() ? 'right' : 'left'] = `${start}px`;
    selectStyle.margin = '0px';
  }
  prepare(
    row: number,
    column: number,
    prop: string | number,
    TD: HTMLTableCellElement,
    originalValue: any,
    cellProperties: CellProperties
  ): void {
    super.prepare(row, column, prop, TD, originalValue, cellProperties);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.prepareOptions(this.cellProperties.selectOptions);
  }
  prepareOptions(options: string[], search?: string) {
    this.selectUl.innerHTML = '';

    if (!options || !options.length) return;

    if (search) {
      options = options.filter((key) => key.toLowerCase().includes(search.toLowerCase()));
    }

    options.forEach((key) => {
      const liElement = this.hot.rootDocument.createElement('li');
      liElement.classList.add('option');
      liElement.dataset.value = key;
      liElement.dataset.displayText = key;
      liElement.innerText = key;
      liElement.onclick = () => {
        this.selectInput.value = key;
        this.finishEditing();
      };
      this.selectUl.appendChild(liElement);
    });
  }
  search() {
    const text = this.selectInput.value;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.prepareOptions(this.cellProperties.selectOptions, text);
  }
  init() {
    const listDiv = this.hot.rootDocument.createElement('div');
    listDiv.classList.add('list-wrapper');

    const input = this.hot.rootDocument.createElement('input');
    input.classList.add('dd-searchbox');
    input.type = 'search';
    input.onkeydown = () => {
      this.timer = setTimeout(() => {
        this.search();
      }, 200);
    };

    listDiv.appendChild(input);

    const listDropdownWrapper = this.hot.rootDocument.createElement('div');
    listDropdownWrapper.classList.add('list-dropdown');
    this.selectUl = this.hot.rootDocument.createElement('ul');
    listDropdownWrapper.appendChild(this.selectUl);
    listDiv.appendChild(listDropdownWrapper);

    this.listDiv = listDiv;
    this.selectInput = input;

    this.hot.rootElement.appendChild(this.listDiv);
  }
}
