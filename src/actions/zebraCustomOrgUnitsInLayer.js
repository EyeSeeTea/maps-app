import * as types from '../constants/actionTypes';

/**
 * Creates an action to set org units in layer filter.
 *
 * @param {Array<Object>} orgUnitsInLayer - List of organization units to display in the map layer, where each object contains
 *                                             properties such as `id`, `level`, `parent`, `displayName`, `path`, and `children`.
 * @returns {Object} The action object with type `types.ORG_UNITS_IN_LAYER_FILTER_SET` and payload.
 */
export const setOrgUnitsInLayerFilter = orgUnitsInLayer => ({
    type: types.ORG_UNITS_IN_LAYER_FILTER_SET,
    payload: orgUnitsInLayer,
});

/**
 * Creates an action to clean org units in layer filter.
 *
 * @returns {Object} The action object with type `types.ORG_UNITS_IN_LAYER_FILTER_CLEAN`.
 */
export const cleanOrgUnitsInLayerFilter = () => ({
    type: types.ORG_UNITS_IN_LAYER_FILTER_CLEAN,
});

/**
 * Creates an action to drill up/down.
 *
 * @returns {Object} The action object with type `types.ORG_UNITS_IN_LAYER_DRILL_LEVEL_SET` and layerId, parentId, parentGraph and level.
 */
export const zebraCustomDrillLayer = (
    layerId,
    parentId,
    parentGraph,
    level
) => ({
    type: types.ZEBRA_CUSTOM_LAYER_DRILL,
    layerId,
    parentId,
    parentGraph,
    level,
});
