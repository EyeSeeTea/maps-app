import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import { connect } from 'react-redux';
import { getDateFromString } from '../../util/dateUtils';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import { FormattedDate, FormattedRelative } from 'react-intl';
import i18next from 'i18next';
import { Avatar } from 'material-ui';

import './Interpretation.css';

import {
    saveInterpretationLike,
    deleteInterpretation,
    openInterpretationDialog,
    saveComment,
    deleteComment,
} from '../../actions/interpretations';

const ActionSeparator = ({labelText = "·"}) =>
    <label className="linkArea">{labelText}</label>;

const EllipsisText = ({ max, text }) => {
    const finalText = text && text.length > max ? `${text.slice(0, max)} ...` : text;
    return <span>{finalText}</span>;
};

const UserAvatar = ({user}) => {
    const initials = user.displayName.split(" ").map(part => part[0]).slice(0, 2).join("");
    const style = {fontSize: 15, fontWeight: 'bold'};
    return (<Avatar color="black" size={32} style={style}>{initials}</Avatar>);
};

const WithAvatar = ({ user, children }) => (
    <div className="greyBackground" style={{display: "flex", marginTop: 10, marginBottom: 10}}>
        <div style={{width: 40}}>
            <UserAvatar user={user} />
        </div>

        <div style={{width: '90%'}}>
            {children}
        </div>
    </div>
);

const userCanManage = (d2, object) => {
    const {currentUser} = d2;

    if (!object || !object.user || !currentUser) {
        return false;
    } else if (object.user.id === currentUser.id) {
        return true;
    } else if (currentUser.authorities.has("ALL")) {
        return true;
    } else {
        return false;
    }
};

const Link = (props) => {
    const { label, ...otherProps } = props;
    return <a className="interpretation" {...otherProps}>{label}</a>;
};

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
        const postText = onCancel ? i18next.t("OK") : i18next.t('Post comment');

        return (
            <div>
                <textarea className="commentArea" value={text} rows={4} onChange={ev => this._onChange(ev)} />
                <Link disabled={!text} label={postText} onClick={() => this._onPost()} />
                {onCancel &&
                    <span>
                        <ActionSeparator />
                        <Link label={i18next.t('Cancel')} onClick={onCancel} />
                    </span>}
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
        if (confirm(i18next.t('Are you sure you want to remove this comment?')))
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
                <WithAvatar user={d2.currentUser}>
                    <CommentTextarea comment={{text: ""}} onPost={text => this._onSave({text})} />
                </WithAvatar>

                {comments.map(comment =>
                    <div key={comment.id}>
                        <WithAvatar user={comment.user}>
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

                                        <span className="tipText">
                                            <FormattedRelative value={comment.created} />
                                        </span>

                                        <ActionSeparator labelText="" />

                                        {userCanManage(d2, comment) &&
                                            <span>
                                                <Link label={i18next.t('Edit')} onClick={() => this._onEdit(comment)} />
                                                <ActionSeparator />
                                                <Link label={i18next.t('Delete')} onClick={() => this._onDelete(comment)} />
                                            </span>}
                                    </div>
                            }
                        </WithAvatar>
                    </div>
                )}
            </div>
        );
    }
};

const getUserLink = (d2, user) => {
    const baseurl = d2.system.systemInfo.contextPath;
    const userUrl =`${baseurl}/dhis-web-messaging/profile.action?id=${user.id}`;
    return (<a href={userUrl} className="bold userLink" target="_blank">{user.displayName}</a>);
};

const onDeleteInterpretationClick = (interpretation, deleteInterpretation) => {
    if (confirm(i18next.t('Are you sure you want to remove this interpretation?')))
        deleteInterpretation(interpretation);
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
    const likedByTooltip = _(interpretation.likedBy).map(user => user.displayName).sortBy().join("\n");
    const currentUserLikesInterpretation = () =>
        _(interpretation.likedBy).some(user => user.id === d2.currentUser.id);

    return (
        <div className="interpretationContainer">
            <div className="interpretationDescSection">
                <div className="interpretationName">
                    {getUserLink(d2, interpretation.user)}
                    <span className="tipText leftSpace">
                        <FormattedDate value={interpretation.created} day="2-digit" month="short" year="numeric" />
                    </span>
                </div>

                <div className="interpretationText">
                    <div>
                        <EllipsisText max={200} text={interpretation.text} />
                    </div>
                </div>

                <div>
                    {showActions &&
                        <div>
                            {currentUserLikesInterpretation()
                                ? <Link label={i18next.t('Unlike')} onClick={() => saveInterpretationLike(interpretation, false)} />
                                : <Link label={i18next.t('Like')} onClick={() => saveInterpretationLike(interpretation, true)} />}
                            {userCanManage(d2, interpretation) &&
                                <span>
                                    <ActionSeparator />
                                    <Link label={i18next.t('Edit')}
                                        onClick={() => openInterpretationDialog(interpretation)} />
                                    <ActionSeparator />
                                    <Link label={i18next.t('Delete')}
                                        onClick={() => onDeleteInterpretationClick(interpretation, deleteInterpretation)} />
                                </span>}
                        </div>
                    }

                    <div className="interpretationCommentArea">
                        <div className="likeArea greyBackground">
                            <img src="images/like.png" className="verticalAlignTop" />

                            <span style={{color: "#22A"}} title={likedByTooltip}>
                                {interpretation.likes} {i18next.t('people like this')}
                            </span>

                            <ActionSeparator />

                            {`${interpretation.comments.length} ${i18next.t('people commented')}`}
                        </div>

                        {showComments &&
                            <InterpretationComments
                                d2={d2}
                                comments={comments}
                                onSave={comment => saveComment(interpretation, comment)}
                                onDelete={comment => deleteComment(interpretation, comment)}
                            />}
                    </div>
                </div>
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
