import { BaseEditor } from 'handsontable/editors';
import { CellProperties } from 'handsontable/settings';

export class MultiSelectEditor extends BaseEditor {
  [x: string]: any;
  timer: any;
  focus() {
    this.selectInput.focus();
  }
  close() {
    this.value = [];
    this._opened = false;
    this.listDiv.classList.remove('open');
    if (this.timer) this.hot.rootWindow.clearTimeout(this.timer);
  }
  getValue() {
    return this.value.join(',');
  }
  setValue(value: string) {
    this.value = value ? value.split(',') : [];
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
    selectStyle.width = `${width}px`;
    selectStyle[this.hot.isRtl() ? 'right' : 'left'] = `${start}px`;
    selectStyle.margin = '0px';
    if (this.value) {
      const items = this.hot.rootDocument.querySelectorAll(`span[data-value]`);
      for (let i = 0; i < items.length; i++) {
        items[i].remove();
      }
      this.drawOptions(this.value);
    }
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
  drawOptions(values: string[]) {
    values.forEach((value) => {
      this.appendItem(value, false);
    });
    this.selectInput.focus();
  }
  appendItem(value: string, doFocus = true) {
    this.value = this.value.concat(value);
    const span = this.hot.rootDocument.createElement('span');
    span.tabIndex = 0;
    span.role = 'button';
    span.classList.add('item');
    span.dataset.value = value;
    span.dataset.displayText = value;
    span.addEventListener('click', () => {
      this.removeItem(value);
    });
    span.appendChild(this.hot.rootDocument.createTextNode(value));
    span.appendChild(this.crossSvg.cloneNode(true));
    this.inputWrapper.insertBefore(span, this.selectInput);

    const liItem = this.hot.rootDocument.querySelector(`li[data-value="${value}"]`);
    if (liItem) liItem.classList.add('selected');
    if (doFocus) this.selectInput.focus();
  }
  removeItem(value: string) {
    this.value = this.value.filter((existingKey) => existingKey !== value);
    const spanBadge = this.hot.rootDocument.querySelector(`span[data-value="${value}"]`);
    if (spanBadge) spanBadge.remove();
    const liItem = this.hot.rootDocument.querySelector(`li[data-value="${value}"]`);
    if (liItem) liItem.classList.remove('selected');
    this.selectInput.focus();
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
      liElement.innerText = key;
      liElement.dataset.value = key;
      liElement.onclick = () => {
        const valueSelected = this.value.includes(key);
        if (valueSelected) this.removeItem(key);
        else this.appendItem(key);
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

    const inputWrapper = this.hot.rootDocument.createElement('div');
    inputWrapper.classList.add('input-wrapper');
    const input = this.hot.rootDocument.createElement('input');
    input.classList.add('dd-searchbox');
    input.type = 'search';
    input.onkeydown = () => {
      this.timer = this.hot.rootWindow.setTimeout(() => {
        this.search();
      }, 250);
    };

    inputWrapper.appendChild(input);
    listDiv.append(inputWrapper);

    const listDropdownWrapper = this.hot.rootDocument.createElement('div');
    listDropdownWrapper.classList.add('list-dropdown');
    this.selectUl = this.hot.rootDocument.createElement('ul');
    listDropdownWrapper.appendChild(this.selectUl);
    listDiv.appendChild(listDropdownWrapper);

    const crossSvg = this.hot.rootDocument.createElementNS('http://www.w3.org/2000/svg', 'svg');
    crossSvg.setAttribute('viewBox', '-6 -6 24 24');
    crossSvg.setAttribute('width', '24');
    crossSvg.setAttribute('height', '24');
    crossSvg.setAttribute('fill', 'currentColor');
    const svgPath = this.hot.rootDocument.createElementNS('http://www.w3.org/2000/svg', 'path');
    svgPath.setAttribute(
      'd',
      'M7.314 5.9l3.535-3.536A1 1 0 1 0 9.435.95L5.899 4.485 2.364.95A1 1 0 1 0 .95 2.364l3.535 3.535L.95 9.435a1 1 0 1 0 1.414 1.414l3.535-3.535 3.536 3.535a1 1 0 1 0 1.414-1.414L7.314 5.899z'
    );
    crossSvg.appendChild(svgPath);

    this.listDiv = listDiv;
    this.selectInput = input;
    this.inputWrapper = inputWrapper;
    this.crossSvg = crossSvg;

    this.hot.rootElement.appendChild(this.listDiv);
  }
}
