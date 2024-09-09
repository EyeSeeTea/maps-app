import * as types from '../constants/actionTypes';

const zebraCustomPopupData = (state = null, action) => {
    switch (action.type) {
        case types.ZEBRA_CUSTOM_POPUP_DATA_SET:
            return action.payload;

        case types.ZEBRA_CUSTOM_POPUP_DATA_CLEAN:
            return null;

        default:
            return state;
    }
};

export default zebraCustomPopupData;
