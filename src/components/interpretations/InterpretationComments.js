import React from 'react';
import { Link, ActionSeparator, WithAvatar, getUserLink } from './misc';
import CommentTextarea from './CommentTextarea';
import { userCanManage } from '../../util/auth';
import { FormattedRelative } from 'react-intl';
import i18next from 'i18next';

export default class InterpretationComments extends React.Component {
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
        if (confirm(i18next.t('Are you sure you want to remove this comment?'))) {
            this.props.onDelete(comment);
        }
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
