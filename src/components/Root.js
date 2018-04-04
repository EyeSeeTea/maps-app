import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import App from './app/App';
import { Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import history from '../store/history';

const Root = ({ d2, store }) => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Route path="/" component={props => <App d2={d2} {...props} />} />
        </ConnectedRouter>
    </Provider>
);

Root.propTypes = {
    store: PropTypes.object.isRequired,
    d2: PropTypes.object.isRequired,
};

export default Root;
