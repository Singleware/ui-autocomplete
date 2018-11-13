/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as DOM from '@singleware/jsx';
import * as Control from '@singleware/ui-control';

import { Properties } from './properties';
import { Element } from './element';
import { States } from './states';
import { Render } from './render';
import { Option } from './option';

/**
 * Autocomplete template class.
 */
@Class.Describe()
export class Template<T extends Properties = Properties> extends Control.Component<T> {
  /**
   * Timer Id.
   */
  @Class.Private()
  private timerId: any;

  /**
   * Matched options entities to the options elements.
   */
  @Class.Private()
  private matchedElements = new WeakMap<Option, HTMLElement>();

  /**
   * Autocomplete states.
   */
  @Class.Private()
  private states = {
    options: [],
    selected: void 0,
    preload: false,
    remote: false,
    delay: 250
  } as States;

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
   * Autocomplete dropdown.
   */
  @Class.Private()
  private dropdown = <div class="dropdown" /> as HTMLDivElement;

  /**
   * Autocomplete element.
   */
  @Class.Private()
  private autocomplete = (
    <label class="autocomplete">
      {this.inputSlot}
      {this.dropdown}
    </label>
  ) as HTMLLabelElement;

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
:host > .autocomplete > .dropdown {
  position: absolute;
  width: 100%;
  top: 100%;
  z-index: 1;
}
:host > .autocomplete > .dropdown > .empty::slotted(*),
:host > .autocomplete > .dropdown > .error::slotted(*),
:host > .autocomplete > .dropdown > .loading::slotted(*),
:host > .autocomplete > .dropdown > .results::slotted(*) {
  border: 0.0625rem solid black;
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
    input.setCustomValidity('Select a valid option.');
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
   * Replaces the current dropdown element by the new slot element.
   * @param slot Slot element.
   */
  @Class.Private()
  private replaceDropdown(slot: HTMLSlotElement): void {
    DOM.append(DOM.clear(this.dropdown), slot);
  }

  /**
   * Selects the specified option into the specified input element.
   * @param input Input element.
   * @param option Option entity.
   */
  @Class.Private()
  private selectInputOption(input: HTMLInputElement, option: Option): void {
    if (input) {
      input.value = option.label;
      this.validateField(input);
      delete input.dataset.empty;
    }
    if (this.states.selected) {
      delete (this.matchedElements.get(this.states.selected) as HTMLElement).dataset.active;
    }
    this.states.selected = option;
    (this.matchedElements.get(option) as HTMLElement).dataset.active = 'on';
  }

  /**
   * Selects the specified option.
   * @param option Option entity.
   */
  @Class.Private()
  private selectOption(option: Option): void {
    const input = Control.getChildByProperty(this.inputSlot, 'value') as HTMLInputElement;
    this.selectInputOption(input, option);
  }

  /**
   * Build the options list.
   */
  @Class.Private()
  private buildOptionsList(): void {
    const children = this.resultsSlot.assignedNodes() as HTMLElement[];
    for (const child of children) {
      DOM.clear(child);
      for (const option of this.states.options) {
        DOM.append(child, this.matchedElements.get(option));
      }
    }
  }

  /**
   * Notify any input search.
   * @param input Input element.
   */
  @Class.Private()
  private notifySearch(input: HTMLInputElement): void {
    if (input.value.length) {
      this.replaceDropdown(this.remote ? this.loadingSlot : this.emptySlot);
      this.skeleton.dispatchEvent(new Event('search', { bubbles: true, cancelable: false }));
    } else {
      this.close();
    }
  }

  /**
   * Renders a new option element for the specified option entity.
   * @param option Option entity.
   * @returns Returns the rendered option.
   */
  @Class.Private()
  private renderOption(option: Option): HTMLElement {
    const detail = { input: option, output: void 0 } as Render;
    const event = new CustomEvent<Render>('renderoption', { bubbles: true, cancelable: true, detail: detail });
    if (!this.skeleton.dispatchEvent(event) || !detail.output) {
      return <div class="option">{option.label}</div> as HTMLDivElement;
    }
    return detail.output;
  }

  /**
   * Preload data.
   * @param forced Determines whether the preload must be forced or not.
   */
  @Class.Private()
  private openPreload(forced: boolean): void {
    if (forced || !this.states.options.length) {
      this.states.options = [];
      this.skeleton.dispatchEvent(new Event('preload', { bubbles: true, cancelable: false }));
    }
    if (this.states.options.length) {
      this.open();
    }
  }

  /**
   * Focus event handler.
   */
  @Class.Private()
  private focusHandler(): void {
    const input = Control.getChildByProperty(this.inputSlot, 'value') as HTMLInputElement;
    if (input && (this.states.preload || input.value.length)) {
      if (this.states.preload) {
        this.openPreload(false);
      } else {
        this.open();
      }
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
        if (this.states.selected) {
          if (this.states.selected.label !== input.value) {
            this.states.selected = void 0;
            this.invalidateField(input);
          }
        } else {
          this.invalidateField(input);
        }
        clearTimeout(this.timerId);
        this.timerId = setTimeout(this.notifySearch.bind(this, input), this.delay);
        delete input.dataset.empty;
      } else {
        this.validateField(input);
        this.states.selected = void 0;
        input.dataset.empty = 'on';
        if (this.properties.preload) {
          this.openPreload(true);
        } else {
          this.close();
        }
      }
    }
  }

  /**
   * Render option handler.
   * @param event Event information.
   */
  @Class.Private()
  private renderOptionHandler(event: CustomEvent<Render>): void {
    if (this.properties.onRenderOption) {
      event.detail.output = this.properties.onRenderOption(event.detail.input);
    }
  }

  /**
   * Selects the specified option entity.
   * @param option Option entity.
   */
  @Class.Private()
  private selectOptionHandler(option: Option): void {
    this.close();
    this.selectOption(option);
    this.skeleton.dispatchEvent(new Event('change', { bubbles: true, cancelable: false }));
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
    this.skeleton.addEventListener('renderoption', this.renderOptionHandler.bind(this));
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
      'preload',
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
    this.assignComponentProperties(this.properties, [
      'type',
      'name',
      'value',
      'preload',
      'remote',
      'delay',
      'required',
      'readOnly',
      'disabled'
    ]);
    this.changeHandler();
  }

  /**
   * Default constructor.
   * @param properties Autocomplete properties.
   * @param children Autocomplete children.
   */
  constructor(properties?: T, children?: any[]) {
    super(properties, children);
    DOM.append(this.skeleton.attachShadow({ mode: 'closed' }), this.styles, this.autocomplete);
    this.bindHandlers();
    this.bindProperties();
    this.assignProperties();
  }

  /**
   * Gets the autocomplete name.
   */
  @Class.Public()
  public get name(): string {
    return Control.getChildProperty(this.inputSlot, 'name');
  }

  /**
   * Sets the autocomplete name.
   */
  public set name(name: string) {
    Control.setChildProperty(this.inputSlot, 'name', name);
  }

  /**
   * Gets the autocomplete type.
   */
  @Class.Public()
  public get type(): string {
    return Control.getChildProperty(this.inputSlot, 'type');
  }

  /**
   * Sets the autocomplete type.
   */
  public set type(type: string) {
    Control.setChildProperty(this.inputSlot, 'type', type);
  }

  /**
   * Gets the autocomplete value.
   */
  @Class.Public()
  public get value(): string | undefined {
    return this.states.selected ? this.states.selected.value : void 0;
  }

  /**
   * Sets the autocomplete value.
   */
  public set value(value: string | undefined) {
    const input = Control.getChildByProperty(this.inputSlot, 'value') as HTMLInputElement;
    const option = this.states.options.find((option: Option) => option.value === value);
    if (option) {
      this.selectInputOption(input, option);
    } else if (this.states.selected) {
      delete (this.matchedElements.get(this.states.selected) as HTMLElement).dataset.active;
      this.states.selected = void 0;
      input.dataset.empty = 'on';
    }
  }

  /**
   * Gets the selected option.
   */
  @Class.Public()
  public get selected(): Option | undefined {
    return this.states.selected ? { ...this.states.selected } : void 0;
  }

  /**
   * Gets the empty state.
   */
  @Class.Public()
  public get empty(): any {
    return this.selected === void 0;
  }

  /**
   * Gets the search value.
   */
  @Class.Public()
  public get search(): any {
    return Control.getChildProperty(this.inputSlot, 'value');
  }

  /**
   * Gets the preload state.
   */
  @Class.Public()
  public get preload(): boolean {
    return this.states.preload;
  }

  /**
   * Sets the preload state.
   */
  public set preload(state: boolean) {
    this.states.preload = state;
  }

  /**
   * Gets the remote state.
   */
  @Class.Public()
  public get remote(): boolean {
    return this.states.remote;
  }

  /**
   * Sets the remote state.
   */
  public set remote(state: boolean) {
    this.states.remote = state;
  }

  /**
   * Gets the delay state.
   */
  @Class.Public()
  public get delay(): number {
    return this.states.delay;
  }

  /**
   * Sets the delay state.
   */
  public set delay(milliseconds: number) {
    this.states.delay = milliseconds;
  }

  /**
   * Gets the required state.
   */
  @Class.Public()
  public get required(): boolean {
    return Control.getChildProperty(this.inputSlot, 'required');
  }

  /**
   * Sets the required state.
   */
  public set required(state: boolean) {
    Control.setChildProperty(this.inputSlot, 'required', state);
  }

  /**
   * Gets the read-only state.
   */
  @Class.Public()
  public get readOnly(): boolean {
    return Control.getChildProperty(this.inputSlot, 'readOnly');
  }

  /**
   * Sets the read-only state.
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
   * Sets the disabled state.
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
   * Adds a new option into the autocomplete results.
   * @param label Option label.
   * @param value Option value.
   * @param group Option group.
   */
  @Class.Public()
  public add(label: string, value: string, group?: string): void {
    const option = { value: value, label: label, group: group };
    const element = this.renderOption(option);
    this.states.options.push(option);
    this.matchedElements.set(option, element);
    element.addEventListener('click', this.selectOptionHandler.bind(this, option));
    if (this.value === value) {
      this.selectOption(option);
    }
  }

  /**
   * Clear all search results.
   */
  @Class.Public()
  public clear(): void {
    this.states.selected = void 0;
    this.states.options = [];
    this.replaceDropdown(this.emptySlot);
  }

  /**
   * Opens the autocompletion panel.
   */
  @Class.Public()
  public open(): void {
    if (this.states.options.length) {
      this.replaceDropdown(this.resultsSlot);
      this.buildOptionsList();
    } else {
      this.replaceDropdown(this.emptySlot);
    }
  }

  /**
   * Closes the autocompletion panel.
   */
  @Class.Public()
  public close(): void {
    DOM.clear(this.dropdown);
  }

  /**
   * Set the custom error message.
   * @param error Custom error message or element.
   */
  @Class.Public()
  public setCustomError(error: JSX.Element): void {
    this.states.options = [];
    this.replaceDropdown(this.errorSlot);
    (this.errorSlot.assignedNodes() as HTMLElement[]).forEach((child: HTMLElement) => DOM.append(DOM.clear(child), error));
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
