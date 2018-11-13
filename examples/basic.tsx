/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to use the basic autocomplete input element.
 */
import * as Autocomplete from '../source';
import * as DOM from '@singleware/jsx';

const field = (
  <Autocomplete.Template>
    <input slot="input" type="text" />
    <div slot="empty">No results found.</div>
    <div slot="loading">Loading...</div>
    <div slot="error" />
    <div slot="results" />
  </Autocomplete.Template>
) as Autocomplete.Element;

// Change remote property of the element.
field.remote = true;

// Change the search delay property of the element.
field.delay = 1000;

// Change disabled property of the element.
field.disabled = true;

// Change read-only property of the element.
field.readOnly = true;

// Change required property of the element.
field.required = true;

// Change name property of the element.
field.name = 'new-name';

field.add('Test', 'test-id');

// Change value property of the element.
field.value = 'test-id';
