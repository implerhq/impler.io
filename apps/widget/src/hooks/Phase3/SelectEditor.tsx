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
    const highlighted = this.selectUl.querySelector('li.highlighted');
    if (highlighted) {
      highlighted.classList.remove('highlighted');
    }
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
    const firstOption = this.selectUl.querySelector('li.option');
    if (firstOption) {
      firstOption.classList.add('highlighted');
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
  prepareOptions(options: string[], search?: string) {
    this.selectUl.innerHTML = '';

    if (!options || !options.length) return;

    let filteredOptions = options;
    if (search) {
      filteredOptions = options.filter((key) => key.toLowerCase().includes(search.toLowerCase()));
    }

    filteredOptions.forEach((key) => {
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
    const firstOption = this.selectUl.querySelector('li.option');
    if (firstOption) {
      firstOption.classList.add('highlighted');
    }
  }
  search() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

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

  highlightNextOption() {
    const options = Array.from(this.selectUl.querySelectorAll('li.option'));
    if (!options.length) return;

    const currentIndex = options.findIndex((option) => {
      const liOption = option as HTMLLIElement;

      return liOption.classList.contains('highlighted');
    });

    const nextIndex = currentIndex >= options.length - 1 ? 0 : currentIndex + 1;
    this.updateHighlight(options, currentIndex, nextIndex);
  }

  highlightPreviousOption() {
    const options = Array.from(this.selectUl.querySelectorAll('li.option'));
    if (!options.length) return;

    const currentIndex = options.findIndex((option) => {
      const liOption = option as HTMLLIElement;

      return liOption.classList.contains('highlighted');
    });
    const previousIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
    this.updateHighlight(options, currentIndex, previousIndex);
  }

  updateHighlight(options, currentIndex, newIndex) {
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
      this.selectInput.value = highlighted.dataset.value;
      this.finishEditing();
    } else {
      // If no option is highlighted, select the first option
      const firstOption = this.selectUl.querySelector('li.option');
      if (firstOption) {
        this.selectInput.value = firstOption.dataset.value;
        this.finishEditing();
      }
    }
  }
}
