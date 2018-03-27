import * as types from '../constants/actionTypes';

export const toggleDetailsExpand = () => ({
    type: types.DETAILS_TOGGLE_EXPAND,
});

export const openSharingDialog = () => ({
    type: types.SHARING_DIALOG_OPEN,
});

export const closeSharingDialog = map => ({
    type: types.SHARING_DIALOG_CLOSE,
    payload: map,
});

export const openDetailsDialog = () => ({
    type: types.DETAILS_DIALOG_OPEN,
});

export const closeDetailsDialog = favorite => ({
    type: types.DETAILS_DIALOG_CLOSE,
    favorite,
});
