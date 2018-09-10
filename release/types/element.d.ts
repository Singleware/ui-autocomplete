/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Selection } from './selection';

/**
 * Autocomplete element interface.
 */
export interface Element extends HTMLDivElement {
  /**
   * Autocomplete name.
   */
  name: string;
  /**
   * Autocomplete value.
   */
  value: Selection;
  /**
   * Determines whether the autocomplete is empty or not.
   */
  readonly empty: boolean;
  /**
   * Autocomplete search value.
   */
  readonly search: string;
  /**
   * Determines whether the search is remote or not.
   */
  remote: boolean;
  /**
   * Minimum delay to start the search.
   */
  delay: number;
  /**
   * Required state.
   */
  required: boolean;
  /**
   * Read-only state.
   */
  readOnly: boolean;
  /**
   * Disabled state.
   */
  disabled: boolean;
  /**
   * Adds the specified option into the autocompletion results.
   * @param label Option text label.
   * @param value Option value.
   * @param group Option group.
   * @returns Returns the generated option element.
   */
  add: (label: string, value: string, group?: string) => void;
  /**
   * Clear all search results.
   */
  clear: () => void;
  /**
   * Closes the autocompletion panel.
   */
  close: () => void;
  /**
   * Set the custom error message.
   * @param error Custom error message or element.
   */
  setCustomError: (error: JSX.Element) => void;
  /**
   * Set the custom validity error message.
   * @param error Custom error message.
   */
  setCustomValidity: (error?: string) => void;
}
