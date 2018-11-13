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
   * Selected option.
   */
  selected: Option | undefined;
  /**
   * Current options.
   */
  options: Option[];
  /**
   * Preload status.
   */
  preload: boolean;
  /**
   * Remote state.
   */
  remote: boolean;
  /**
   * Delay time (in milliseconds).
   */
  delay: number;
}
