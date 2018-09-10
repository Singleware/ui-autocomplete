/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Option } from './option';

/**
 * Autocomplete states interface.
 */
export interface States {
  /**
   * Current selected option.
   */
  selection: Option | undefined;
  /**
   * Current result options.
   */
  options: Option[];
  /**
   * Current remote state.
   */
  remote: boolean;
  /**
   * Current delay.
   */
  delay: number;
}
