import React, { Component } from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import { createPeriodGeneratorsForLocale } from 'd2/lib/period/generators';

const styles = {
    select: {
        width: 240,
    },
    stepper: {
        display: 'inline-block',
        verticalAlign: 'top',
        marginTop: 40,
        marginLeft: 12,
    },
    button: {
        backgroundColor: '#eee',
        width: 24,
        height: 24,
        padding: 0,
    }
};

class PeriodSelect extends Component {
    state = {
        year: new Date().getFullYear(),
    };

    constructor(props, context) {
        super(props, context);
        this.periodGenerator = createPeriodGeneratorsForLocale(props.locale);

        this.nextYear = this.nextYear.bind(this);
        this.previousYear = this.previousYear.bind(this);
    }

    componentDidMount() {
        const { periodType, period, onChange } = this.props;
        const periods = this.generatePeriods(periodType, period);

        if (!period && periods) {
            onChange(periods[0]); // Select first period
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { periodType, period, onChange } = this.props;

        if (periodType !== prevProps.periodType || this.state.year !== prevState.year) {
            const periods = this.generatePeriods(periodType, period);

            onChange(periods[0]);
        }
    }

    generatePeriods(periodType, period) {
        const { year } = this.state;
        let periods;

        if (periodType) {
            const generator =
                this.periodGenerator[`generate${periodType}PeriodsForYear`] ||
                this.periodGenerator[`generate${periodType}PeriodsUpToYear`];

            if (!generator) {
                return null;
            }
            periods = generator(year).reverse();
        } else {
            if (!period) {
                return null;
            }
            periods = [period]; // If favorite is loaded, we only know the used period
        }

        this.setState({ periods });

        return periods;
    }

    nextYear() {
        this.setState({ year: this.state.year + 1 });
    }

    previousYear () {
        this.setState({ year: this.state.year - 1 });
    }

    render() {
        const { periodType, period, onChange, style, errorText } = this.props;
        const { periods } = this.state;
        const value = period ? period.id : null;

        return (
            <div style={{...style, height: 100 }}>
                <SelectField
                    label={i18next.t('Period')}
                    items={periods}
                    value={value}
                    onChange={onChange}
                    style={styles.select}
                    errorText={!value && errorText ? errorText : null}
                />
                    <div  style={styles.stepper}>
                        <IconButton
                            tooltip={i18next.t('Previous year')}
                            onClick={this.previousYear}
                            style={styles.button}
                            disableTouchRipple={true}
                        >
                            <SvgIcon icon="ChevronLeft" />
                        </IconButton>
                        <IconButton
                            tooltip={i18next.t('Next year')}
                            onClick={this.nextYear}
                            style={styles.button}
                            disableTouchRipple={true}
                        >
                            <SvgIcon icon="ChevronRight" />
                        </IconButton>
                    </div>
            </div>
        );
    }
}

export default connect(state => ({
    locale: state.userSettings.keyUiLocale,
}))(PeriodSelect);
