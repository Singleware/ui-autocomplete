/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Item } from './item';

/**
 * Autocomplete states interface.
 */
export interface States {
  /**
   * Current selected item.
   */
  selection: Item | undefined;
  /**
   * Current result items.
   */
  items: Item[];
  /**
   * Current preload status.
   */
  preload: boolean;
  /**
   * Current remote state.
   */
  remote: boolean;
  /**
   * Current delay.
   */
  delay: number;
}
