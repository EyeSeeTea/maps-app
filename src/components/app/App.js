import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import 'typeface-roboto';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { useDataEngine } from '@dhis2/app-runtime';
import { CssReset, CssVariables, HeaderBar, Help } from '@dhis2/ui';
import isEmpty from 'lodash/isEmpty';
import AppMenu from './AppMenu';
import { useSystemSettings } from '../SystemSettingsProvider';
import LayersPanel from '../layers/LayersPanel';
import LayersToggle from '../layers/LayersToggle';
import MapContainer from '../map/MapContainer';
import BottomPanel from '../datatable/BottomPanel';
import LayerEdit from '../edit/LayerEdit';
import ContextMenu from '../map/ContextMenu';
import OrgUnitProfile from '../orgunits/OrgUnitProfile';
import AlertStack from '../alerts/AlertStack';
import InterpretationsPanel from '../interpretations/InterpretationsPanel';
import DataDownloadDialog from '../layers/download/DataDownloadDialog';
import OpenAsMapDialog from '../openAs/OpenAsMapDialog';
import FatalErrorBoundary from '../errors/FatalErrorBoundary';
import { tSetAnalyticalObject } from '../../actions/analyticalObject';
import { tSetOrgUnitTree } from '../../actions/orgUnits';
import {
    tOpenMap,
    tOpenProgramIndicatorMapWithOrgUnitsInLayerInStartEndDate,
} from '../../actions/map';
import { tSetExternalLayers } from '../../actions/externalLayers';
import { removeBingBasemaps, setBingMapsApiKey } from '../../actions/basemap';
import {
    setCurrentAppInfo,
    cleanCurrentAppInfo,
} from '../../actions/currentAppInfo';
import { getUrlParameter } from '../../util/requests';
import { fetchOrgUnitsByIds } from '../../util/orgUnits';
import { getStartEndDateError } from '../../util/time';
import { DEFAULT_END_DATE } from '../../constants/layers';
import { loadZebraProgramIndicators } from '../../actions/zebraProgramIndicators';

import styles from './styles/App.module.css';

const App = ({
    removeBingBasemaps,
    setBingMapsApiKey,
    tSetAnalyticalObject,
    tSetOrgUnitTree,
    tSetExternalLayers,
    tOpenMap,
    tOpenProgramIndicatorMapWithOrgUnitsInLayerInStartEndDate,
    cleanCurrentAppInfo,
    setCurrentAppInfo,
    loadZebraProgramIndicators,
    currentAppInfo,
}) => {
    const [basemapsLoaded, setBasemapsLoaded] = useState(false);
    const [orgUnitsInLayer, setOrgUnitsInLayer] = useState(null);
    const [error, setError] = useState();

    const systemSettings = useSystemSettings();
    const engine = useDataEngine();

    useEffect(() => {
        const orgUnits = getUrlParameter('orgUnits');
        const orgUnitsIds = orgUnits ? orgUnits?.split(',') : undefined;
        if (orgUnitsIds?.length) {
            fetchOrgUnitsByIds(orgUnitsIds)
                .then(setOrgUnitsInLayer)
                .catch(() =>
                    setError(i18n.t('Failed to load organisation units.'))
                );
        } else {
            setOrgUnitsInLayer([]);
        }
    }, []);

    useEffect(() => {
        const currentAppParam = getUrlParameter('currentApp');
        const zebraNamespaceParam = getUrlParameter('zebraNamespace');
        const dashboardDatastoreKeyParam = getUrlParameter(
            'dashboardDatastoreKey'
        );

        if (currentAppParam === 'ZEBRA') {
            if (zebraNamespaceParam && dashboardDatastoreKeyParam) {
                loadZebraProgramIndicators({
                    zebraNamespace: zebraNamespaceParam,
                    dashboardKey: dashboardDatastoreKeyParam,
                });
            } else {
                setError(
                    i18n.t(
                        'Failed to load program indicators using datastore information, please check the URL parameters.'
                    )
                );
            }
        }
    }, []);

    useEffect(() => {
        const currentAppParam = getUrlParameter('currentApp');
        if (currentAppParam && currentAppParam !== currentAppInfo?.app) {
            const currentPageParam = getUrlParameter('currentPage');
            setCurrentAppInfo &&
                setCurrentAppInfo({
                    app: currentAppParam,
                    page: currentPageParam,
                });
        }

        return () => {
            cleanCurrentAppInfo && cleanCurrentAppInfo();
        };
    }, []);

    useEffect(() => {
        async function fetchData() {
            await tSetOrgUnitTree();
            await tSetExternalLayers(engine);
            setBasemapsLoaded(true);

            const mapId = getUrlParameter('id');
            const timeField = getUrlParameter('timeField');

            const programIndicatorData = {
                id: getUrlParameter('programIndicatorId'),
                name: getUrlParameter('programIndicatorName'),
                programId: getUrlParameter('programId'),
                programName: getUrlParameter('programName'),
            };

            const hasProgramIndicatorData = Object.values(
                programIndicatorData
            ).some(value => !!value);

            const startDateString = getUrlParameter('startDate');
            const endDateString =
                getUrlParameter('endDate') || startDateString
                    ? DEFAULT_END_DATE
                    : null;

            const errorDate = getStartEndDateError(
                startDateString,
                endDateString
            );
            const startDate = errorDate ? null : startDateString;
            const endDate = errorDate ? null : endDateString;

            const currentAppParam = getUrlParameter('currentApp');

            if (mapId) {
                if (
                    currentAppParam === 'ZEBRA' &&
                    (orgUnitsInLayer?.length ||
                        hasProgramIndicatorData ||
                        startDate ||
                        endDate ||
                        timeField)
                ) {
                    await tOpenProgramIndicatorMapWithOrgUnitsInLayerInStartEndDate(
                        mapId,
                        systemSettings.keyDefaultBaseMap,
                        engine,
                        orgUnitsInLayer,
                        programIndicatorData,
                        startDate,
                        endDate,
                        timeField
                    );
                } else if (
                    !orgUnitsInLayer?.length &&
                    !hasProgramIndicatorData &&
                    !startDate &&
                    !endDate
                ) {
                    await tOpenMap(
                        mapId,
                        systemSettings.keyDefaultBaseMap,
                        engine
                    );
                }
            }

            if (getUrlParameter('currentAnalyticalObject') === 'true') {
                await tSetAnalyticalObject();
            }
        }

        if (orgUnitsInLayer !== null) {
            fetchData();
        }
    }, [orgUnitsInLayer]);

    useEffect(() => {
        if (!isEmpty(systemSettings)) {
            if (!systemSettings.keyBingMapsApiKey) {
                removeBingBasemaps();
            } else {
                setBingMapsApiKey(systemSettings.keyBingMapsApiKey);
            }
        }
    }, [systemSettings]);

    if (error) {
        return <Help error>{error}</Help>;
    }

    return (
        <FatalErrorBoundary>
            <div className={styles.app}>
                <CssReset />
                <CssVariables colors spacers theme />
                <HeaderBar className="header-bar" appName={i18n.t('Maps')} />
                <AppMenu />
                <InterpretationsPanel />
                {basemapsLoaded && (
                    <>
                        <LayersToggle />
                        <LayersPanel />
                        <MapContainer />
                    </>
                )}
                <BottomPanel />
                <LayerEdit />
                {currentAppInfo?.app === 'ZEBRA' ? null : <ContextMenu />}
                <AlertStack />
                <DataDownloadDialog />
                <OpenAsMapDialog />
                <OrgUnitProfile />
            </div>
        </FatalErrorBoundary>
    );
};

App.propTypes = {
    removeBingBasemaps: PropTypes.func,
    setBingMapsApiKey: PropTypes.func,
    loadLayer: PropTypes.func,
    tOpenMap: PropTypes.func,
    tSetAnalyticalObject: PropTypes.func,
    tSetExternalLayers: PropTypes.func,
    tSetOrgUnitTree: PropTypes.func,
    tOpenProgramIndicatorMapWithOrgUnitsInLayerInStartEndDate: PropTypes.func,
    loadZebraProgramIndicators: PropTypes.func,
    cleanCurrentAppInfo: PropTypes.func,
    setCurrentAppInfo: PropTypes.func,
    currentAppInfo: PropTypes.shape({
        app: PropTypes.string.isRequired,
        page: PropTypes.string,
    }),
};

export default connect(
    state => ({
        currentAppInfo: state.currentAppInfo,
    }),
    {
        removeBingBasemaps,
        setBingMapsApiKey,
        tOpenMap,
        tOpenProgramIndicatorMapWithOrgUnitsInLayerInStartEndDate,
        tSetAnalyticalObject,
        tSetExternalLayers,
        tSetOrgUnitTree,
        setCurrentAppInfo,
        cleanCurrentAppInfo,
        loadZebraProgramIndicators,
    }
)(App);
