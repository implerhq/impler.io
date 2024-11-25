import { BaseEditor } from 'handsontable/editors';
import { CellProperties } from 'handsontable/settings';

export class MultiSelectEditor extends BaseEditor {
  [x: string]: any;
  timer: any;
  value: Set<string> = new Set();
  focus() {
    this.selectInput.focus();
  }
  close() {
    this.value = new Set();
    this._opened = false;
    this.listDiv.classList.remove('open');
    if (this.timer) this.hot.rootWindow.clearTimeout(this.timer);
  }
  getValue() {
    return this.value.size ? [...this.value].join(this.cellProperties.delimiter || ',') : undefined;
  }
  setValue(value: string) {
    this.value = new Set(value ? value.split(this.cellProperties.delimiter || ',') : []);
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
  drawOptions(values: Set<string>) {
    values.forEach((value) => {
      this.appendItem(value, false);
    });
    this.selectInput.focus();
  }
  appendItem(value: string, doFocus = true) {
    this.value.add(value);
    const span = this.hot.rootDocument.createElement('span') as HTMLElement;
    span.tabIndex = 0;
    span.setAttribute('role', 'button');
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
    this.value.delete(value);
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
        const valueSelected = this.value.has(key);
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
    input.onkeydown = (e) => {
      e.stopPropagation();

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.highlightNextOption();
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.highlightPreviousOption();
          break;
        case 'Enter':
          e.preventDefault();
          this.selectHighlightedOption();
          break;
        case 'Escape':
          e.preventDefault();
          this.close();
          break;
        default:
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.search();
          }, 200);
      }
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
      // eslint-disable-next-line max-len
      'M7.314 5.9l3.535-3.536A1 1 0 1 0 9.435.95L5.899 4.485 2.364.95A1 1 0 1 0 .95 2.364l3.535 3.535L.95 9.435a1 1 0 1 0 1.414 1.414l3.535-3.535 3.536 3.535a1 1 0 1 0 1.414-1.414L7.314 5.899z'
    );
    crossSvg.appendChild(svgPath);

    this.listDiv = listDiv;
    this.selectInput = input;
    this.inputWrapper = inputWrapper;
    this.crossSvg = crossSvg;

    this.hot.rootElement.appendChild(this.listDiv);
  }

  highlightNextOption() {
    const options = Array.from(this.selectUl.querySelectorAll('li.option'));
    if (!options.length) return;

    const currentIndex = options.findIndex((option: any) => {
      return option.classList.contains('highlighted');
    });

    const nextIndex = currentIndex >= options.length - 1 ? 0 : currentIndex + 1;
    this.updateHighlight(options as any, currentIndex, nextIndex);
  }

  highlightPreviousOption() {
    const options = Array.from(this.selectUl.querySelectorAll('li.option'));
    if (!options.length) return;

    const currentIndex = options.findIndex((option: any) => {
      return option.classList.contains('highlighted');
    });

    const previousIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
    this.updateHighlight(options as any, currentIndex, previousIndex);
  }

  updateHighlight(options: HTMLElement[], currentIndex: number, newIndex: number) {
    if (currentIndex >= 0) {
      options[currentIndex].classList.remove('highlighted');
    }

    if (newIndex >= 0 && newIndex < options.length) {
      options[newIndex].classList.add('highlighted');
      options[newIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  selectHighlightedOption() {
    const highlighted = this.selectUl.querySelector('li.highlighted');
    if (highlighted) {
      const value = highlighted.dataset.value;
      if (this.value.has(value)) {
        this.removeItem(value);
      } else {
        this.appendItem(value);
      }
    }
  }
}
