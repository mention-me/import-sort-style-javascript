# import-sort-style-javascript

A style for [import-sort](https://github.com/renke/import-sort) that is focused
on modules.

```js
// Absolute modules with side effects (not sorted because order may matter)
import "a";
import "c";
import "b";

// Relative modules with side effects (not sorted because order may matter)
import "./a";
import "./c";
import "./b";

// Hot reloader
import { hot } from "react-hot-loader/root";

// React eco-system
import React from "react";
import ReactDOM from "react-dom";

// Packages from NPM
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// First-party modules sorted by "relative depth" and then by name
import Footer from "src/js/shared/components/Footer";
import Header from "src/js/shared/components/Header";
import Loading from "src/js/shared/components/Loading";
import Toasts from "src/js/shared/components/Toasts";

// Stylesheets
import "./App.less";
```
