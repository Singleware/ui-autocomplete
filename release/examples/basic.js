"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 *
 * The proposal of this example is to show how to use the basic autocomplete input element.
 */
const Autocomplete = require("../source");
const DOM = require("@singleware/jsx");
const field = (DOM.create(Autocomplete.Template, null,
    DOM.create("input", { slot: "input", type: "text" }),
    DOM.create("div", { slot: "empty" }, "No results found."),
    DOM.create("div", { slot: "loading" }, "Loading..."),
    DOM.create("div", { slot: "error" }),
    DOM.create("div", { slot: "results" })));
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
