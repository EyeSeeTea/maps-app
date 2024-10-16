import * as types from '../constants/actionTypes';

/**
 * @typedef {Object} CurrentAppInfo
 * @property {string} app - The application identifier.
 * @property {string} [page] - Optional. The current page identifier.
 */
/**
 * Creates an action to set the current app info.
 *
 * @param {CurrentAppInfo} data - The object with the info for the current app with `app` and `page`.
 * @returns {Object} The action object with type `types.CURRENT_APP_INFO_SET` and payload.
 */
export const setCurrentAppInfo = data => ({
    type: types.CURRENT_APP_INFO_SET,
    payload: data,
});

/**
 * Creates an action to clean the current app info.
 *
 * @returns {Object} The action object with type `types.CURRENT_APP_INFO_CLEAN`.
 */
export const cleanCurrentAppInfo = () => ({
    type: types.CURRENT_APP_INFO_CLEAN,
});
