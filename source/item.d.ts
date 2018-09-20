/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Autocomplete item interface.
 */
export interface Item {
  /**
   * Item text label.
   */
  label: string;
  /**
   * Item value.
   */
  value: string;
  /**
   * Item element.
   */
  element: HTMLDivElement;
  /**
   * Item group name.
   */
  group?: string;
}
