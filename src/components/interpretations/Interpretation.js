import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import { connect } from 'react-redux';
import { getDateFromString } from '../../util/dateUtils';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import i18next from 'i18next';

import {
    saveInterpretationLike,
    deleteInterpretation,
    openInterpretationDialog,
    saveComment,
    deleteComment,
} from '../../actions/interpretations';

class CommentTextarea extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: props.comment.text || "" };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ text: nextProps.comment.text });
    }

    _onChange(ev) {
        this.setState({ text: ev.target.value });
    }

    _onPost() {
        this.props.onPost(this.state.text);
        this.setState({ text: "" });
    }

    render() {
        const { comment, onCancel } = this.props;
        const { text } = this.state;

        return (
            <div>
                <textarea value={text} rows={4} onChange={ev => this._onChange(ev)} />
                <FlatButton disabled={!text} label={i18next.t('Post comment')} onClick={() => this._onPost()} />
                {onCancel &&
                    <FlatButton label={i18next.t('Cancel')} onClick={onCancel} />}
            </div>
        );
    }
};

class InterpretationComments extends React.Component {
    state = {
        commentToEdit: null,
    };

    _onEdit(comment) {
        this.setState({ commentToEdit: comment });
    }

    _onCancelEdit(comment) {
        this.setState({ commentToEdit: null });
    }

    _onDelete(comment) {
        // TODO: Prompt
        this.props.onDelete(comment);
    }

    _onSave(comment) {
        this.setState({ commentToEdit: null });
        this.props.onSave(comment);
    }

    render() {
        const { d2, comments } = this.props;
        const { commentToEdit } = this.state;

        return (
            <div>
                <CommentTextarea comment={{text: ""}} onPost={text => this._onSave({text})} />

                {comments.map(comment =>
                    <div key={comment.id}>
                        <div>{getUserLink(d2, comment.user)}</div>

                        {commentToEdit && commentToEdit.id === comment.id
                            ?
                                <CommentTextarea
                                    comment={comment}
                                    onPost={text => this._onSave({...comment, text})}
                                    onCancel={() => this._onCancelEdit()}
                                />
                            :
                                <div>
                                    <div>{comment.text}</div>
                                    <FlatButton label={i18next.t('Edit')} onClick={() => this._onEdit(comment)} />
                                    <FlatButton label={i18next.t('Delete')} onClick={() => this._onDelete(comment)} />
                                </div>
                        }
                    </div>
                )}
            </div>
        );
    }
};

const getUserLink = (d2, user) => {
    const baseurl = d2.system.systemInfo.contextPath;
    const userUrl =`${baseurl}/dhis-web-messaging/profile.action?id=${user.id}`;
    return (<a href={userUrl} target="_blank">{user.displayName}</a>);
};

const Interpretation = props => {
    const {
        interpretation,
        d2,
        showActions,
        showComments,
        saveInterpretationLike,
        deleteInterpretation,
        openInterpretationDialog,
        saveComment,
        deleteComment,
    } = props;

    const comments = _(interpretation.comments).sortBy("created").reverse().value();
    const likedByTooltip = interpretation.likedBy.map(user => user.displayName).join("&#10;");
    const currentUserLikesInterpretation = () =>
        _(interpretation.likedBy).some(user => user.id === d2.currentUser.id);

    return (
        <div>
            <div>
                {getUserLink(d2, interpretation.user)}
                ·
                {getDateFromString(interpretation.created)}
            </div>
            <div>{interpretation.text}</div>
            {showActions &&
                <div>
                    {currentUserLikesInterpretation()
                        ? <FlatButton label={i18next.t('Unlike')} onClick={() => saveInterpretationLike(interpretation, false)} />
                        : <FlatButton label={i18next.t('Like')} onClick={() => saveInterpretationLike(interpretation, true)} />}
                    <FlatButton label={i18next.t('Edit')} onClick={() => openInterpretationDialog(interpretation)} />
                    <FlatButton label={i18next.t('Delete')} onClick={() => deleteInterpretation(interpretation)} />
                </div>
            }

            <div>
                <SvgIcon icon="ThumbUp" />
                <span style={{color: "#22A"}} title={likedByTooltip}>
                    {interpretation.likes} {i18next.t('people like this')}
                </span>
                ·
                {`${interpretation.comments.length} ${i18next.t('people commented')}`}

                {showComments &&
                    <InterpretationComments
                        d2={d2}
                        comments={comments}
                        onSave={comment => saveComment(interpretation, comment)}
                        onDelete={comment => deleteComment(interpretation, comment)}
                    />}
            </div>
        </div>
    );
};

Interpretation.propTypes = {
    d2: PropTypes.object.isRequired,
    interpretation: PropTypes.object.isRequired,
    saveInterpretationLike: PropTypes.func.isRequired,
    saveComment: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
};

export default connect(
    state => ({
    }),
    {
        saveInterpretationLike,
        deleteInterpretation,
        openInterpretationDialog,
        saveComment,
        deleteComment,
    },
)(Interpretation);
