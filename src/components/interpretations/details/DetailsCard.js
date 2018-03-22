import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import { grey600 } from 'material-ui/styles/colors';
import i18next from 'i18next';
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

// Details card shown in right interpretations panel
const DetailsCard = props => {
    const {
        map,
        isExpanded,
        toggleDetailsExpand,
    } = props;

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
                <div>Details</div>
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
