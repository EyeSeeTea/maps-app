import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import DetailsCard from './details/DetailsCard';
import { HEADER_HEIGHT, INTERPRETATIONS_PANEL_WIDTH } from '../../constants/layout';

const style = {
    top: HEADER_HEIGHT,
    height: 'auto',
    bottom: 0,
    backgroundColor: '#fafafa',
    boxShadow: '0 3px 10px 0 rgba(0, 0, 0, 0.227451)',
    overflowX: 'hidden',
    overflowY: 'auto',
    zIndex: 1190,
};

const InterpretationsPanel = ({
    interpretationsPanelOpen,
}) => (
    <Drawer
        open={interpretationsPanelOpen}
        openSecondary={true}
        containerStyle={style}
        width={INTERPRETATIONS_PANEL_WIDTH}
    >
        <DetailsCard />
    </Drawer>
);

InterpretationsPanel.propTypes = {
    interpretationsPanelOpen: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    interpretationsPanelOpen: state.ui.interpretationsPanelOpen,
});

export default connect(mapStateToProps, {})(InterpretationsPanel);
