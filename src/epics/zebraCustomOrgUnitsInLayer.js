import 'rxjs/add/operator/concatMap';
import { combineEpics } from 'redux-observable';
import * as types from '../constants/actionTypes';
import { closeContextMenu } from '../actions/map';
import { loadLayer } from '../actions/layers';
import { zebraCustomDrillUpDown } from '../util/map';

/**
 * Custom ZEBRA epic to change layer config according with drill up/down action.
 * @param {Observable} action$ - The stream of actions to listen to.
 * @param {Object} store - The app store
 * @returns {Observable} An observable stream of actions.
 */
export const zebraCustomDrillLayer = (action$, store) =>
    action$
        .ofType(types.ZEBRA_CUSTOM_LAYER_DRILL)
        .concatMap(
            ({ layerId, parentId, parentGraph, level }) =>
                new Promise(resolve => {
                    // Must return a promise
                    const state = store.getState();
                    const zebraCustomOrgUnitsInLayerFilter =
                        state.zebraCustomOrgUnitsInLayer;
                    const layerConfig = state.map.mapViews.filter(
                        config => config.id === layerId
                    )[0];

                    resolve(
                        zebraCustomDrillUpDown(
                            layerConfig,
                            parentId,
                            parentGraph,
                            level,
                            zebraCustomOrgUnitsInLayerFilter
                        )
                    );
                })
        )
        .mergeMap(config => [closeContextMenu(), loadLayer(config)]);

export default combineEpics(zebraCustomDrillLayer);
