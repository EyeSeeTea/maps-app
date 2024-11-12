import { compact, sortBy, isString } from 'lodash/fp';
import { dimConf } from '../constants/dimension';

export const isValidCoordinate = coord =>
    Array.isArray(coord) &&
    coord.length === 2 &&
    coord[0] >= -180 &&
    coord[0] <= 180 &&
    coord[1] >= -90 &&
    coord[1] <= 90;

export const toGeoJson = organisationUnits =>
    sortBy('le', organisationUnits)
        .map(ou => {
            const coord = JSON.parse(ou.co);
            let gpid = '';
            let gppg = '';
            let type = 'Point';

            if (ou.ty === 2) {
                type = 'Polygon';
                if (ou.co.substring(0, 4) === '[[[[') {
                    type = 'MultiPolygon';
                }
            }

            // Grand parent
            if (isString(ou.pg) && ou.pg.length) {
                const ids = compact(ou.pg.split('/'));

                // Grand parent id
                if (ids.length >= 2) {
                    gpid = ids[ids.length - 2];
                }

                // Grand parent parent graph
                if (ids.length > 2) {
                    gppg = '/' + ids.slice(0, ids.length - 2).join('/');
                }
            }

            return {
                type: 'Feature',
                id: ou.id,
                geometry: {
                    type,
                    coordinates: coord,
                },
                properties: {
                    type,
                    id: ou.id,
                    name: ou.na,
                    hasCoordinatesDown: ou.hcd,
                    hasCoordinatesUp: ou.hcu,
                    level: ou.le,
                    grandParentParentGraph: gppg,
                    grandParentId: gpid,
                    parentGraph: ou.pg,
                    parentId: ou.pi,
                    parentName: ou.pn,
                    dimensions: ou.dimensions,
                },
            };
        })
        .filter(
            ({ geometry }) =>
                Array.isArray(geometry.coordinates) &&
                geometry.coordinates.length &&
                geometry.coordinates.flat().length
        );

export const drillUpDown = (layerConfig, parentId, parentGraph, level) => ({
    ...layerConfig,
    rows: [
        {
            dimension: dimConf.organisationUnit.objectName,
            items: [
                { id: parentId, path: `${parentGraph}/${parentId}` },
                { id: 'LEVEL-' + level },
            ],
        },
    ],
});

/**
 * Updates layer config to drill up or down.
 *
 * @param {Object} layerConfig - Current layer config.
 * @param {string} parentId - The parent id of the organisation unit.
 * @param {string} parentGraph - The parent graph of the organisation unit.
 * @param {Number} level - The level of the layer to drill up/down.
 * @param {Array<Object>} orgUnitsInLayerFilter - List of organization units to display in the map layer, where each object contains
 *                                             properties such as `id`, `level`, `parent`, `displayName`, `path`, and `children`.
 * @returns {Object} New layer config.
 */
export const zebraCustomDrillUpDown = (
    layerConfig,
    parentId,
    parentGraph,
    level,
    orgUnitsInLayerFilter
) => {
    return {
        ...layerConfig,
        rows: [
            {
                dimension: dimConf.organisationUnit.objectName,
                items:
                    level === 3
                        ? [
                              {
                                  id: parentId,
                                  path: `${parentGraph}/${parentId}`,
                              },
                              { id: 'LEVEL-' + level },
                          ]
                        : getOrgUnitItemsByLevel(orgUnitsInLayerFilter, level),
            },
        ],
    };
};

/**
 * Get organisation unit items by level.
 *
 * @param {Array<Object>} orgUnitsInLayerFilter - List of organization units to display in the map layer, where each object contains
 *                                             properties such as `id`, `level`, `parent`, `displayName`, `path`, and `children`.
 * @param {Number} level - The level of the layer to drill up/down.
 * @returns {Array<Object>} Organisation unit items in level
 */
function getOrgUnitItemsByLevel(orgUnitsInLayerFilter, level) {
    return orgUnitsInLayerFilter
        .filter(ou => ou.level === level || ou.level === level - 1)
        .flatMap(ou => {
            if (ou.level === level - 1) {
                return ou.children.map(child => {
                    return {
                        id: child.id,
                        name: child.displayName,
                        dimensionItemType: 'ORGANISATION_UNIT',
                    };
                });
            } else {
                return {
                    id: ou.id,
                    name: ou.displayName,
                    dimensionItemType: 'ORGANISATION_UNIT',
                };
            }
        });
}

// Called when plugin maps enter or exit fullscreen
export const onFullscreenChange = (map, isFullscreen = false) => {
    map.resize();

    if (!isFullscreen) {
        const bounds = map.getLayersBounds();

        if (Array.isArray(bounds)) {
            map.fitBounds(bounds);
        }
    }

    map.toggleMultiTouch(!isFullscreen);
    map.toggleScrollZoom(isFullscreen);
};
