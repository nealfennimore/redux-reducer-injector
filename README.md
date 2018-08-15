
![Travis](https://img.shields.io/travis/nealfennimore/redux-reducer-injector.svg)
[![codecov](https://codecov.io/gh/nealfennimore/redux-reducer-injector/branch/master/graph/badge.svg)](https://codecov.io/gh/nealfennimore/redux-reducer-injector)


# Redux Reducer Injector

Injects reducers asynchronously as needed

## Installation

```sh
npm install @nfen/redux-reducer-injector
# or
yarn add @nfen/redux-reducer-injector
```
## Setup

First, update the store with the augmentStore function like so. This will augment the store with `injectedReducers` and a `injectReducers` method.

```js
import { createStore, applyMiddleware } from 'redux';
import { setupCreateReducer, augmentStore } from '@nfen/redux-reducer-injector';
import permanentReducers from './reducers';

const createReducer = setupCreateReducer(permanentReducers);
const store = createStore( createReducer(), {} );
augmentStore( createReducer, store );
export default store;
```

## Usage

With the store augmented with our new methods, we can inject reducers directly on our store.

```js
store.injectReducers({
    one: oneReducer,
    two: twoReducer,
    'a.b.c': reducers.nested,
});
```

## React HOC Component

A higher order component is availble and can be used like so. It automatically injects reducers into current store when a component mounts.

```js
import { ReducerInjector } from '@nfen/redux-reducer-injector/components';
import MyComponent from './MyComponent';
import * as reducers from './reducers';

const injector = ReducerInjector({
    reducers: {
      'one': reducers.one,
      'two': reducers.two,
      'a.b.c': reducers.nested,
    }
});

export default injector( MyComponent );
```

### Use HOC with react-saga-injector

By utilizing our [sister package](https://github.com/nealfennimore/redux-saga-injector), you can dynamically inject reducers and sagas on the fly.

```js
import { compose } from 'redux';
import { SagaInjector } from '@nfen/redux-saga-injector/components';
import { ReducerInjector } from '@nfen/redux-reducer-injector/components';
import MyComponent from './MyComponent';
import * as saga from './sagas';
import * as reducers from './reducers';

const injector = (options) => compose(
    SagaInjector(options),
    ReducerInjector(options),
);

export default injector( MyComponent );
```
