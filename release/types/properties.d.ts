/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Selection } from './selection';

/**
 * Autocomplete properties interface.
 */
export interface Properties {
  /**
   * Autocomplete classes.
   */
  class?: string;
  /**
   * Autocomplete slot.
   */
  slot?: string;
  /**
   * Autocomplete name.
   */
  name?: string;
  /**
   * Autocomplete value.
   */
  value?: Selection;
  /**
   * Determines whether the search must be pre loaded or not.
   */
  preload?: boolean;
  /**
   * Determines whether the search is remote or not.
   */
  remote?: boolean;
  /**
   * Minimum delay to start the search.
   */
  delay?: number;
  /**
   * Determines whether the autocomplete is required or not.
   */
  required?: boolean;
  /**
   * Determines whether the autocomplete is read-only or not.
   */
  readOnly?: boolean;
  /**
   * Determines whether the autocomplete is disabled or not.
   */
  disabled?: boolean;
  /**
   * Autocomplete children.
   */
  children?: {};
}
