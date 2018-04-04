import { combineEpics } from 'redux-observable';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/mergeMap';
import { fromPromise } from 'rxjs/observable/fromPromise';
import * as types from '../constants/actionTypes';
import { errorActionCreator } from '../actions/helpers';
import { mapRequest } from '../util/requests';
import { setMap } from '../actions/map';
import { loadLayer, } from '../actions/layers';
import { openLayersPanel, closeLayersPanel, openRightPanel, closeRightPanel } from '../actions/ui';
import { setInterpretations, setCurrentInterpretation, openInterpretationDialog } from '../actions/interpretations';
import { setMapRoute } from '../util/routes';
import compact from 'lodash/fp/compact';

// Load one favorite
export const loadFavorite = action$ =>
    action$
        .ofType(types.FAVORITE_LOAD)
        .concatMap(({ id, interpretationId }) => {
            const state = store.getState();
            return fromPromise(
                    mapRequest(id).catch(errorActionCreator(types.FAVORITE_LOAD_ERROR))
                )
                .mergeMap(config => compact([
                    setMap(config),
                    ...config.mapViews.map(loadLayer),
                    setInterpretations(config.interpretations),
                    setMapRoute(id),
                    interpretationId ? openRightPanel() : closeRightPanel(),
                    interpretationId ? closeLayersPanel() : openLayersPanel(),
                    interpretationId === "new"
                        ? openInterpretationDialog({})
                        : setCurrentInterpretation({id: interpretationId})
                ]))
        });

export default combineEpics(loadFavorite);
