import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles/ZebraCustomLegendItemRange.module.css';

/**
 * ZebraCustomLegendItemRange is a customized version of the LegendItemRange component
 * defined in `LegendItemRange.js`.
 */
const ZebraCustomLegendItemRange = ({ name = '', startValue, endValue }) => (
    <div className={styles.customLegendItemRange}>
        {isNaN(startValue) ? name : `${name} ${startValue} - ${endValue}`}
    </div>
);

ZebraCustomLegendItemRange.propTypes = {
    name: PropTypes.string,
    startValue: PropTypes.number,
    endValue: PropTypes.number,
    count: PropTypes.number,
};

export default ZebraCustomLegendItemRange;
