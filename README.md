# Watch out! This package is very DEPRECATED

[![Greenkeeper badge](https://badges.greenkeeper.io/zepod/react-mobx-preload.svg)](https://greenkeeper.io/)

# React-MobX-Preload

A small library providing preloading promise-based functionality for react & mobx components.

## Getting Started

Simple setup using `yarn` or `npm` setup.


```
yarn add react-mobx-preload
```
or
```
npm install react-mobx-preload --save
```


# Usage

There are two features `react-mobx-preload` provides. There is a `connect` decorator and `preload` decorator. Both can be used by importing either `createConnect` or  `createPreloader` from `react-mobx-preload` package. Choice to provide those create function was made, becouse you might want to use different MobX stores related to `connect` and `preload` decorators, or you might want to have a different `<Preloader />` component for each of Components you'll use `preload` on.

## Connect

You can create one global `connect` wired to all stores, or make a `connect` for each store. I'd advise you to create a connect in module, where you have the store, so you know, what you can expect in your connect decorator.

```js
import UIStore from './uistore';
import CustomerStore from './customerStore';

const Store = {
  UIStore,
  CustomerStore
};

export const connect = createConnect(Store);
export default Store;
```

You can then use `connect` on your component like this.

```js
import React, { Component } from 'react';
import { connect } from 'mobx/store';

@connect((store, props) => {
	const keys = store.getKeys();
    return { keyAsProp: keys };
})
export default class Comp extends Component {
	render() {
		return(
        	<div>{this.props.keyAsProp}</div>
        );
	}
}
```

**Important** is that `connect` also behaves like an observer from `react-mobx` library, so when anything you pass via `connect` changes, `connect` will pass you new values and rerenders your component. This makes it easier to see what data you have available in your component, and gives you convenient to do transformation of the data.

## Preload
You can use many different preloaders for many different components, or you can preload only on "page" basis. It's completly up to you. That's why we have to first `createPreloader`.

```js
import React, { Component } from 'react';
import { createPreloader } from 'react-mobx-preload';
import { Store } from '../Store'
import PreloadComponent from './components/Preloader';

const preloader = createPreloader(Store, PreloadComponent);

@preloader((store, props) => store.customers.loadMore(props.selectedCustomers))
export default class Comp extends Component {
	render() {
    	...
    }
}
```

While the promise is pending, your `<PreloadComponent />` will be shown instead of your Component.
