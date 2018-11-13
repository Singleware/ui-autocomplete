/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Option } from './option';

/**
 * Render option event detail interface.
 */
export interface Render extends CustomEvent {
  /**
   * Input data.
   */
  input: Option;
  /**
   * Output element.
   */
  output: HTMLElement | undefined;
}
