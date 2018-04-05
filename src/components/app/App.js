import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import appTheme from './app.theme';
import MapProvider from '../map/MapProvider';
import AppHeader from './AppHeader';
import AppMenu from './AppMenu';
import LayersPanel from '../layers/LayersPanel';
import LayersToggle from '../layers/LayersToggle';
import RightPanel from '../right-panel/RightPanel';
import Map from '../map/Map';
import BottomPanel from '../datatable/BottomPanel';
import LayerEdit from '../edit/LayerEdit';
import ContextMenu from '../map/ContextMenu';
import AboutDialog from '../about/AboutDialog';
import AlertsDialog from '../alerts/AlertsDialog';
import Message from '../message/Message';
import { loadFavorite } from '../../actions/favorites';
import store from '../../store';
import { connect } from 'react-redux';
import { getMapRoute } from '../../util/routes';

// Makes d2 available in all child components
// Not using AppWithD2 from d2-ui because it requires d2 to be a promise
class App extends Component {
    static childContextTypes = {
        d2: PropTypes.object.isRequired,
    };

    static propTypes = {
        d2: PropTypes.object.isRequired,
        loadFavorite: PropTypes.func.isRequired,
    };

    getChildContext() {
        return {
            d2: this.props.d2,
        };
    }

    componentDidMount() {
        const route = getMapRoute(this.props.location);
        if (route.id)
            this.props.loadFavorite(route.id, route.interpretationId);
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={appTheme}>
                <MapProvider>
                    <div id="dhis-gis-container">
                        <AppHeader />
                        <AppMenu />
                        <LayersPanel />
                        <LayersToggle />
                        <Map />
                        <RightPanel />
                        <BottomPanel />
                        <LayerEdit />
                        <ContextMenu />
                        <AboutDialog />
                        <AlertsDialog />
                        <Message />
                    </div>
                </MapProvider>
            </MuiThemeProvider>
        );
    }
}

export default connect(
    state => ({}),
    {
        loadFavorite,
    },
)(App);
