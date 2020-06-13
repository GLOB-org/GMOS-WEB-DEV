// react
import React, { Component } from 'react';

// third-party
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// application
import { ArrowRoundedLeft6x9Svg } from '../../svg';

class FilterCategories extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { categories, shoppage_category } = this.props;

        const categoriesList = categories.map((category, index) => {
            let arrow;
            let paramlink;
            if (category.type === 'parent') {
                arrow = <ArrowRoundedLeft6x9Svg className="filter-categories__arrow" />;
            }

            if (shoppage_category == 'all') {
                paramlink = 'daftarprodukall'
            }
            else if (shoppage_category == 'langganan') {
                paramlink = 'daftarproduklangganan'
            }
            else {
                paramlink = 'daftarproduknonlangganan'
            }

            return (
                <li key={category.id} className={`filter-categories__item filter-categories__item--categories`}>
                    {arrow}
                    <label id={index + 'lblkat'} className='labelcategory' onClick={() => this.props.filterCategory(category.id, index + 'lblkat')}>{category.nama}</label>
                    {/* <Link to={`/${paramlink}-${category.nama}`}>{category.nama}</Link> */}
                    {/* <div className="filter-categories__counter">{category.count}</div> */}
                </li>
            );
        });

        return (
            <div className="filter-categories">
                <ul className="filter-categories__list">
                    {categoriesList}
                </ul>
            </div>
        );
    }

}


FilterCategories.propTypes = {
    categories: PropTypes.array,
};

export default FilterCategories;
