import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import { grey600 } from 'material-ui/styles/colors';
import {List, ListItem} from 'material-ui/List';
import i18next from 'i18next';
import { timeFormat } from 'd3-time-format';

import {
    toggleDetailsExpand,
} from '../../../actions/details';
import './DetailsCard.css';

const styles = {
    container: {
        paddingBottom: 0,
    },
    headerText: {
        position: 'relative',
        width: 210,
        top: '50%',
        transform: 'translateY(-50%)',
        paddingRight: 0,
    },
    body: {
        padding: 0,
    },
};

const descriptionMaxLength = 250;

const getDescription = map => {
    const {description} = map;

    if (!description) {
        return i18next.t('No description')
    } else if (description.length < descriptionMaxLength) {
        return description;
    } else {
        return description.substring(0, descriptionMaxLength) + ' ...';
    }
};

const getOwner = map => {
    return map.user ? map.user.displayName : '-';
};

const formatTime = timeFormat('%Y-%m-%d');

// Details card shown in right interpretations panel
const DetailsCard = props => {
    const {
        map,
        isExpanded,
        toggleDetailsExpand,
    } = props;

    window.map = map;

    return (
        <Card
            className="DetailsCard"
            containerStyle={styles.container}
            expanded={isExpanded}
            onExpandChange={toggleDetailsExpand}
        >
            <CardHeader
                className="DetailsCard-header"
                title={i18next.t('Details')}
                showExpandableButton={true}
                textStyle={styles.headerText}
            >
            </CardHeader>

            <CardText expandable={true} style={styles.body}>
                <List>
                    <ListItem primaryText={getDescription(map)} />
                    <ListItem primaryText={i18next.t('Owner')} secondaryText={getOwner(map)} />
                    <ListItem primaryText={i18next.t('Created')} secondaryText={formatTime(map.created)} />
                    <ListItem primaryText={i18next.t('Last updated')} secondaryText={formatTime(map.lastUpdated)} />
                </List>

                <div className="DetailsCard-toolbar">
                </div>
            </CardText>
        </Card>
    );
};

DetailsCard.propTypes = {
    isExpanded: PropTypes.bool,
    toggleDetailsExpand: PropTypes.func,
};

DetailsCard.defaultProps = {
    isExpanded: true,
};

export default connect(
    state => ({
        map: state.map,
        isExpanded: state.map.details.isExpanded,
    }),
    {
        toggleDetailsExpand,
    }
)(DetailsCard);
