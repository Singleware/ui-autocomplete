/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Autocomplete option interface.
 */
export interface Option {
  /**
   * Option value.
   */
  value: string;
  /**
   * Option label.
   */
  label: string;
  /**
   * Option group name.
   */
  group?: string;
}
