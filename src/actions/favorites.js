import * as types from '../constants/actionTypes';

export const loadFavorite = (id, interpretationId) => ({
    type: types.FAVORITE_LOAD,
    id,
    interpretationId,
});

export const saveFavorite = (fields) => ({
    type: types.FAVORITE_SAVE,
    fields,
});

export const saveNewFavorite = config => ({
    type: types.FAVORITE_SAVE_NEW,
    config,
});

export const openFavoritesDialog = () => ({
    type: types.FAVORITES_DIALOG_OPEN,
});

export const closeFavoritesDialog = () => ({
    type: types.FAVORITES_DIALOG_CLOSE,
});

export const openSaveNewFavoriteDialog = () => ({
    type: types.FAVORITE_SAVE_NEW_DIALOG_OPEN,
});

export const closeSaveNewFavoriteDialog = () => ({
    type: types.FAVORITE_SAVE_NEW_DIALOG_CLOSE,
});
