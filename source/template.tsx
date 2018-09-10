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
import { Option } from './option';

/**
 * Autocomplete template class.
 */
@Class.Describe()
export class Template extends Control.Component<Properties> {
  /**
   * Autocomplete states.
   */
  @Class.Private()
  private states: States = {
    selection: void 0,
    options: [],
    remote: false,
    delay: 250
  };

  /**
   * Timer Id.
   */
  @Class.Private()
  private timer: any;

  /**
   * Input slot.
   */
  @Class.Private()
  private inputSlot: HTMLSlotElement = <slot name="input" class="input" /> as HTMLSlotElement;

  /**
   * Empty slot.
   */
  @Class.Private()
  private emptySlot: HTMLSlotElement = <slot name="empty" class="empty" /> as HTMLSlotElement;

  /**
   * Error slot.
   */
  @Class.Private()
  private errorSlot: HTMLSlotElement = <slot name="error" class="error" /> as HTMLSlotElement;

  /**
   * Loading slot.
   */
  @Class.Private()
  private loadingSlot: HTMLSlotElement = <slot name="loading" class="loading" /> as HTMLSlotElement;

  /**
   * Results slot.
   */
  @Class.Private()
  private resultsSlot: HTMLSlotElement = <slot name="results" class="results" /> as HTMLSlotElement;

  /**
   * Autocomplete element.
   */
  @Class.Private()
  private autocomplete: HTMLLabelElement = <label class="autocomplete">{this.inputSlot}</label> as HTMLLabelElement;

  /**
   * Autocomplete styles.
   */
  @Class.Private()
  private styles: HTMLStyleElement = (
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
  private skeleton: Element = (
    <div slot={this.properties.slot} class={this.properties.class}>
      {this.children}
    </div>
  ) as Element;

  /**
   * Autocomplete elements.
   */
  @Class.Private()
  private elements: ShadowRoot = DOM.append(this.skeleton.attachShadow({ mode: 'closed' }), this.styles, this.autocomplete) as ShadowRoot;

  /**
   * Selects the specified option.
   * @param option Option information.
   */
  @Class.Private()
  private selectItem(option: Option): void {
    const input = Control.getChildByProperty(this.inputSlot, 'value') as HTMLInputElement;

    if (input) {
      input.value = option.label;
      input.setCustomValidity('');
      delete input.dataset.empty;
    }

    if (this.states.selection) {
      this.states.selection.element.classList.remove('active');
    }

    option.element.classList.add('active');
    this.states.selection = option;
  }

  /**
   * Build the result options list.
   */
  @Class.Private()
  private buildItemList(): void {
    const children = this.resultsSlot.assignedNodes() as HTMLElement[];
    for (const child of children) {
      DOM.clear(child);
      for (const option of this.states.options) {
        DOM.append(child, option.element);
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
   * Close event handler.
   */
  @Class.Private()
  private closeHandler(): void {
    this.close();
  }

  /**
   * Open event handler.
   */
  @Class.Private()
  private openHandler(): void {
    const input = Control.getChildByProperty(this.inputSlot, 'value') as HTMLInputElement;
    if (input && input.value.length) {
      this.close();
      DOM.append(this.autocomplete, this.states.options.length ? this.resultsSlot : this.emptySlot);
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
    if (input && input.value.length) {
      if (this.states.selection) {
        if (this.states.selection.label !== input.value) {
          this.states.selection = void 0;
          input.setCustomValidity('Select an valid option.');
        }
      } else {
        input.setCustomValidity('Select an valid option.');
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(this.notifySearch.bind(this, input), this.delay);
      delete input.dataset.empty;
    } else {
      input.dataset.empty = 'on';
      this.close();
    }
  }

  /**
   * Bind event handlers to update the custom element.
   */
  @Class.Private()
  private bindHandlers(): void {
    document.addEventListener('click', this.closeHandler.bind(this));
    this.skeleton.addEventListener('click', this.preserveHandler.bind(this));
    this.skeleton.addEventListener('focus', this.openHandler.bind(this), true);
    this.skeleton.addEventListener('keyup', this.changeHandler.bind(this), true);
  }

  /**
   * Bind exposed properties to the custom element.
   */
  @Class.Private()
  private bindProperties(): void {
    Object.defineProperties(this.skeleton, {
      type: super.bindDescriptor(this, Template.prototype, 'type'),
      name: super.bindDescriptor(this, Template.prototype, 'name'),
      value: super.bindDescriptor(this, Template.prototype, 'value'),
      empty: super.bindDescriptor(this, Template.prototype, 'empty'),
      search: super.bindDescriptor(this, Template.prototype, 'search'),
      remote: super.bindDescriptor(this, Template.prototype, 'remote'),
      delay: super.bindDescriptor(this, Template.prototype, 'delay'),
      required: super.bindDescriptor(this, Template.prototype, 'required'),
      readOnly: super.bindDescriptor(this, Template.prototype, 'readOnly'),
      disabled: super.bindDescriptor(this, Template.prototype, 'disabled'),
      add: super.bindDescriptor(this, Template.prototype, 'add'),
      clear: super.bindDescriptor(this, Template.prototype, 'clear'),
      close: super.bindDescriptor(this, Template.prototype, 'close'),
      setCustomError: super.bindDescriptor(this, Template.prototype, 'setCustomError'),
      setCustomValidity: super.bindDescriptor(this, Template.prototype, 'setCustomValidity')
    });
  }

  /**
   * Assign all element properties.
   */
  @Class.Private()
  private assignProperties(): void {
    Control.assignProperties(this, this.properties, ['type', 'name', 'value', 'remote', 'delay', 'required', 'readOnly', 'disabled']);
    this.changeHandler();
  }

  /**
   * Default constructor.
   * @param properties Autocomplete properties.
   * @param children Autocomplete children.
   */
  constructor(properties?: Properties, children?: any[]) {
    super(properties, children);
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
  public get value(): Selection | undefined {
    const selection = this.states.selection;
    return selection ? { label: selection.label, value: selection.value, group: selection.group } : void 0;
  }

  /**
   * Set autocomplete value.
   */
  public set value(input: Selection | undefined) {
    this.states.selection = void 0;
    if (input) {
      for (const option of this.states.options) {
        if (option.value === input.value) {
          this.selectItem(option);
          break;
        }
      }
      if (!this.states.selection) {
        this.add(input.label, input.value, input.group);
        this.selectItem(this.states.options[this.states.options.length - 1]);
      }
    }
  }

  /**
   * Get empty state.
   */
  @Class.Public()
  public get empty(): any {
    return this.value === void 0;
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
   * Adds the specified option into the autocompletion results.
   * @param label Option text label.
   * @param value Option value.
   * @param group Option group.
   * @returns Returns the generated option element.
   */
  @Class.Public()
  public add(label: string, value: string, group?: string): HTMLDivElement {
    const element = <div class="item">{label || value}</div> as HTMLDivElement;
    const option = { element: element, value: value, label: label, group: group };

    this.states.options.push(option);
    this.close();

    DOM.append(this.autocomplete, this.resultsSlot);
    this.buildItemList();

    option.element.addEventListener('click', () => {
      this.selectItem(option);
      this.close();
    });

    return option.element;
  }

  /**
   * Clear all search results.
   */
  @Class.Public()
  public clear(): void {
    this.states.options = [];
    this.close();
    DOM.append(this.autocomplete, this.emptySlot);
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
    this.states.options = [];
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
