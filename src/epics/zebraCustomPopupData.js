import { combineEpics } from 'redux-observable';
import 'rxjs/add/operator/concatMap';
import { getInstance as getD2 } from 'd2';
import moment from 'moment';
import 'moment-timezone';

import * as types from '../constants/actionTypes';
import { setZebraCustomPopupData } from '../actions/zebraCustomPopupData';
import { errorActionCreator } from '../actions/helpers';
import { getDateAsLocaleDateTimeString } from '../util/time';

/**
 * Maps totals from rows to corresponding program indicators.
 * @param {Array<Object>} programIndicators - An array of program indicator objects, where each object contains
 *                                             properties such as `id`, `name`, `disease`, and `incidentStatus`.
 * @param {Array<Array<any>>} rows - An array of rows where each row is an array where the first element is an ID,
 *                                   and subsequent elements include a total value.
 * @returns {Array<Object>} An array of objects where each object contains the properties of a program indicator
 *                           and its corresponding total from the rows. If no match is found, an empty array is returned.
 */
function mapTotalInRowsToCorrespondingIndicator(programIndicators, rows) {
    if (!programIndicators) return [];

    return programIndicators.flatMap(indicator => {
        if (!indicator.id) {
            return [];
        }

        const rowIndicator = rows?.find(([id]) => indicator.id === id);
        if (!rowIndicator) {
            return [];
        }

        const [, , total] = rowIndicator;

        if (!total) {
            return [];
        }

        return [
            {
                id: indicator.id,
                name: indicator.name,
                disease: indicator.disease,
                incidentStatus: indicator.incidentStatus,
                total: total ? parseFloat(total) : 0,
            },
        ];
    });
}

/**
 * Extracts unique and filtered values that are not ALL from a specified property of an array of objects.
 * @param {Array<Object>} items - An array of objects.
 * @param {string} property - The property name to extract unique values from.
 * @returns {Array<string>} An array of unique and filtered values that are not ALL for the specified property.
 */
function extractUniqueAndFilteredValuesNotAll(items, property) {
    return [...new Set(items.map(item => item[property]))].filter(
        item => item && item !== 'ALL'
    );
}

/**
 * Filters and aggregates values from an array of objects based on a specified property.
 * @param {Array<Object>} rows - An array of objects to process.
 * @param {string} filterProperty - The property name to filter items by.
 * @param {Array<string>} allowedValues - An array of values to include in the results.
 * @returns {Object} An object where keys are the unique values of the filterProperty and values are the totals.
 */
function getTotalsByProperty(rows, filterProperty, allowedValues) {
    return rows
        .filter(row => allowedValues.includes(row[filterProperty]))
        .reduce((acc, row) => {
            const key = row[filterProperty];
            return {
                ...acc,
                [key]: row.total,
            };
        }, {});
}

/**
 * Get totals value data in analyticsDataRows using programIndicators to clasify by incident status and inside by disease.
 * @param {Array<Object>} programIndicators - An array of program indicator objects used to map totals.
 * @param {Array<Object>} analyticsDataRows - An array of analytics data rows containing total values.
 * @returns {Object} An object where each key is an incident status and its value is an object containing
 *                   totals for diseases associated with that incident status.
 */
function getDiseaseDataByIncidentStatus(programIndicators, analyticsDataRows) {
    const indicatorsWithTotals =
        mapTotalInRowsToCorrespondingIndicator(
            programIndicators,
            analyticsDataRows
        ) || [];

    const diseases = extractUniqueAndFilteredValuesNotAll(
        indicatorsWithTotals,
        'disease'
    );

    const incidentStatus = extractUniqueAndFilteredValuesNotAll(
        indicatorsWithTotals,
        'incidentStatus'
    );

    return incidentStatus.reduce((acc, status) => {
        const statusRows = indicatorsWithTotals.filter(
            row => row.incidentStatus === status
        );

        const diseaseTotals = getTotalsByProperty(
            statusRows,
            'disease',
            diseases
        );

        return {
            ...acc,
            [status]: {
                diseases: diseaseTotals,
            },
        };
    }, {});
}

/**
 * Epic that handles loading custom popup data for the Zebra module.
 * @param {Observable} action$ - The stream of actions from which to extract the relevant actions.
 * @returns {Observable} An observable that emits the `setZebraCustomPopupData` action with the processed data, or
 *                       an error action if an error occurs.
 */
export const loadZebraCustomPopupData = action$ =>
    action$
        .ofType(types.ZEBRA_CUSTOM_POPUP_DATA_LOAD)
        .concatMap(async action => {
            try {
                const {
                    orgUnits,
                    startDate,
                    endDate,
                    programIndicators,
                    popupType,
                } = action.payload;

                const d2 = await getD2();

                const {
                    serverTimeZoneId,
                    lastAnalyticsTablePartitionSuccess,
                } = d2.system.systemInfo;

                const lastUpdatedDate =
                    lastAnalyticsTablePartitionSuccess && serverTimeZoneId
                        ? getDateAsLocaleDateTimeString(
                              moment
                                  .tz(
                                      lastAnalyticsTablePartitionSuccess,
                                      serverTimeZoneId
                                  )
                                  .utc()
                                  .toString()
                          )
                        : '';

                if (
                    popupType === 'DASHBOARD' &&
                    programIndicators?.length > 0 &&
                    orgUnits?.length > 0 &&
                    startDate &&
                    endDate
                ) {
                    const analyticsRequest = new d2.analytics.request()
                        .addOrgUnitDimension(orgUnits)
                        .addDataDimension(programIndicators.map(d => d.id))
                        .withStartDate(startDate)
                        .withEndDate(endDate);

                    const analyticsData = await d2.analytics.aggregate.get(
                        analyticsRequest
                    );

                    const data = getDiseaseDataByIncidentStatus(
                        programIndicators,
                        analyticsData.rows
                    );

                    return setZebraCustomPopupData({
                        data: data,
                        lastUpdatedDate: lastUpdatedDate,
                    });
                } else {
                    return setZebraCustomPopupData({
                        lastUpdatedDate: lastUpdatedDate,
                    });
                }
            } catch (e) {
                return errorActionCreator(types.ZEBRA_CUSTOM_POPUP_DATA_ERROR)(
                    e
                );
            }
        });

export default combineEpics(loadZebraCustomPopupData);
