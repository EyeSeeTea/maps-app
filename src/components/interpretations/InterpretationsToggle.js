import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import { grey800 } from 'material-ui/styles/colors';
import { openInterpretationsPanel, closeInterpretationsPanel } from '../../actions/ui';
import { HEADER_HEIGHT, INTERPRETATIONS_PANEL_WIDTH } from '../../constants/layout';

const style = {
    position: 'absolute',
    bottom: 15,
    right: INTERPRETATIONS_PANEL_WIDTH,
    width: 24,
    height: 40,
    padding: 0,
    background: '#fff',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    boxShadow: '3px 1px 5px -1px rgba(0, 0, 0, 0.2)',
    zIndex: 1100,
};

// This expand/collapse toggle is separate from InterpretationsPanel to avoid overflow issue
const InterpretationsToggle = ({ isOpen, openInterpretationsPanel, closeInterpretationsPanel }) =>
    isOpen ? (
        <IconButton
            onClick={closeInterpretationsPanel}
            style={style}
            disableTouchRipple={true}
        >
            <SvgIcon icon="ChevronRight" color={grey800} />
        </IconButton>
    ) : (
        <IconButton
            onClick={openInterpretationsPanel}
            style={{ ...style, right: 0 }}
            disableTouchRipple={true}
        >
            <SvgIcon icon="ChevronLeft" color={grey800} />
        </IconButton>
    );

InterpretationsToggle.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    openInterpretationsPanel: PropTypes.func.isRequired,
    closeInterpretationsPanel: PropTypes.func.isRequired,
};

export default connect(
    state => ({
        isOpen: state.ui.interpretationsPanelOpen,
    }),
    { openInterpretationsPanel, closeInterpretationsPanel }
)(InterpretationsToggle);
