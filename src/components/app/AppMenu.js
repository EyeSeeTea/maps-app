import React from 'react';
import AddLayerButton from '../layers/overlays/AddLayerButton';
import FileMenu from './FileMenu';
import DownloadButton from '../download/DownloadButton';
import InterpretationsToggle from '../interpretations/InterpretationsToggle';
import cx from 'classnames';
import styles from './styles/AppMenu.module.css';

export const AppMenu = () => (
    <div className={cx(styles.appMenu, 'app-menu-container')}>
        <AddLayerButton />
        <FileMenu />
        <DownloadButton />
        <InterpretationsToggle />
    </div>
);

export default AppMenu;
