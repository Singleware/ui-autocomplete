/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as DOM from '@singleware/jsx';
import * as Control from '@singleware/ui-control';

import { Properties } from './properties';
import { Selection } from './selection';
import { Element } from './element';
import { States } from './states';
import { Item } from './item';

/**
 * Autocomplete template class.
 */
@Class.Describe()
export class Template extends Control.Component<Properties> {
  /**
   * Autocomplete states.
   */
  @Class.Private()
  private states = {
    selection: void 0,
    items: [],
    remote: false,
    delay: 250
  } as States;

  /**
   * Timer Id.
   */
  @Class.Private()
  private timer: any;

  /**
   * Input slot.
   */
  @Class.Private()
  private inputSlot = <slot name="input" class="input" /> as HTMLSlotElement;

  /**
   * Empty slot.
   */
  @Class.Private()
  private emptySlot = <slot name="empty" class="empty" /> as HTMLSlotElement;

  /**
   * Error slot.
   */
  @Class.Private()
  private errorSlot = <slot name="error" class="error" /> as HTMLSlotElement;

  /**
   * Loading slot.
   */
  @Class.Private()
  private loadingSlot = <slot name="loading" class="loading" /> as HTMLSlotElement;

  /**
   * Results slot.
   */
  @Class.Private()
  private resultsSlot = <slot name="results" class="results" /> as HTMLSlotElement;

  /**
   * Autocomplete element.
   */
  @Class.Private()
  private autocomplete = <label class="autocomplete">{this.inputSlot}</label> as HTMLLabelElement;

  /**
   * Autocomplete styles.
   */
  @Class.Private()
  private styles = (
    <style>
      {`:host > .autocomplete {
  display: flex;
  flex-direction: column;
  position: relative;
  height: inherit;
  width: inherit;
}
:host > .autocomplete > .empty::slotted(*),
:host > .autocomplete > .error::slotted(*),
:host > .autocomplete > .loading::slotted(*),
:host > .autocomplete > .results::slotted(*) {
  display: block;
  position: absolute;
  border: 0.0625rem solid black;
  top: 100%;
  width: 100%;
  z-index: 1;
}`}
    </style>
  ) as HTMLStyleElement;

  /**
   * Autocomplete skeleton.
   */
  @Class.Private()
  private skeleton = (
    <div slot={this.properties.slot} class={this.properties.class}>
      {this.children}
    </div>
  ) as Element;

  /**
   * Invalidates the specified input element.
   * @param input Input element.
   */
  @Class.Private()
  private invalidateField(input: HTMLInputElement): void {
    input.setCustomValidity('Select a valid item.');
    input.dataset.invalid = 'on';
    delete input.dataset.valid;
  }

  /**
   * Validates the specified input element.
   * @param input Input element.
   */
  @Class.Private()
  private validateField(input: HTMLInputElement): void {
    input.setCustomValidity('');
    input.dataset.valid = 'on';
    delete input.dataset.invalid;
  }

  /**
   * Selects the specified item into the specified input element.
   * @param input Input element.
   * @param item Item information.
   */
  @Class.Private()
  private selectInputItem(input: HTMLInputElement, item: Item): void {
    if (input) {
      input.value = item.label;
      this.validateField(input);
      delete input.dataset.empty;
    }
    if (this.states.selection) {
      delete this.states.selection.element.dataset.checked;
    }
    item.element.dataset.checked = 'on';
    this.states.selection = item;
  }

  /**
   * Selects the specified item.
   * @param item Item information.
   */
  @Class.Private()
  private selectItem(item: Item): void {
    const input = Control.getChildByProperty(this.inputSlot, 'value') as HTMLInputElement;
    this.selectInputItem(input, item);
  }

  /**
   * Build the result items list.
   */
  @Class.Private()
  private buildItemList(): void {
    const children = this.resultsSlot.assignedNodes() as HTMLElement[];
    for (const child of children) {
      DOM.clear(child);
      for (const item of this.states.items) {
        DOM.append(child, item.element);
      }
    }
  }

  /**
   * Notify input searches.
   * @param input Input element.
   */
  @Class.Private()
  private notifySearch(input: HTMLInputElement): void {
    this.close();
    if (input.value.length) {
      DOM.append(this.autocomplete, this.remote ? this.loadingSlot : this.emptySlot);
      this.skeleton.dispatchEvent(new Event('search', { bubbles: true, cancelable: false }));
    }
  }

  /**
   * Focus event handler.
   */
  @Class.Private()
  private focusHandler(): void {
    const input = Control.getChildByProperty(this.inputSlot, 'value') as HTMLInputElement;
    if (input && input.value.length) {
      this.close();
      DOM.append(this.autocomplete, this.states.items.length ? this.resultsSlot : this.emptySlot);
    }
  }

  /**
   * Preserve event handler.
   * @param event Event information.
   */
  @Class.Private()
  private preserveHandler(event: Event): void {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
  }

  /**
   * Change event handler.
   */
  @Class.Private()
  private changeHandler(): void {
    const input = Control.getChildByProperty(this.inputSlot, 'value') as HTMLInputElement;
    if (input) {
      if (input.value.length) {
        if (this.states.selection) {
          if (this.states.selection.label !== input.value) {
            this.states.selection = void 0;
            this.invalidateField(input);
          }
        } else {
          this.invalidateField(input);
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(this.notifySearch.bind(this, input), this.delay);
        delete input.dataset.empty;
      } else {
        input.dataset.empty = 'on';
        this.close();
      }
    }
  }

  /**
   * Bind event handlers to update the custom element.
   */
  @Class.Private()
  private bindHandlers(): void {
    document.addEventListener('click', this.close.bind(this));
    this.skeleton.addEventListener('click', this.preserveHandler.bind(this));
    this.skeleton.addEventListener('focus', this.focusHandler.bind(this), true);
    this.skeleton.addEventListener('keyup', this.changeHandler.bind(this), true);
  }

  /**
   * Bind exposed properties to the custom element.
   */
  @Class.Private()
  private bindProperties(): void {
    this.bindComponentProperties(this.skeleton, [
      'type',
      'name',
      'value',
      'empty',
      'search',
      'remote',
      'delay',
      'required',
      'readOnly',
      'disabled',
      'add',
      'clear',
      'open',
      'close',
      'setCustomError',
      'setCustomValidity'
    ]);
  }

  /**
   * Assign all element properties.
   */
  @Class.Private()
  private assignProperties(): void {
    this.assignComponentProperties(this.properties, ['type', 'name', 'value', 'remote', 'delay', 'required', 'readOnly', 'disabled']);
    this.changeHandler();
  }

  /**
   * Default constructor.
   * @param properties Autocomplete properties.
   * @param children Autocomplete children.
   */
  constructor(properties?: Properties, children?: any[]) {
    super(properties, children);
    DOM.append(this.skeleton.attachShadow({ mode: 'closed' }), this.styles, this.autocomplete);
    this.bindHandlers();
    this.bindProperties();
    this.assignProperties();
  }

  /**
   * Get autocomplete name.
   */
  @Class.Public()
  public get name(): string {
    return Control.getChildProperty(this.inputSlot, 'name');
  }

  /**
   * Set autocomplete name.
   */
  public set name(name: string) {
    Control.setChildProperty(this.inputSlot, 'name', name);
  }

  /**
   * Get autocomplete type.
   */
  @Class.Public()
  public get type(): string {
    return Control.getChildProperty(this.inputSlot, 'type');
  }

  /**
   * Set autocomplete type.
   */
  public set type(type: string) {
    Control.setChildProperty(this.inputSlot, 'type', type);
  }

  /**
   * Get autocomplete value.
   */
  @Class.Public()
  public get value(): string | undefined {
    return this.states.selection ? this.states.selection.value : void 0;
  }

  /**
   * Set autocomplete value.
   */
  public set value(value: string | undefined) {
    const input = Control.getChildByProperty(this.inputSlot, 'value') as HTMLInputElement;
    this.states.selection = void 0;
    for (const current of this.states.items) {
      if (current.value === value) {
        this.selectInputItem(input, current);
        return;
      }
    }
    if (!this.states.selection) {
      input.dataset.empty = 'on';
    }
  }

  /**
   * Get selected item.
   */
  @Class.Public()
  public get selected(): Selection | undefined {
    const selection = this.states.selection;
    if (selection) {
      return { label: selection.label, value: selection.value, group: selection.group };
    }
    return void 0;
  }

  /**
   * Get empty state.
   */
  @Class.Public()
  public get empty(): any {
    return this.selected === void 0;
  }

  /**
   * Get search value.
   */
  @Class.Public()
  public get search(): any {
    return Control.getChildProperty(this.inputSlot, 'value');
  }

  /**
   * Get remote state.
   */
  @Class.Public()
  public get remote(): boolean {
    return this.states.remote;
  }

  /**
   * Set remote state.
   */
  public set remote(state: boolean) {
    this.states.remote = state;
  }

  /**
   * Get delay state.
   */
  @Class.Public()
  public get delay(): number {
    return this.states.delay;
  }

  /**
   * Set delay state.
   */
  public set delay(milliseconds: number) {
    this.states.delay = milliseconds;
  }

  /**
   * Get required state.
   */
  @Class.Public()
  public get required(): boolean {
    return Control.getChildProperty(this.inputSlot, 'required');
  }

  /**
   * Set required state.
   */
  public set required(state: boolean) {
    Control.setChildProperty(this.inputSlot, 'required', state);
  }

  /**
   * Get read-only state.
   */
  @Class.Public()
  public get readOnly(): boolean {
    return Control.getChildProperty(this.inputSlot, 'readOnly');
  }

  /**
   * Set read-only state.
   */
  public set readOnly(state: boolean) {
    Control.setChildProperty(this.inputSlot, 'readOnly', state);
    if (state) {
      this.close();
    }
  }

  /**
   * Get disabled state.
   */
  @Class.Public()
  public get disabled(): boolean {
    return Control.getChildProperty(this.inputSlot, 'disabled');
  }

  /**
   * Set disabled state.
   */
  public set disabled(state: boolean) {
    Control.setChildProperty(this.inputSlot, 'disabled', state);
    if (state) {
      this.close();
    }
  }

  /**
   * Autocomplete element.
   */
  @Class.Public()
  public get element(): Element {
    return this.skeleton;
  }

  /**
   * Adds the specified item into the autocompletion results.
   * @param label Item text label.
   * @param value Item value.
   * @param group Item group.
   * @returns Returns the generated item element.
   */
  @Class.Public()
  public add(label: string, value: string, group?: string): HTMLDivElement {
    const element = <div class="item">{label || value}</div> as HTMLDivElement;
    const item = { element: element, value: value, label: label, group: group };
    item.element.addEventListener('click', () => {
      this.close();
      this.selectItem(item);
      this.skeleton.dispatchEvent(new Event('change', { bubbles: true, cancelable: false }));
    });
    this.states.items.push(item);
    if (this.value === value) {
      this.selectItem(item);
    }
    return item.element;
  }

  /**
   * Clear all search results.
   */
  @Class.Public()
  public clear(): void {
    this.states.items = [];
    this.close();
    DOM.append(this.autocomplete, this.emptySlot);
  }

  /**
   * Opens the autocompletion panel.
   */
  @Class.Public()
  public open(): void {
    this.close();
    if (this.states.items.length) {
      DOM.append(this.autocomplete, this.resultsSlot);
      this.buildItemList();
    } else {
      DOM.append(this.autocomplete, this.emptySlot);
    }
  }

  /**
   * Closes the autocompletion panel.
   */
  @Class.Public()
  public close(): void {
    this.emptySlot.remove();
    this.errorSlot.remove();
    this.loadingSlot.remove();
    this.resultsSlot.remove();
  }

  /**
   * Set the custom error message.
   * @param error Custom error message or element.
   */
  @Class.Public()
  public setCustomError(error: JSX.Element): void {
    this.states.items = [];
    this.close();
    DOM.append(this.autocomplete, this.errorSlot);
    const children = this.errorSlot.assignedNodes() as HTMLElement[];
    for (const child of children) {
      DOM.append(DOM.clear(child), error);
    }
  }

  /**
   * Set the custom validity error message.
   * @param error Custom error message.
   */
  @Class.Public()
  public setCustomValidity(error?: string): void {
    const input = Control.getChildByProperty(this.inputSlot, 'setCustomValidity');
    if (input) {
      (input as any).setCustomValidity(error);
    }
  }
}
