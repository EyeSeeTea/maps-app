import * as types from '../constants/actionTypes';

export const resizeScreen = (width, height) => ({
    type: types.SCREEN_RESIZE,
    width,
    height,
});

export const closeLayersPanel = id => ({
    type: types.LAYERS_PANEL_CLOSE,
});

export const openLayersPanel = () => ({
    type: types.LAYERS_PANEL_OPEN,
});

export const closeInterpretationsPanel = id => ({
    type: types.INTERPRETATIONS_PANEL_CLOSE,
});

export const openInterpretationsPanel = () => ({
    type: types.INTERPRETATIONS_PANEL_OPEN,
});
