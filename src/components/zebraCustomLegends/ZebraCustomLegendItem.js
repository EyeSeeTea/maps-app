import React from 'react';
import PropTypes from 'prop-types';
import ZebraCustomLegendItemRange from './ZebraCustomLegendItemRange';
import styles from './styles/ZebraCustomLegendItem.module.css';

const maxRadius = 15;

/**
 * ZebraCustomLegendItem is a customized version of the LegendItem component
 * defined in `LegendItem.js`.
 */
const ZebraCustomLegendItem = ({
    image,
    color,
    strokeColor,
    radius,
    name,
    startValue,
    endValue,
    count,
}) => {
    if (!name && startValue === undefined) {
        return null;
    }

    const symbol = {
        backgroundImage: image ? `url(${image})` : 'none',
        backgroundColor: color ? color : 'transparent',
    };

    if (strokeColor) {
        symbol.border = `1px solid ${strokeColor}`;
    }

    if (radius) {
        const r = Math.min(radius, maxRadius) * 2;

        symbol.width = `${r}px`;
        symbol.height = `${r}px`;
        symbol.borderRadius = '50%';
    }

    return (
        <div className={styles.customLegendItem} data-test="layerlegend-item">
            <ZebraCustomLegendItemRange
                name={name}
                startValue={startValue}
                endValue={endValue}
                count={count}
            />
            <div className={styles.customLegendItemSymbol}>
                <span style={symbol} />
            </div>
        </div>
    );
};

ZebraCustomLegendItem.propTypes = {
    type: PropTypes.string,
    image: PropTypes.string,
    color: PropTypes.string,
    strokeColor: PropTypes.string,
    fillColor: PropTypes.string,
    radius: PropTypes.number,
    weight: PropTypes.number,
    name: PropTypes.string,
    startValue: PropTypes.number,
    endValue: PropTypes.number,
    count: PropTypes.number,
};

export default ZebraCustomLegendItem;
