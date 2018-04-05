import history from '../store/history';
import queryString from 'query-string';
import omitBy from 'lodash/fp/omitBy';
import { push } from 'react-router-redux';

export const setMapRoute = (mapId, {interpretationId} = {}) => {
  const params = {id: mapId, interpretationid: interpretationId};
  const cleanParams = omitBy(val => !val, params);
  return push({search: queryString.stringify(cleanParams)});
};

export const getMapRoute = (location) => {
  const params = queryString.parse(location.search);
  return {id: params.id, interpretationId: params.interpretationid};
};
