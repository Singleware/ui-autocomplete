/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * Autocomplete selection interface.
 */
export interface Selection {
  /**
   * Selected value.
   */
  value: string;
  /**
   * Selected text label.
   */
  label: string;
  /**
   * Selected group name.
   */
  group?: string;
}
