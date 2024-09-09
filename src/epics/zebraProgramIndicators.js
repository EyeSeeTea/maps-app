import { combineEpics } from 'redux-observable';
import 'rxjs/add/operator/concatMap';
import { getInstance as getD2 } from 'd2';

import * as types from '../constants/actionTypes';
import { setZebraProgramIndicators } from '../actions/zebraProgramIndicators';
import { errorActionCreator } from '../actions/helpers';

const MAPS_NAMESPACE = 'maps';
const DASHBOARD_PROGRAM_INDICATORS_KEY = 'dashboard-program-indicators';
const EVENT_TRACKER_PROGRAM_INDICATORS_KEY = 'event-tracker-program-indicators';

/**
 * Epic to load zebra program indicators from data store.
 * This epic listens for actions of type `types.ZEBRA_PROGRAM_INDICATORS_LOAD` and,
 * upon receiving such an action, it fetches the program indicators from the data store.
 * If the data store has the required namespace, it retrieves the program indicators
 * from dashboard-program-indicators and event-tracker-program-indicators keys,
 * and dispatches them using `setZebraProgramIndicators`.
 * In case of an error, it dispatches an error action using `errorActionCreator`.
 * @param {Observable} action$ - The stream of actions to listen to.
 * @returns {Observable} An observable stream of actions.
 */
export const loadZebraProgramIndicators = action$ =>
    action$.ofType(types.ZEBRA_PROGRAM_INDICATORS_LOAD).concatMap(async () => {
        try {
            const d2 = await getD2();
            const hasNamespace = await d2.dataStore.has(MAPS_NAMESPACE);

            if (hasNamespace) {
                const mapsNamespace = await d2.dataStore.get(MAPS_NAMESPACE);

                const dashboardProgramIndicators = await mapsNamespace.get(
                    DASHBOARD_PROGRAM_INDICATORS_KEY
                );

                const eventTrackerProgramIndicators = await mapsNamespace.get(
                    EVENT_TRACKER_PROGRAM_INDICATORS_KEY
                );

                return setZebraProgramIndicators({
                    dashboard: dashboardProgramIndicators
                        ? dashboardProgramIndicators
                        : [],
                    eventTracker: eventTrackerProgramIndicators
                        ? eventTrackerProgramIndicators
                        : [],
                });
            }
        } catch (e) {
            return errorActionCreator(types.ZEBRA_PROGRAM_INDICATORS_ERROR)(e);
        }
    });

export default combineEpics(loadZebraProgramIndicators);
