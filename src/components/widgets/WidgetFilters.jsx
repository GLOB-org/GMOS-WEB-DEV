// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

// application
import Collapse from '../shared/Collapse';
import FilterCategories from '../filters/FilterCategories';
import FilterCheckbox from '../filters/FilterCheckbox';
// import FilterColor from '../filters/FilterColor';
import FilterPrice from '../filters/FilterPrice';
//import FilterRadio from '../filters/FilterRadio';
import { ArrowRoundedDown12x7Svg } from '../../svg';


class WidgetFilters extends Component {

    constructor(props) {
        super(props);
    }

    pencarianProduk = (event) => {
        this.props.search(event.target.value)
    }

    filterdist = (id, index) => {
        this.props.filterDistributor(id, index)
    }

    filterCategory = (id, id_label) => {
        this.props.filterCategory(id)
        var get_length = document.getElementsByClassName('labelcategory').length
        for (var i = 0; i < get_length; i++) {
            document.getElementById(i+'lblkat').style.color = '#3D464D'
        }
        document.getElementById(id_label).style.color = '#8CC63E'
    }

    render() {
        const { title, filters, offcanvas, daftarcategory, seller, shoppage_category } = this.props;

        const filtersList = filters.map((filter) => {
            let filterView;

            if (filter.type === 'categories') {
                // filterView = <FilterCategories categories={filter.options.items} />;
                filterView = <FilterCategories categories={daftarcategory} seller={seller} shoppage_category={shoppage_category} filterCategory={this.filterCategory} />;
                // filterView = <FilterCategories categories={filter.options.items} barangkategori={barangkategori} />;
            }
            else if (filter.type === 'checkbox') {
                filterView = <FilterCheckbox items={filter.options.items} seller={seller} filterDistributor={this.filterdist} />;
            }

            //else if (['checkbox', 'radio'].includes(filter.type)) {
            //     filterView = (
            //         <FilterRadio
            //             items={filter.options.items}
            //             name={filter.options.name}
            //         />
            //     );
            // } 
            // else if (filter.type === 'color') {
            //     filterView = <FilterColor items={filter.options.items} />;
            // } 
            // else if (filter.type === 'price') {
            //     filterView = (
            //         <FilterPrice
            //             from={filter.options.from}
            //             to={filter.options.to}
            //             min={filter.options.min}
            //             max={filter.options.max}
            //             step={1}
            //         />
            //     );
            // }

            return (
                <div key={filter.id} className="widget-filters__item">
                    <Collapse
                        toggleClass="filter--opened"
                        render={({ toggle, setItemRef, setContentRef }) => (
                            <div className="filter filter--opened" ref={setItemRef}>
                                <button type="button" className="filter__title" onClick={toggle}>
                                    {filter.name}
                                    <ArrowRoundedDown12x7Svg className="filter__arrow" />
                                </button>
                                <div className="filter__body" ref={setContentRef}>
                                    <div className="filter__container">
                                        {filterView}
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </div>
            );
        });

        const classes = classNames('widget-filters widget', {
            'widget-filters--offcanvas--always': offcanvas === 'always',
            'widget-filters--offcanvas--mobile': offcanvas === 'mobile',
        });

        return (
            <div className={classes}>
                <h4 className="widget-filters__title widget__title">{title}</h4>

                <div className="widget-filters__list">

                    <div className="widget-filters__item">
                        <Collapse
                            toggleClass="filter--opened"
                            render={({ toggle, setItemRef, setContentRef }) => (
                                <div className="filter filter--opened" ref={setItemRef}>
                                    <button type="button" className="filter__title" onClick={toggle}>
                                        Pencarian
                                        <ArrowRoundedDown12x7Svg className="filter__arrow" />
                                    </button>
                                    <div className="filter__body" ref={setContentRef}>
                                        <div className="filter__container">
                                            <div className="input-group" >
                                                <input id="searchBarProduk" type="text" class="form-control" autoComplete="off" spellCheck="false" placeholder="Cari produk di sini..." onChange={event => this.pencarianProduk(event)} />
                                                <div className="input-group-append">
                                                    <span id="searchBarProduk" className="input-group-text"><i className="fa fa-search"></i></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>

                    {filtersList}
                </div>

                {/* <div className="widget-filters__actions d-flex">
                    <button type="button" className="btn btn-primary btn-sm">Filter</button>
                    <button type="button" className="btn btn-secondary btn-sm ml-2">Reset</button>
                </div> */}
            </div>
        );
    }
}

// function WidgetFilters(props) {

// }

WidgetFilters.propTypes = {
    /**
     * widget title
     */
    title: PropTypes.node,
    /**
     * array of filters
     */
    filters: PropTypes.array,
    /**
     * indicates when sidebar bar should be off canvas
     */
    offcanvas: PropTypes.oneOf(['always', 'mobile']),
};

WidgetFilters.defaultProps = {
    filters: [],
    offcanvas: 'mobile',
};

export default WidgetFilters;
