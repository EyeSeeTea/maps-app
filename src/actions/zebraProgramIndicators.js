import * as types from '../constants/actionTypes';

/**
 * Creates an action to load zebra program indicators.
 *
 * @returns {Object} The action object with type `types.ZEBRA_PROGRAM_INDICATORS_LOAD`.
 */
export const loadZebraProgramIndicators = () => ({
    type: types.ZEBRA_PROGRAM_INDICATORS_LOAD,
});

/**
 * @typedef {Object} ProgramIndicator
 * @property {string} id - The ID of the program indicator.
 * @property {string} name - The name of the program indicator.
 * @property {string|null} disease - The name of the disease associated with the indicator.
 * @property {string|null} hazardType - The name of the hazardType associated with the indicator.
 * @property {string|null} incidentStatus - The name of the incidentStatus associated with the indicator.
 */
/**
 * Creates an action to set zebra program indicators.
 *
 * @param {Object} programIndicators - The program indicators to set.
 * @param {Array.<ProgramIndicator>} programIndicators.dashboard - The program indicators for the dashboard page.
 * @param {Array.<ProgramIndicator>} programIndicators.eventTracker - The program indicators for the event tracker page.
 * @returns {Object} The action object with type `types.ZEBRA_PROGRAM_INDICATORS_SET` and payload.
 */
export const setZebraProgramIndicators = programIndicators => ({
    type: types.ZEBRA_PROGRAM_INDICATORS_SET,
    payload: programIndicators,
});
