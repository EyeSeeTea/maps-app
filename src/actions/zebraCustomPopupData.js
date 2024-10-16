import * as types from '../constants/actionTypes';

/**
 * @typedef {Object} Filter
 * @property {string} key - The key of the filter.
 * @property {string} value - The value of the filter.
 */
/**
 * Creates an action to load zebra custom popup data.
 *
 * @param {Array.<Filter>} filters - The filters to apply for loading the custom popup data.
 * @returns {Object} The action object with type `types.ZEBRA_CUSTOM_POPUP_DATA_LOAD` and payload.
 */
export const loadZebraCustomPopupData = filters => ({
    type: types.ZEBRA_CUSTOM_POPUP_DATA_LOAD,
    payload: filters,
});

/**
 * @typedef {Object} CustomPopupData
 * @property {Object} data - The data to be set in the custom popup, where each key is an incident status and each value is an object with diseases and hazard types.
 * @property {string} lastUpdatedDate - The date when the data was last updated, formatted as a string MM/DD/YYY.
 */
/**
 * Creates an action to set zebra custom popup data.
 *
 * @param {CustomPopupData} data - The custom popup data to set, including data and last updated date.
 * @returns {Object} The action object with type `types.ZEBRA_CUSTOM_POPUP_DATA_SET` and payload.
 */
export const setZebraCustomPopupData = data => ({
    type: types.ZEBRA_CUSTOM_POPUP_DATA_SET,
    payload: data,
});

/**
 * Creates an action to clean zebra custom popup data.
 *
 * @returns {Object} The action object with type `types.ZEBRA_CUSTOM_POPUP_DATA_CLEAN`.
 */
export const cleanZebraCustomPopupData = () => ({
    type: types.ZEBRA_CUSTOM_POPUP_DATA_CLEAN,
});
