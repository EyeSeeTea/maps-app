import { combineEpics } from 'redux-observable';
import i18next from 'i18next';
import * as types from '../constants/actionTypes';
import { apiFetch } from '../util/api';
import { setMessage } from '../actions/message';
import { getInstance as getD2 } from 'd2/lib/d2';
import { interpretationsFields } from '../util/helpers';
import { loadInterpretations, setInterpretations } from '../actions/interpretations'

export const saveInterpretationLike = (action$, store) =>
    action$
        .ofType(types.INTERPRETATIONS_SAVE_LIKE_VALUE)
        .concatMap(action =>
            apiFetch(`/interpretations/${action.interpretation.id}/like`, action.value ? "POST" : "DELETE", {})
                .then(() => loadInterpretations())
        );

export const deleteInterpretation = (action$, store) =>
    action$
        .ofType(types.INTERPRETATIONS_DELETE)
        .concatMap(action =>
            apiFetch(`/interpretations/${action.interpretation.id}`, "DELETE", {})
                .then(() => loadInterpretations())
        );

export const loadInterpretationsEpic = (action$, store) =>
    action$
        .ofType(types.INTERPRETATIONS_LOAD)
        .concatMap(action => {
            const mapId = store.getState().map.id;
            const fields = `interpretations[${interpretationsFields.join(',')}]`;
            return apiFetch(`/maps/${mapId}?fields=${fields}`, "GET")
                .then(res => setInterpretations(res.interpretations))
        });

export const saveInterpretation = action$ =>
    action$
        .ofType(types.INTERPRETATIONS_SAVE)
        .concatMap(({ id, interpretation }) => {
            const [method, url] = interpretation.id
                ? ['PUT',  `/interpretations/${interpretation.id}`]
                : ['POST', `/interpretations/map/${id}`];
            return apiFetch(url, method, interpretation.text)
        }).mergeMap(response => [
            setMessage(i18next.t(response.message)),
            loadInterpretations(),
        ]);

export const saveComment = (action$, store) =>
    action$
        .ofType(types.INTERPRETATIONS_SAVE_COMMENT)
        .concatMap(action => {
            const { interpretation, comment } = action;
            const [method, url] = comment.id
                ? ['PUT',  `/interpretations/${interpretation.id}/comments/${comment.id}`]
                : ['POST', `/interpretations/${interpretation.id}/comments`];
            http://localhost:8029/api/29/interpretations/Fk2CuUGCktt/comments/U34iddD4lxT
            return apiFetch(url, method, comment.text)
                .then(res => loadInterpretations())
        });

export const deleteComment = (action$, store) =>
    action$
        .ofType(types.INTERPRETATIONS_DELETE_COMMENT)
        .concatMap(({ interpretation, comment }) => {
            const url = `/interpretations/${interpretation.id}/comments/${comment.id}`;
            return apiFetch(url, "DELETE", comment.text)
                .then(res => loadInterpretations())
        });

export default combineEpics(
    saveInterpretationLike,
    deleteInterpretation,
    loadInterpretationsEpic,
    saveInterpretation,
    saveComment,
    deleteComment,
);
