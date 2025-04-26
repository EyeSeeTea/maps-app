import { combineEpics } from 'redux-observable';
import 'rxjs/add/operator/concatMap';
import { getInstance as getD2 } from 'd2';

import * as types from '../constants/actionTypes';
import { setZebraProgramIndicators } from '../actions/zebraProgramIndicators';
import { errorActionCreator } from '../actions/helpers';

/**
 * Epic to load zebra program indicators from data store.
 * In case of an error, it dispatches an error action using `errorActionCreator`.
 * @param {Observable} action$ - The stream of actions to listen to.
 * @returns {Observable} An observable stream of actions.
 */
export const loadZebraProgramIndicators = action$ =>
    action$
        .ofType(types.ZEBRA_PROGRAM_INDICATORS_LOAD)
        .concatMap(async action => {
            try {
                const { zebraNamespace, programIndicatorKey } = action.payload;
                const d2 = await getD2();
                const hasNamespace = await d2.dataStore.has(zebraNamespace);

                if (hasNamespace) {
                    const mapsNamespace = await d2.dataStore.get(
                        zebraNamespace
                    );

                    const programIndicators = await mapsNamespace.get(
                        programIndicatorKey
                    );

                    return setZebraProgramIndicators(
                        programIndicators ? programIndicators : []
                    );
                }
            } catch (e) {
                return errorActionCreator(types.ZEBRA_PROGRAM_INDICATORS_ERROR)(
                    e
                );
            }
        });

export default combineEpics(loadZebraProgramIndicators);
