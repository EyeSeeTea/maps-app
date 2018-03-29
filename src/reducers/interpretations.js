import * as types from '../constants/actionTypes';
import _ from 'lodash';

const defaultState = {
    isExpanded: true,
    isWriteInterpretationDialogOpen: false,
    interpretationToEdit: null,
    interpretations: [],
    currentInterpretationId: null,
};

const interpretations = (state = defaultState, action) => {
    switch (action.type) {
        case types.INTERPRETATIONS_TOGGLE_EXPAND:
            return {...state, isExpanded: !state.isExpanded};
        case types.INTERPRETATIONS_OPEN_WRITE_DIALOG:
            return {...state, interpretationToEdit: action.interpretation};
        case types.INTERPRETATIONS_CLOSE_WRITE_DIALOG:
            return {...state, interpretationToEdit: null};
        case types.INTERPRETATIONS_SET:
            const newInterpretations = _(action.interpretations).sortBy("created").reverse().value();
            const currentInterpretationObj =
                action.currentInterpretationId === undefined ? {} : {currentInterpretationId};
            return {...state, interpretations: newInterpretations, ...currentInterpretationObj};
        case types.INTERPRETATIONS_SET_CURRENT:
            return {...state, currentInterpretationId: action.interpretation ? action.interpretation.id : null};
        default:
            return state;
    }
};

export default interpretations;
