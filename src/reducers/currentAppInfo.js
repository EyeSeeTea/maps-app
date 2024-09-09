import * as types from '../constants/actionTypes';

const currentAppInfo = (state = null, action) => {
    switch (action.type) {
        case types.CURRENT_APP_INFO_SET:
            return action.payload;

        case types.CURRENT_APP_INFO_CLEAN:
            return null;

        default:
            return state;
    }
};

export default currentAppInfo;
