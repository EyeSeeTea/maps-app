import React from 'react';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import ZebraCustomBubbles from './ZebraCustomBubbles';
import ZebraCustomLegendItem from './ZebraCustomLegendItem';
import styles from './styles/ZebraCustomLegend.module.css';

/**
 * ZebraCustomLegend is a customized version of the Legend component
 * defined in `Legend.js`.
 */

// Rendering a layer legend in the left drawer, on a map (download) or in a control (plugin)
const ZebraCustomLegend = ({
    description,
    filters,
    groups,
    unit,
    items,
    bubbles,
    explanation,
    url,
    source,
    sourceUrl,
}) => (
    <dl className={styles.customLegend} data-test="layerlegend">
        {description && <div className={styles.description}>{description}</div>}
        {groups && (
            <div className={styles.group}>
                {groups.length > 1 ? i18n.t('Groups') : i18n.t('Group')}
                {groups.map(({ id, name }) => (
                    <div key={id}>{name}</div>
                ))}
            </div>
        )}
        {unit && items && <div className={styles.unit}>{unit}</div>}
        {bubbles ? (
            <ZebraCustomBubbles {...bubbles} classes={items} />
        ) : (
            Array.isArray(items) && (
                <div className={styles.customLegendItemContainer}>
                    {items.map((item, index) => (
                        <ZebraCustomLegendItem
                            {...item}
                            key={`item-${index}`}
                        />
                    ))}
                </div>
            )
        )}
        {url && <img className={styles.legendImage} src={url} />}
        {Array.isArray(filters) && (
            <div className={styles.filters}>
                <div>{i18n.t('Filters')}:</div>
                {filters.map((filter, index) => (
                    <div key={index}>{filter}</div>
                ))}
            </div>
        )}
        {Array.isArray(explanation) && (
            <div className={styles.explanation}>
                {explanation.map((expl, index) => (
                    <div key={index}>{expl}</div>
                ))}
            </div>
        )}
        {source && (
            <div className={styles.source}>
                {i18n.t('Source')}:&nbsp;
                {sourceUrl ? (
                    <a href={sourceUrl} target="_blank" rel="noreferrer">
                        {source}
                    </a>
                ) : (
                    <span>{source}</span>
                )}
            </div>
        )}
    </dl>
);

ZebraCustomLegend.propTypes = {
    description: PropTypes.string,
    filters: PropTypes.array,
    groups: PropTypes.array,
    unit: PropTypes.string,
    items: PropTypes.array,
    bubbles: PropTypes.shape({
        radiusLow: PropTypes.number.isRequired,
        radiusHigh: PropTypes.number.isRequired,
        color: PropTypes.string,
    }),
    url: PropTypes.string,
    explanation: PropTypes.array,
    source: PropTypes.string,
    sourceUrl: PropTypes.string,
};

export default ZebraCustomLegend;
