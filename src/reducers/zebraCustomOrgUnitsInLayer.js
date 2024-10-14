import * as types from '../constants/actionTypes';

const zebraCustomOrgUnitsInLayer = (state = null, action) => {
    switch (action.type) {
        case types.ORG_UNITS_IN_LAYER_FILTER_SET:
            return action.payload;

        case types.ORG_UNITS_IN_LAYER_FILTER_CLEAN:
            return null;

        default:
            return state;
    }
};

export default zebraCustomOrgUnitsInLayer;
