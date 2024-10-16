import * as types from '../constants/actionTypes';

const zebraProgramIndicators = (state = null, action) => {
    switch (action.type) {
        case types.ZEBRA_PROGRAM_INDICATORS_SET:
            return action.payload;

        default:
            return state;
    }
};

export default zebraProgramIndicators;
