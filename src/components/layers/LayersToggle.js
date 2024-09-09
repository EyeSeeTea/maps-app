import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IconChevronLeft24, IconChevronRight24 } from '@dhis2/ui';
import cx from 'classnames';

import { openLayersPanel, closeLayersPanel } from '../../actions/ui';
import styles from './styles/LayersToggle.module.css';

// This expand/collapse toggle is separate from LayersPanel to avoid overflow issue
const LayersToggle = ({
    isOpen,
    isDownload,
    openLayersPanel,
    closeLayersPanel,
}) =>
    !isDownload && (
        <div
            onClick={isOpen ? closeLayersPanel : openLayersPanel}
            className={cx(styles.layersToggle, 'layers-toggle-container')}
            style={isOpen ? {} : { left: 0 }}
        >
            {isOpen ? <IconChevronLeft24 /> : <IconChevronRight24 />}
        </div>
    );

LayersToggle.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    isDownload: PropTypes.bool.isRequired,
    openLayersPanel: PropTypes.func.isRequired,
    closeLayersPanel: PropTypes.func.isRequired,
};

export default connect(
    state => ({
        isOpen: state.ui.layersPanelOpen,
        isDownload: state.download.showDialog,
    }),
    { openLayersPanel, closeLayersPanel }
)(LayersToggle);
