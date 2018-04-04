import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import reducers from '../reducers';
import rootEpic from '../epics';
import history from './history';
import { routerReducer, routerMiddleware } from 'react-router-redux'

const epicMiddleware = createEpicMiddleware(rootEpic);

const store = createStore(
    combineReducers({
      ...reducers,
      router: routerReducer,
    }),
    process.env.NODE_ENV === 'development' &&
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(routerMiddleware(history), epicMiddleware)
);

window.store = store;

export default store;
