import * as Control from '@singleware/ui-control';
import { Properties } from './properties';
import { Selection } from './selection';
import { Element } from './element';
/**
 * Autocomplete template class.
 */
export declare class Template extends Control.Component<Properties> {
    /**
     * Autocomplete states.
     */
    private states;
    /**
     * Timer Id.
     */
    private timer;
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
     * Selects the specified item into the specified input element.
     * @param input Input element.
     * @param item Item information.
     */
    private selectInputItem;
    /**
     * Selects the specified item.
     * @param item Item information.
     */
    private selectItem;
    /**
     * Build the result items list.
     */
    private buildItemList;
    /**
     * Notify input searches.
     * @param input Input element.
     */
    private notifySearch;
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
    constructor(properties?: Properties, children?: any[]);
    /**
     * Get autocomplete name.
     */
    /**
    * Set autocomplete name.
    */
    name: string;
    /**
     * Get autocomplete type.
     */
    /**
    * Set autocomplete type.
    */
    type: string;
    /**
     * Get autocomplete value.
     */
    /**
    * Set autocomplete value.
    */
    value: string | undefined;
    /**
     * Get selected item.
     */
    readonly selected: Selection | undefined;
    /**
     * Get empty state.
     */
    readonly empty: any;
    /**
     * Get search value.
     */
    readonly search: any;
    /**
     * Get remote state.
     */
    /**
    * Set remote state.
    */
    remote: boolean;
    /**
     * Get delay state.
     */
    /**
    * Set delay state.
    */
    delay: number;
    /**
     * Get required state.
     */
    /**
    * Set required state.
    */
    required: boolean;
    /**
     * Get read-only state.
     */
    /**
    * Set read-only state.
    */
    readOnly: boolean;
    /**
     * Get disabled state.
     */
    /**
    * Set disabled state.
    */
    disabled: boolean;
    /**
     * Autocomplete element.
     */
    readonly element: Element;
    /**
     * Adds the specified item into the autocompletion results.
     * @param label Item text label.
     * @param value Item value.
     * @param group Item group.
     * @returns Returns the generated item element.
     */
    add(label: string, value: string, group?: string): HTMLDivElement;
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
