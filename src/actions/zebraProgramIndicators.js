import * as types from '../constants/actionTypes';

/**
 * Creates an action to load zebra program indicators.
 *
 * @param {Object} dataStoreInfo - Information required to load the zebra program indicators.
 * @param {string} dataStoreInfo.zebraNamespace - The namespace in the datastore for zebra indicators.
 * @param {string} dataStoreInfo.dashboardKey - The key in the datastore for retrieving dashboard program indicators info.
 * @returns {Object} The action object with type `types.ZEBRA_PROGRAM_INDICATORS_LOAD` and the passed data as payload.
 */
export const loadZebraProgramIndicators = dataStoreInfo => ({
    type: types.ZEBRA_PROGRAM_INDICATORS_LOAD,
    payload: dataStoreInfo,
});

/**
 * @typedef {Object} ProgramIndicator
 * @property {string} id - The ID of the program indicator.
 * @property {string} name - The name of the program indicator.
 * @property {string|null} disease - The name of the disease associated with the indicator.
 * @property {string|null} incidentStatus - The name of the incidentStatus associated with the indicator.
 * @property {string|null} dataSource - The data source associated with the indicator.
 */
/**
 * Creates an action to set zebra program indicators.
 *
 * @param {Array.<ProgramIndicator>} programIndicators - The program indicators to set.
 * @returns {Object} The action object with type `types.ZEBRA_PROGRAM_INDICATORS_SET` and payload.
 */
export const setZebraProgramIndicators = programIndicators => ({
    type: types.ZEBRA_PROGRAM_INDICATORS_SET,
    payload: programIndicators,
});
