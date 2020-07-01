// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

// application
import { Check9x7Svg } from '../../svg';

class FilterCheckbox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { seller } = this.props;

        const itemsList = seller.map((item, index) => {
            return (
                <label
                    key={item.id}
                    className={classNames('filter-list__item', {
                        'filter-list__item--disabled': item.disabled,
                    })}
                >
                    <span className="filter-list__input input-check">
                        <span className="input-check__body">
                            <input id={item.id} className="input-check__input" type="checkbox" defaultChecked={true} disabled={false} onClick={() => this.props.filterDistributor(item.id, index)} />
                            <span className="input-check__box" />
                            <Check9x7Svg className="input-check__icon" />
                        </span>
                    </span>
                    <label className="filter-list__title">{item.nama_perusahaan}</label>
                </label>
            );
        });

        if (seller.length > 0) {
            return (
                <div className="filter-list">
                    <div className="filter-list__list">
                        {itemsList}
                    </div>
                </div>
            );
        }

        else if (seller == 0) {
            return (
                <div className="filter-list">
                    <div className="filter-list__list">
                        <label
                            // key={item.id}
                            className={classNames('filter-list__item', {
                                'filter-list__item--disabled': false,
                            })}
                        >
                            <span className="filter-list__input input-check">
                                <span className="input-check__body">
                                    <input className="input-check__input" type="checkbox" defaultChecked={true} disabled={false} />
                                    <span className="input-check__box" />
                                    <Check9x7Svg className="input-check__icon" />
                                </span>
                            </span>
                            <label className="filter-list__title">semua distributor</label>
                        </label>
                    </div>
                </div>
            );
        }

    }

}

FilterCheckbox.propTypes = {
    items: PropTypes.array,
};

export default FilterCheckbox;
