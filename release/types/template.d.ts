import * as Control from '@singleware/ui-control';
import { Properties } from './properties';
import { Element } from './element';
import { Option } from './option';
/**
 * Autocomplete template class.
 */
export declare class Template<T extends Properties = Properties> extends Control.Component<T> {
    /**
     * Timer Id.
     */
    private timerId;
    /**
     * Matched options entities to the options elements.
     */
    private matchedElements;
    /**
     * Autocomplete states.
     */
    private states;
    /**
     * Input slot.
     */
    private inputSlot;
    /**
     * Empty slot.
     */
    private emptySlot;
    /**
     * Error slot.
     */
    private errorSlot;
    /**
     * Loading slot.
     */
    private loadingSlot;
    /**
     * Results slot.
     */
    private resultsSlot;
    /**
     * Autocomplete dropdown.
     */
    private dropdown;
    /**
     * Autocomplete element.
     */
    private autocomplete;
    /**
     * Autocomplete styles.
     */
    private styles;
    /**
     * Autocomplete skeleton.
     */
    private skeleton;
    /**
     * Invalidates the specified input element.
     * @param input Input element.
     */
    private invalidateField;
    /**
     * Validates the specified input element.
     * @param input Input element.
     */
    private validateField;
    /**
     * Replaces the current dropdown element by the new slot element.
     * @param slot Slot element.
     */
    private replaceDropdown;
    /**
     * Selects the specified option into the specified input element.
     * @param input Input element.
     * @param option Option entity.
     */
    private selectInputOption;
    /**
     * Selects the specified option.
     * @param option Option entity.
     */
    private selectOption;
    /**
     * Build the options list.
     */
    private buildOptionsList;
    /**
     * Notify any input search.
     * @param input Input element.
     */
    private notifySearch;
    /**
     * Renders a new option element for the specified option entity.
     * @param option Option entity.
     * @returns Returns the rendered option.
     */
    private renderOption;
    /**
     * Preload data.
     * @param forced Determines whether the preload must be forced or not.
     */
    private openPreload;
    /**
     * Focus event handler.
     */
    private focusHandler;
    /**
     * Preserve event handler.
     * @param event Event information.
     */
    private preserveHandler;
    /**
     * Change event handler.
     */
    private changeHandler;
    /**
     * Render option handler.
     * @param event Event information.
     */
    private renderOptionHandler;
    /**
     * Selects the specified option entity.
     * @param option Option entity.
     */
    private selectOptionHandler;
    /**
     * Bind event handlers to update the custom element.
     */
    private bindHandlers;
    /**
     * Bind exposed properties to the custom element.
     */
    private bindProperties;
    /**
     * Assign all element properties.
     */
    private assignProperties;
    /**
     * Default constructor.
     * @param properties Autocomplete properties.
     * @param children Autocomplete children.
     */
    constructor(properties?: T, children?: any[]);
    /**
     * Gets the autocomplete name.
     */
    /**
    * Sets the autocomplete name.
    */
    name: string;
    /**
     * Gets the autocomplete type.
     */
    /**
    * Sets the autocomplete type.
    */
    type: string;
    /**
     * Gets the autocomplete value.
     */
    /**
    * Sets the autocomplete value.
    */
    value: string | undefined;
    /**
     * Gets the selected option.
     */
    readonly selected: Option | undefined;
    /**
     * Gets the empty state.
     */
    readonly empty: any;
    /**
     * Gets the search value.
     */
    readonly search: any;
    /**
     * Gets the preload state.
     */
    /**
    * Sets the preload state.
    */
    preload: boolean;
    /**
     * Gets the remote state.
     */
    /**
    * Sets the remote state.
    */
    remote: boolean;
    /**
     * Gets the delay state.
     */
    /**
    * Sets the delay state.
    */
    delay: number;
    /**
     * Gets the required state.
     */
    /**
    * Sets the required state.
    */
    required: boolean;
    /**
     * Gets the read-only state.
     */
    /**
    * Sets the read-only state.
    */
    readOnly: boolean;
    /**
     * Get disabled state.
     */
    /**
    * Sets the disabled state.
    */
    disabled: boolean;
    /**
     * Autocomplete element.
     */
    readonly element: Element;
    /**
     * Adds a new option into the autocomplete results.
     * @param label Option label.
     * @param value Option value.
     * @param group Option group.
     */
    add(label: string, value: string, group?: string): void;
    /**
     * Clear all search results.
     */
    clear(): void;
    /**
     * Opens the autocompletion panel.
     */
    open(): void;
    /**
     * Closes the autocompletion panel.
     */
    close(): void;
    /**
     * Set the custom error message.
     * @param error Custom error message or element.
     */
    setCustomError(error: JSX.Element): void;
    /**
     * Set the custom validity error message.
     * @param error Custom error message.
     */
    setCustomValidity(error?: string): void;
}
