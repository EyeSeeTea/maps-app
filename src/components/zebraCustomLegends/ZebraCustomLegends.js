import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ZebraCustomLegend from './ZebraCustomLegend';
import styles from './styles/ZebraCustomLegends.module.css';

export const ZebraCustomLegends = ({ legends }) => {
    return (
        <div className={cx(styles.customLegends, styles.bottomright)}>
            {legends.map((legend, index) => (
                <div key={index} className={styles.customLegend}>
                    <ZebraCustomLegend {...legend} />
                </div>
            ))}
        </div>
    );
};

ZebraCustomLegends.propTypes = {
    legends: PropTypes.array.isRequired,
};

export default ZebraCustomLegends;
