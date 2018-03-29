import { combineEpics } from 'redux-observable';
import i18next from 'i18next';
import * as types from '../constants/actionTypes';
import { setMessage } from '../actions/message';
import { apiFetch } from '../util/api';
import { cleanMapConfig } from '../util/favorites';
import pick from 'lodash/fp/pick';

// Save existing favorite
export const saveFavorite = (action$, store) =>
    action$.ofType(types.FAVORITE_SAVE).concatMap(({ fields }) => {
        const allConfig = cleanMapConfig(store.getState().map);
        const config = fields ? pick(fields, allConfig) : allConfig;

        if (config.mapViews) {
            config.mapViews.forEach(view => delete view.id);
        }

        return apiFetch(`/maps/${allConfig.id}`, 'PUT', config).then(() =>
            setMessage(
                `${i18next.t('Favorite')} "${allConfig.name}" ${i18next.t(
                    'is saved'
                )}.`
            )
        );
    });

// Save new favorite
export const saveNewFavorite = action$ =>
    action$
        .ofType(types.FAVORITE_SAVE_NEW)
        .concatMap(({ config }) =>
            apiFetch('/maps/', 'POST', config).then(
                response =>
                    response.status === 'OK'
                        ? setMessage(
                              `${i18next.t('Favorite')} "${
                                  config.name
                              }" ${i18next.t('is saved')}.`
                          )
                        : setMessage(
                              `${i18next.t('Error')}: ${response.message}`
                          )
            )
        );

// Save new favorite interpretation
export const saveFavoriteInterpretation = action$ =>
    action$
        .ofType(types.FAVORITE_INTERPRETATION_SAVE)
        .concatMap(({ id, interpretation }) =>
            apiFetch(`/interpretations/map/${id}`, interpretation.id ? 'PUT' : 'POST', interpretation.text).then(
                response => setMessage(i18next.t(response.message))
            )
        );

export default combineEpics(
    saveFavorite,
    saveNewFavorite,
    saveFavoriteInterpretation
);
