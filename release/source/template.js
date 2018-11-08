"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
const Class = require("@singleware/class");
const DOM = require("@singleware/jsx");
const Control = require("@singleware/ui-control");
/**
 * Autocomplete template class.
 */
let Template = class Template extends Control.Component {
    /**
     * Default constructor.
     * @param properties Autocomplete properties.
     * @param children Autocomplete children.
     */
    constructor(properties, children) {
        super(properties, children);
        /**
         * Autocomplete states.
         */
        this.states = {
            items: [],
            selection: void 0,
            preload: false,
            remote: false,
            delay: 250
        };
        /**
         * Input slot.
         */
        this.inputSlot = DOM.create("slot", { name: "input", class: "input" });
        /**
         * Empty slot.
         */
        this.emptySlot = DOM.create("slot", { name: "empty", class: "empty" });
        /**
         * Error slot.
         */
        this.errorSlot = DOM.create("slot", { name: "error", class: "error" });
        /**
         * Loading slot.
         */
        this.loadingSlot = DOM.create("slot", { name: "loading", class: "loading" });
        /**
         * Results slot.
         */
        this.resultsSlot = DOM.create("slot", { name: "results", class: "results" });
        /**
         * Autocomplete dropdown.
         */
        this.dropdown = DOM.create("div", { class: "dropdown" });
        /**
         * Autocomplete element.
         */
        this.autocomplete = (DOM.create("label", { class: "autocomplete" },
            this.inputSlot,
            this.dropdown));
        /**
         * Autocomplete styles.
         */
        this.styles = (DOM.create("style", null, `:host > .autocomplete {
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
}`));
        /**
         * Autocomplete skeleton.
         */
        this.skeleton = (DOM.create("div", { slot: this.properties.slot, class: this.properties.class }, this.children));
        DOM.append(this.skeleton.attachShadow({ mode: 'closed' }), this.styles, this.autocomplete);
        this.bindHandlers();
        this.bindProperties();
        this.assignProperties();
    }
    /**
     * Invalidates the specified input element.
     * @param input Input element.
     */
    invalidateField(input) {
        input.setCustomValidity('Select a valid item.');
        input.dataset.invalid = 'on';
        delete input.dataset.valid;
    }
    /**
     * Validates the specified input element.
     * @param input Input element.
     */
    validateField(input) {
        input.setCustomValidity('');
        input.dataset.valid = 'on';
        delete input.dataset.invalid;
    }
    /**
     * Replaces the current dropdown element by the new slot element.
     * @param slot Slot element.
     */
    replaceDropdown(slot) {
        DOM.append(DOM.clear(this.dropdown), slot);
    }
    /**
     * Selects the specified item into the specified input element.
     * @param input Input element.
     * @param item Item information.
     */
    selectInputItem(input, item) {
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
    selectItem(item) {
        const input = Control.getChildByProperty(this.inputSlot, 'value');
        this.selectInputItem(input, item);
    }
    /**
     * Build the result items list.
     */
    buildItemList() {
        const children = this.resultsSlot.assignedNodes();
        for (const child of children) {
            DOM.clear(child);
            for (const item of this.states.items) {
                DOM.append(child, item.element);
            }
        }
    }
    /**
     * Notify the input searches.
     * @param input Input element.
     */
    notifySearch(input) {
        if (input.value.length) {
            this.replaceDropdown(this.remote ? this.loadingSlot : this.emptySlot);
            this.skeleton.dispatchEvent(new Event('search', { bubbles: true, cancelable: false }));
        }
        else {
            this.close();
        }
    }
    /**
     * Preload data.
     * @param forced Determines whether the preload must be forced or not.
     */
    openPreload(forced) {
        if (forced || !this.states.items.length) {
            this.states.items = [];
            this.skeleton.dispatchEvent(new Event('preload', { bubbles: true, cancelable: false }));
        }
        if (this.states.items.length) {
            this.open();
        }
    }
    /**
     * Focus event handler.
     */
    focusHandler() {
        const input = Control.getChildByProperty(this.inputSlot, 'value');
        if (input && (this.states.preload || input.value.length)) {
            if (this.states.preload) {
                this.openPreload(false);
            }
            else {
                this.open();
            }
        }
    }
    /**
     * Preserve event handler.
     * @param event Event information.
     */
    preserveHandler(event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
    }
    /**
     * Change event handler.
     */
    changeHandler() {
        const input = Control.getChildByProperty(this.inputSlot, 'value');
        if (input) {
            if (input.value.length) {
                if (this.states.selection) {
                    if (this.states.selection.label !== input.value) {
                        this.states.selection = void 0;
                        this.invalidateField(input);
                    }
                }
                else {
                    this.invalidateField(input);
                }
                clearTimeout(this.timer);
                this.timer = setTimeout(this.notifySearch.bind(this, input), this.delay);
                delete input.dataset.empty;
            }
            else {
                this.validateField(input);
                this.states.selection = void 0;
                input.dataset.empty = 'on';
                if (this.properties.preload) {
                    this.openPreload(true);
                }
                else {
                    this.close();
                }
            }
        }
    }
    /**
     * Bind event handlers to update the custom element.
     */
    bindHandlers() {
        document.addEventListener('click', this.close.bind(this));
        this.skeleton.addEventListener('click', this.preserveHandler.bind(this));
        this.skeleton.addEventListener('focus', this.focusHandler.bind(this), true);
        this.skeleton.addEventListener('keyup', this.changeHandler.bind(this), true);
    }
    /**
     * Bind exposed properties to the custom element.
     */
    bindProperties() {
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
    assignProperties() {
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
     * Get autocomplete name.
     */
    get name() {
        return Control.getChildProperty(this.inputSlot, 'name');
    }
    /**
     * Set autocomplete name.
     */
    set name(name) {
        Control.setChildProperty(this.inputSlot, 'name', name);
    }
    /**
     * Get autocomplete type.
     */
    get type() {
        return Control.getChildProperty(this.inputSlot, 'type');
    }
    /**
     * Set autocomplete type.
     */
    set type(type) {
        Control.setChildProperty(this.inputSlot, 'type', type);
    }
    /**
     * Get autocomplete value.
     */
    get value() {
        return this.states.selection ? this.states.selection.value : void 0;
    }
    /**
     * Set autocomplete value.
     */
    set value(value) {
        const input = Control.getChildByProperty(this.inputSlot, 'value');
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
    get selected() {
        const selection = this.states.selection;
        if (selection) {
            return { label: selection.label, value: selection.value, group: selection.group };
        }
        return void 0;
    }
    /**
     * Get empty state.
     */
    get empty() {
        return this.selected === void 0;
    }
    /**
     * Get search value.
     */
    get search() {
        return Control.getChildProperty(this.inputSlot, 'value');
    }
    /**
     * Get preload state.
     */
    get preload() {
        return this.states.preload;
    }
    /**
     * Set preload state.
     */
    set preload(state) {
        this.states.preload = state;
    }
    /**
     * Get remote state.
     */
    get remote() {
        return this.states.remote;
    }
    /**
     * Set remote state.
     */
    set remote(state) {
        this.states.remote = state;
    }
    /**
     * Get delay state.
     */
    get delay() {
        return this.states.delay;
    }
    /**
     * Set delay state.
     */
    set delay(milliseconds) {
        this.states.delay = milliseconds;
    }
    /**
     * Get required state.
     */
    get required() {
        return Control.getChildProperty(this.inputSlot, 'required');
    }
    /**
     * Set required state.
     */
    set required(state) {
        Control.setChildProperty(this.inputSlot, 'required', state);
    }
    /**
     * Get read-only state.
     */
    get readOnly() {
        return Control.getChildProperty(this.inputSlot, 'readOnly');
    }
    /**
     * Set read-only state.
     */
    set readOnly(state) {
        Control.setChildProperty(this.inputSlot, 'readOnly', state);
        if (state) {
            this.close();
        }
    }
    /**
     * Get disabled state.
     */
    get disabled() {
        return Control.getChildProperty(this.inputSlot, 'disabled');
    }
    /**
     * Set disabled state.
     */
    set disabled(state) {
        Control.setChildProperty(this.inputSlot, 'disabled', state);
        if (state) {
            this.close();
        }
    }
    /**
     * Autocomplete element.
     */
    get element() {
        return this.skeleton;
    }
    /**
     * Adds the specified item into the autocompletion results.
     * @param label Item text label.
     * @param value Item value.
     * @param group Item group.
     * @returns Returns the generated item element.
     */
    add(label, value, group) {
        const element = DOM.create("div", { class: "item" }, label || value);
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
    clear() {
        this.states.items = [];
        this.replaceDropdown(this.emptySlot);
    }
    /**
     * Opens the autocompletion panel.
     */
    open() {
        if (this.states.items.length) {
            this.replaceDropdown(this.resultsSlot);
            this.buildItemList();
        }
        else {
            this.replaceDropdown(this.emptySlot);
        }
    }
    /**
     * Closes the autocompletion panel.
     */
    close() {
        DOM.clear(this.dropdown);
    }
    /**
     * Set the custom error message.
     * @param error Custom error message or element.
     */
    setCustomError(error) {
        this.states.items = [];
        this.replaceDropdown(this.errorSlot);
        const children = this.errorSlot.assignedNodes();
        for (const child of children) {
            DOM.append(DOM.clear(child), error);
        }
    }
    /**
     * Set the custom validity error message.
     * @param error Custom error message.
     */
    setCustomValidity(error) {
        const input = Control.getChildByProperty(this.inputSlot, 'setCustomValidity');
        if (input) {
            input.setCustomValidity(error);
        }
    }
};
__decorate([
    Class.Private()
], Template.prototype, "states", void 0);
__decorate([
    Class.Private()
], Template.prototype, "timer", void 0);
__decorate([
    Class.Private()
], Template.prototype, "inputSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "emptySlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "errorSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "loadingSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "resultsSlot", void 0);
__decorate([
    Class.Private()
], Template.prototype, "dropdown", void 0);
__decorate([
    Class.Private()
], Template.prototype, "autocomplete", void 0);
__decorate([
    Class.Private()
], Template.prototype, "styles", void 0);
__decorate([
    Class.Private()
], Template.prototype, "skeleton", void 0);
__decorate([
    Class.Private()
], Template.prototype, "invalidateField", null);
__decorate([
    Class.Private()
], Template.prototype, "validateField", null);
__decorate([
    Class.Private()
], Template.prototype, "replaceDropdown", null);
__decorate([
    Class.Private()
], Template.prototype, "selectInputItem", null);
__decorate([
    Class.Private()
], Template.prototype, "selectItem", null);
__decorate([
    Class.Private()
], Template.prototype, "buildItemList", null);
__decorate([
    Class.Private()
], Template.prototype, "notifySearch", null);
__decorate([
    Class.Private()
], Template.prototype, "openPreload", null);
__decorate([
    Class.Private()
], Template.prototype, "focusHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "preserveHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "changeHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "bindHandlers", null);
__decorate([
    Class.Private()
], Template.prototype, "bindProperties", null);
__decorate([
    Class.Private()
], Template.prototype, "assignProperties", null);
__decorate([
    Class.Public()
], Template.prototype, "name", null);
__decorate([
    Class.Public()
], Template.prototype, "type", null);
__decorate([
    Class.Public()
], Template.prototype, "value", null);
__decorate([
    Class.Public()
], Template.prototype, "selected", null);
__decorate([
    Class.Public()
], Template.prototype, "empty", null);
__decorate([
    Class.Public()
], Template.prototype, "search", null);
__decorate([
    Class.Public()
], Template.prototype, "preload", null);
__decorate([
    Class.Public()
], Template.prototype, "remote", null);
__decorate([
    Class.Public()
], Template.prototype, "delay", null);
__decorate([
    Class.Public()
], Template.prototype, "required", null);
__decorate([
    Class.Public()
], Template.prototype, "readOnly", null);
__decorate([
    Class.Public()
], Template.prototype, "disabled", null);
__decorate([
    Class.Public()
], Template.prototype, "element", null);
__decorate([
    Class.Public()
], Template.prototype, "add", null);
__decorate([
    Class.Public()
], Template.prototype, "clear", null);
__decorate([
    Class.Public()
], Template.prototype, "open", null);
__decorate([
    Class.Public()
], Template.prototype, "close", null);
__decorate([
    Class.Public()
], Template.prototype, "setCustomError", null);
__decorate([
    Class.Public()
], Template.prototype, "setCustomValidity", null);
Template = __decorate([
    Class.Describe()
], Template);
exports.Template = Template;
