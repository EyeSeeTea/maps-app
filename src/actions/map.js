import log from 'loglevel';
import * as types from '../constants/actionTypes';
import { getFallbackBasemap } from '../constants/basemaps';
import { fetchMap } from '../util/requests';
import { addOrgUnitPaths } from '../util/helpers';
import { loadLayer } from './layers';

export const newMap = () => ({
    type: types.MAP_NEW,
});

export const setMap = config => ({
    type: types.MAP_SET,
    payload: config,
});

export const setMapProps = props => ({
    type: types.MAP_PROPS_SET,
    payload: props,
});

export const openCoordinatePopup = coord => ({
    type: types.MAP_COORDINATE_OPEN,
    payload: coord,
});

export const closeCoordinatePopup = () => ({
    type: types.MAP_COORDINATE_CLOSE,
});

export const openContextMenu = payload => ({
    type: types.MAP_CONTEXT_MENU_OPEN,
    payload,
});

export const closeContextMenu = () => ({
    type: types.MAP_CONTEXT_MENU_CLOSE,
});

export const showEarthEngineValue = (layerId, coordinate) => ({
    type: types.MAP_EARTH_ENGINE_VALUE_SHOW,
    layerId,
    coordinate,
});

export const setRelativePeriodDate = date => ({
    type: types.MAP_RELATIVE_PERIOD_DATE_SET,
    payload: date,
});

export const tOpenMap = (mapId, keyDefaultBaseMap, dataEngine) => async (
    dispatch,
    getState
) => {
    try {
        const map = await fetchMap(mapId, dataEngine, keyDefaultBaseMap);

        const basemapConfig =
            getState().basemaps.find(bm => bm.id === map.basemap.id) ||
            getFallbackBasemap();

        const basemap = { ...map.basemap, ...basemapConfig };

        dispatch(setMap({ ...map, basemap }));
        addOrgUnitPaths(map.mapViews).map(view => dispatch(loadLayer(view)));
    } catch (e) {
        log.error(e);
        return e;
    }
};

/**
 * Opens a map with programIndicatorData filtered by orgUnitsInLayer, within a startDate and endDate range.
 *
 * @param {string} mapId - The ID of the map to load.
 * @param {string} keyDefaultBaseMap - The key for the default base map.
 * @param {DataEngine} dataEngine - DataEngine instance object.
 * @param {Array<Object>|undefined} [orgUnitsInLayer] - Optional. List of organization units to display in the map layer, where each object contains
 *                                             properties such as `id`, `level`, `parent`, `displayName`, `path`, and `children`.
 * @param {object|undefined} [programIndicatorData] - Optional. Program indicator data, containing the properties `id`, `name`, `programId`, and `programName`.
 * @param {string} [programIndicatorData.id] - The ID of the program indicator.
 * @param {string} [programIndicatorData.name] - The name of the program indicator.
 * @param {string} [programIndicatorData.programId] - The ID of the program.
 * @param {string} [programIndicatorData.programName] - The name of the program.
 * @param {string|undefined} [startDate] - Optional. The start date in ISO format (YYYY-MM-DD).
 * @param {string|undefined} [endDate] - Optional. The end date in ISO format (YYYY-MM-DD).
 * @param {string} [timeField] - The time field to be used for filtering.
 * @returns {Function} An async function that dispatches actions to configure the map and load the layer.
 */
export const tOpenProgramIndicatorMapWithOrgUnitsInLayerInStartEndDate = (
    mapId,
    keyDefaultBaseMap,
    dataEngine,
    orgUnitsInLayer,
    programIndicatorData,
    startDate,
    endDate,
    timeField
) => async (dispatch, getState) => {
    try {
        const map = await fetchMap(mapId, dataEngine, keyDefaultBaseMap);

        const basemapConfig =
            getState().basemaps.find(bm => bm.id === map.basemap.id) ||
            getFallbackBasemap();

        const basemap = { ...map.basemap, ...basemapConfig };

        const mapViewsFilteredByOrgUnits = orgUnitsInLayer?.length
            ? filterMapViewsByOrgUnits(map.mapViews, orgUnitsInLayer)
            : map.mapViews;

        const mapViewsWithStartDateEndDate =
            startDate && endDate
                ? addStartDateEndDateToMapViews(
                      mapViewsFilteredByOrgUnits,
                      startDate,
                      endDate
                  )
                : mapViewsFilteredByOrgUnits;

        const mapViewsWithProgramIndicator =
            programIndicatorData.id &&
            programIndicatorData.name &&
            programIndicatorData.programId &&
            programIndicatorData.programName
                ? setProgramIndicatorInMapViews(
                      mapViewsWithStartDateEndDate,
                      programIndicatorData
                  )
                : mapViewsWithStartDateEndDate;

        const filteredMap = {
            ...map,
            mapViews: timeField
                ? mapViewsWithProgramIndicator.map(mapView => ({
                      ...mapView,
                      timeField: timeField,
                  }))
                : mapViewsWithProgramIndicator,
        };

        dispatch(setMap({ ...filteredMap, basemap }));
        addOrgUnitPaths(filteredMap.mapViews).map(view =>
            dispatch(loadLayer(view))
        );
    } catch (e) {
        log.error(e);
        return e;
    }
};

function filterMapViewsByOrgUnits(mapViews, orgUnitsInLayer) {
    if (!orgUnitsInLayer?.length || !mapViews?.length) {
        return mapViews;
    }

    return mapViews.map(mapView => {
        const filteredOrganisationUnits = orgUnitsInLayer.map(ou => ({
            id: ou.id,
            path: ou.path,
        }));

        const filteredParentGraphMap = orgUnitsInLayer.reduce((acc, ou) => {
            return {
                ...acc,
                [ou.id]: ou.parent.id,
            };
        }, {});

        const filteredRows = mapView.rows?.map(row => {
            return row.dimension === 'ou'
                ? {
                      ...row,
                      items: orgUnitsInLayer.map(ou => ({
                          id: ou.id,
                          name: ou.displayName,
                          dimensionItemType: 'ORGANISATION_UNIT',
                      })),
                  }
                : row;
        });

        return {
            ...mapView,
            organisationUnits: filteredOrganisationUnits,
            parentGraphMap: filteredParentGraphMap,
            rows: filteredRows,
        };
    });
}

function addStartDateEndDateToMapViews(mapViews, startDate, endDate) {
    if (!startDate || !endDate || !mapViews?.length) {
        return mapViews;
    }

    return mapViews.map(mapView => {
        return {
            ...mapView,
            filters: [],
            startDate: startDate,
            endDate: endDate,
        };
    });
}

function setProgramIndicatorInMapViews(mapViews, programIndicatorData) {
    if (
        !programIndicatorData.id ||
        !programIndicatorData.name ||
        !programIndicatorData.programId ||
        !programIndicatorData.programName ||
        !mapViews?.length
    ) {
        return mapViews;
    }

    return mapViews.map(mapView => {
        const dataDimensionItemsWithProgramIndicator = mapView.dataDimensionItems?.map(
            dataDimensionItem => {
                return dataDimensionItem.dataDimensionItemType ===
                    'PROGRAM_INDICATOR'
                    ? {
                          dataDimensionItemType:
                              dataDimensionItem.dataDimensionItemType,
                          programIndicator: { id: programIndicatorData.id },
                      }
                    : dataDimensionItem;
            }
        );

        const columnsWithProgramIndicator = mapView.columns?.map(column => {
            return column.dimension === 'dx'
                ? {
                      ...column,
                      items: [
                          {
                              id: programIndicatorData.id,
                              name: programIndicatorData.name,
                              dimensionItemType: 'PROGRAM_INDICATOR',
                          },
                      ],
                  }
                : column;
        });

        const program = {
            id: programIndicatorData.programId,
            name: programIndicatorData.programName,
        };

        return {
            ...mapView,
            program: program,
            columns: columnsWithProgramIndicator,
            dataDimensionItems: dataDimensionItemsWithProgramIndicator,
        };
    });
}
