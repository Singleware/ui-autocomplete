"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Template_1;
"use strict";
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
let Template = Template_1 = class Template extends Control.Component {
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
            selection: void 0,
            options: [],
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
         * Autocomplete element.
         */
        this.autocomplete = DOM.create("label", { class: "autocomplete" }, this.inputSlot);
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
}`));
        /**
         * Autocomplete skeleton.
         */
        this.skeleton = (DOM.create("div", { slot: this.properties.slot, class: this.properties.class }, this.children));
        /**
         * Autocomplete elements.
         */
        this.elements = DOM.append(this.skeleton.attachShadow({ mode: 'closed' }), this.styles, this.autocomplete);
        this.bindHandlers();
        this.bindProperties();
        this.assignProperties();
    }
    /**
     * Selects the specified option.
     * @param option Option information.
     */
    selectItem(option) {
        const input = Control.getChildByProperty(this.inputSlot, 'value');
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
    buildItemList() {
        const children = this.resultsSlot.assignedNodes();
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
    notifySearch(input) {
        this.close();
        if (input.value.length) {
            DOM.append(this.autocomplete, this.remote ? this.loadingSlot : this.emptySlot);
            this.skeleton.dispatchEvent(new Event('search', { bubbles: true, cancelable: false }));
        }
    }
    /**
     * Close event handler.
     */
    closeHandler() {
        this.close();
    }
    /**
     * Open event handler.
     */
    openHandler() {
        const input = Control.getChildByProperty(this.inputSlot, 'value');
        if (input && input.value.length) {
            this.close();
            DOM.append(this.autocomplete, this.states.options.length ? this.resultsSlot : this.emptySlot);
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
        if (input && input.value.length) {
            if (this.states.selection) {
                if (this.states.selection.label !== input.value) {
                    this.states.selection = void 0;
                    input.setCustomValidity('Select an valid option.');
                }
            }
            else {
                input.setCustomValidity('Select an valid option.');
            }
            clearTimeout(this.timer);
            this.timer = setTimeout(this.notifySearch.bind(this, input), this.delay);
            delete input.dataset.empty;
        }
        else {
            input.dataset.empty = 'on';
            this.close();
        }
    }
    /**
     * Bind event handlers to update the custom element.
     */
    bindHandlers() {
        document.addEventListener('click', this.closeHandler.bind(this));
        this.skeleton.addEventListener('click', this.preserveHandler.bind(this));
        this.skeleton.addEventListener('focus', this.openHandler.bind(this), true);
        this.skeleton.addEventListener('keyup', this.changeHandler.bind(this), true);
    }
    /**
     * Bind exposed properties to the custom element.
     */
    bindProperties() {
        Object.defineProperties(this.skeleton, {
            type: super.bindDescriptor(this, Template_1.prototype, 'type'),
            name: super.bindDescriptor(this, Template_1.prototype, 'name'),
            value: super.bindDescriptor(this, Template_1.prototype, 'value'),
            empty: super.bindDescriptor(this, Template_1.prototype, 'empty'),
            search: super.bindDescriptor(this, Template_1.prototype, 'search'),
            remote: super.bindDescriptor(this, Template_1.prototype, 'remote'),
            delay: super.bindDescriptor(this, Template_1.prototype, 'delay'),
            required: super.bindDescriptor(this, Template_1.prototype, 'required'),
            readOnly: super.bindDescriptor(this, Template_1.prototype, 'readOnly'),
            disabled: super.bindDescriptor(this, Template_1.prototype, 'disabled'),
            add: super.bindDescriptor(this, Template_1.prototype, 'add'),
            clear: super.bindDescriptor(this, Template_1.prototype, 'clear'),
            close: super.bindDescriptor(this, Template_1.prototype, 'close'),
            setCustomError: super.bindDescriptor(this, Template_1.prototype, 'setCustomError'),
            setCustomValidity: super.bindDescriptor(this, Template_1.prototype, 'setCustomValidity')
        });
    }
    /**
     * Assign all element properties.
     */
    assignProperties() {
        Control.assignProperties(this, this.properties, ['type', 'name', 'value', 'remote', 'delay', 'required', 'readOnly', 'disabled']);
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
        const selection = this.states.selection;
        return selection ? { label: selection.label, value: selection.value, group: selection.group } : void 0;
    }
    /**
     * Set autocomplete value.
     */
    set value(input) {
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
    get empty() {
        return this.value === void 0;
    }
    /**
     * Get search value.
     */
    get search() {
        return Control.getChildProperty(this.inputSlot, 'value');
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
     * Adds the specified option into the autocompletion results.
     * @param label Option text label.
     * @param value Option value.
     * @param group Option group.
     * @returns Returns the generated option element.
     */
    add(label, value, group) {
        const element = DOM.create("div", { class: "item" }, label || value);
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
    clear() {
        this.states.options = [];
        this.close();
        DOM.append(this.autocomplete, this.emptySlot);
    }
    /**
     * Closes the autocompletion panel.
     */
    close() {
        this.emptySlot.remove();
        this.errorSlot.remove();
        this.loadingSlot.remove();
        this.resultsSlot.remove();
    }
    /**
     * Set the custom error message.
     * @param error Custom error message or element.
     */
    setCustomError(error) {
        this.states.options = [];
        this.close();
        DOM.append(this.autocomplete, this.errorSlot);
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
], Template.prototype, "autocomplete", void 0);
__decorate([
    Class.Private()
], Template.prototype, "styles", void 0);
__decorate([
    Class.Private()
], Template.prototype, "skeleton", void 0);
__decorate([
    Class.Private()
], Template.prototype, "elements", void 0);
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
], Template.prototype, "closeHandler", null);
__decorate([
    Class.Private()
], Template.prototype, "openHandler", null);
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
], Template.prototype, "empty", null);
__decorate([
    Class.Public()
], Template.prototype, "search", null);
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
], Template.prototype, "close", null);
__decorate([
    Class.Public()
], Template.prototype, "setCustomError", null);
__decorate([
    Class.Public()
], Template.prototype, "setCustomValidity", null);
Template = Template_1 = __decorate([
    Class.Describe()
], Template);
exports.Template = Template;
