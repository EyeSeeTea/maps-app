import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Layer from './Layer';
import Timeline from '../../periods/Timeline';
import PeriodName from '../PeriodName';
import ZebraCustomPopup from '../zebraCustomPopup/ZebraCustomPopup';
import { filterData } from '../../../util/filter';
import { getPeriodFromFilters } from '../../../util/analytics';
import { polygonsToPoints } from '../../../util/geojson';
import { getLabelStyle } from '../../../util/labels';
import {
    RENDERING_STRATEGY_SINGLE,
    RENDERING_STRATEGY_TIMELINE,
    THEMATIC_CHOROPLETH,
    THEMATIC_BUBBLE,
    BOUNDARY_LAYER,
    ORG_UNIT_COLOR,
    ORG_UNIT_RADIUS_SMALL,
} from '../../../constants/layers';
import {
    loadZebraCustomPopupData,
    cleanZebraCustomPopupData,
} from '../../../actions/zebraCustomPopupData';
import {
    DEFAULT_START_DATE,
    DEFAULT_END_DATE,
} from '../../../constants/layers';

/**
 * ZebraCustomThematicLayer is a customized version of the ThematicLayer component
 * defined in `ThematicLayer.js`. This component overrides the popup.
 * and functionality to fit specific needs.
 */
class ZebraCustomThematicLayer extends Layer {
    static propTypes = {
        cleanZebraCustomPopupData: PropTypes.func.isRequired,
        popupData: PropTypes.shape({
            data: PropTypes.object,
            lastUpdatedDate: PropTypes.string,
        }),
        programIndicators: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                name: PropTypes.string,
                disease: PropTypes.string,
                hazardType: PropTypes.string,
                incidentStatus: PropTypes.string,
            })
        ),
        loadZebraCustomPopupData: PropTypes.func.isRequired,
        currentAppInfo: PropTypes.shape({
            app: PropTypes.string.isRequired,
            page: PropTypes.string,
        }),
    };

    createLayer() {
        const {
            id,
            index,
            opacity,
            isVisible,
            data,
            dataFilters,
            labels,
            valuesByPeriod,
            renderingStrategy = RENDERING_STRATEGY_SINGLE,
            thematicMapType = THEMATIC_CHOROPLETH,
            noDataColor,
        } = this.props;

        const { period } = this.state;

        const bubbleMap = thematicMapType === THEMATIC_BUBBLE;

        let periodData = bubbleMap ? polygonsToPoints(data) : data;

        if (renderingStrategy !== RENDERING_STRATEGY_SINGLE) {
            const values = valuesByPeriod[period.id] || {};

            periodData = periodData.map(f => ({
                ...f,
                properties: {
                    ...f.properties,
                    ...values[f.id],
                    ...(f.properties.hasAdditionalGeometry &&
                        f.geometry.type === 'Point' && {
                            color: ORG_UNIT_COLOR,
                            radius: ORG_UNIT_RADIUS_SMALL,
                        }),
                },
            }));

            // Remove org unit features if noDataColor is missing
            if (!noDataColor) {
                periodData = periodData.filter(
                    feature => values[feature.id] !== undefined
                );
            }
        }

        const map = this.context.map;

        const filteredData = filterData(periodData, dataFilters);

        const config = {
            type: 'choropleth',
            id,
            index,
            opacity,
            isVisible,
            data: filteredData,
            hoverLabel: '{name} ({value})',
            color: noDataColor,
            onClick: this.onFeatureClick.bind(this),
            onRightClick: this.onFeatureRightClick.bind(this),
        };

        if (labels) {
            config.label = '{name}';
            config.labelStyle = getLabelStyle(this.props);
        }

        // Add boundaries as a separate layer
        if (bubbleMap) {
            this.layer = map.createLayer({
                type: 'group',
                id,
                index,
                opacity,
                isVisible,
            });

            this.layer.addLayer({
                type: BOUNDARY_LAYER,
                data: data.map(f => ({
                    ...f,
                    properties: {
                        ...f.properties,
                        style: {
                            color: ORG_UNIT_COLOR,
                            weight: 0.5,
                        },
                    },
                })),
                style: {},
            });

            this.layer.addLayer(config);
        } else {
            this.layer = map.createLayer(config);
        }

        map.addLayer(this.layer);

        // Fit map to layer bounds once (when first created)
        this.fitBoundsOnce();
    }

    // Set initial period
    setPeriod(callback) {
        const {
            period,
            periods,
            renderingStrategy = RENDERING_STRATEGY_SINGLE,
        } = this.props;

        if (!period && !periods) {
            return;
        }

        const initialPeriod = {
            period:
                renderingStrategy === RENDERING_STRATEGY_SINGLE
                    ? null
                    : period || periods[0],
        };

        // setPeriod without callback is called from the constructor (unmounted)
        if (!callback) {
            this.state = initialPeriod;
        } else {
            this.setState(initialPeriod, callback);
        }
    }

    handlePopupClose = () => {
        const { cleanZebraCustomPopupData } = this.props;
        cleanZebraCustomPopupData();
        this.onPopupClose();
    };

    getPopup() {
        const { columns, popupData, currentAppInfo } = this.props;
        const { popup } = this.state;
        const { coordinates, feature } = popup;
        const { value } = feature.properties;
        const indicator = columns[0].items[0].name || '';

        return (
            <ZebraCustomPopup
                coordinates={coordinates}
                onClose={this.handlePopupClose}
                data={popupData.data}
                value={value}
                name={indicator}
                lastUpdatedDate={popupData.lastUpdatedDate}
                className="zebra-custom-popup"
                popupType={currentAppInfo?.page}
            />
        );
    }

    render() {
        const { periods, renderingStrategy, filters, popupData } = this.props;
        const { period, popup } = this.state;
        const { id } = getPeriodFromFilters(filters) || {};

        return (
            <Fragment>
                {renderingStrategy === RENDERING_STRATEGY_TIMELINE && period && (
                    <Fragment>
                        <PeriodName period={period.name} isTimeline={true} />
                        <Timeline
                            periodId={id}
                            period={period}
                            periods={periods}
                            onChange={this.onPeriodChange}
                        />
                    </Fragment>
                )}
                {popup && popupData && this.getPopup()}
            </Fragment>
        );
    }

    onPeriodChange = period => this.setState({ period });

    onFeatureClick(evt) {
        const {
            loadZebraCustomPopupData,
            cleanZebraCustomPopupData,
            startDate,
            endDate,
            programIndicators,
            currentAppInfo,
        } = this.props;

        cleanZebraCustomPopupData();

        if (evt.feature.properties.id) {
            loadZebraCustomPopupData({
                orgUnits: [evt.feature.properties.id],
                startDate: startDate ? startDate : DEFAULT_START_DATE,
                endDate: endDate ? endDate : DEFAULT_END_DATE,
                programIndicators: programIndicators,
                popupType: currentAppInfo?.page,
            });
        }
        this.setState({ popup: evt });
    }
}

export default connect(
    state => ({
        popupData: state.zebraCustomPopupData,
        programIndicators: state.zebraProgramIndicators,
        currentAppInfo: state.currentAppInfo,
    }),
    { loadZebraCustomPopupData, cleanZebraCustomPopupData }
)(ZebraCustomThematicLayer);
