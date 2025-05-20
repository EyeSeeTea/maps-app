import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';
import { isEmpty } from 'lodash';

import './styles/ZebraCustomPopup.css';
import { ZEBRA_PAGE } from '../../../constants/zebraPage';

/**
 * ZebraCustomPopup is a customized version of the Popup component
 * defined in `Popup.js`.
 */
const ZebraCustomPopup = (props, context) => {
    const {
        className = '',
        coordinates,
        onClose,
        data,
        lastUpdatedDate,
        value,
        name,
        popupType,
    } = props;
    const { map } = context;

    const container = useMemo(() => document.createElement('div'), []);

    // Create and open popup on map
    useEffect(() => {
        container.className = className;
        map.openPopup(container, coordinates, onClose);
    }, [map, container, className, coordinates, onClose]);

    // Close popup if component is unmounted
    useEffect(() => {
        return () => map.closePopup();
    }, []);

    const popUpDataContent = useMemo(() => {
        if (data && !isEmpty(data)) {
            switch (popupType) {
                case ZEBRA_PAGE.DASHBOARD:
                    return (
                        <div className="popup-data-content">
                            {Object.keys(data).map(incidentStatus => {
                                const { diseases } = data[incidentStatus];

                                return (
                                    <div
                                        key={incidentStatus}
                                        className="popup-data-incident-status-container"
                                    >
                                        <span className="popup-data-incident-status">
                                            {incidentStatus}
                                        </span>
                                        {Object.keys(diseases).map(disease => (
                                            <span
                                                key={disease}
                                                className="popup-data-incident-text"
                                            >
                                                {diseases[disease]} {disease}
                                            </span>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    );
                case ZEBRA_PAGE.EVENT_TRACKER:
                    return (
                        <div className="popup-data-content single-col">
                            {Object.keys(data).map(dataSource => (
                                <span
                                    key={dataSource}
                                    className="popup-data-incident-text"
                                >
                                    {dataSource}: {data[dataSource]}
                                </span>
                            ))}
                        </div>
                    );
            }
        }
    }, []);

    return createPortal(
        <div className="popup-data-container">
            {popUpDataContent || (
                <span className="popup-data-value">
                    {name}: {value}
                </span>
            )}
            {lastUpdatedDate ? (
                <>
                    <hr className="popup-data-hr" />
                    <span className="popup-data-last-updated">
                        {i18n.t('Last updated')}: {lastUpdatedDate}
                    </span>
                </>
            ) : null}
        </div>,
        container
    );
};

ZebraCustomPopup.contextTypes = {
    map: PropTypes.object,
};

ZebraCustomPopup.propTypes = {
    coordinates: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    className: PropTypes.string,
    data: PropTypes.object,
    lastUpdatedDate: PropTypes.string,
    popupType: PropTypes.oneOf([
        ZEBRA_PAGE.DASHBOARD,
        ZEBRA_PAGE.EVENT_TRACKER,
    ]),
    value: PropTypes.number,
    name: PropTypes.string,
};

export default ZebraCustomPopup;
