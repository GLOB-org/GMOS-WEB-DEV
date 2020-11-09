// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// application
import Pagination from '../shared/Pagination';
import ProductCard from '../shared/ProductCard';
import {
    Filters16Svg,
    LayoutGrid16x16Svg,
    LayoutGridWithDetails16x16Svg,
    LayoutList16x16Svg,
} from '../../svg';
import Grid from '@material-ui/core/Grid';
import { sidebarOpen } from '../../store/sidebar';


class ProductsView extends Component {
    constructor(props) {
        // const {
        //     totalproducts
        // } = this.props;
        super(props);

        this.state = {
            page: 1,
            page_base: 1,
            selectShow: 15,
            sliceX: '0',
            sliceY: '15',
            sliceX_base: '0',
            sliceY_base: '15',
            sorting1: 'nama',
            typeSorting: 'asc'
        };
    }

    setLayout = (layout) => {
        this.setState(() => ({ layout }));
    };

    GetDataPagination(get_page) {
        this.setState({
            sliceX: (get_page * this.state.selectShow) - this.state.selectShow,
            sliceY: get_page * this.state.selectShow,
        });
    }

    getSelectFilter = (event) => {
        var get_filter = event.target.value
        if (get_filter == 'a-z') {
            this.setState({
                sorting1: 'nama',
                typeSorting: 'asc'
            });
        }
        else if (get_filter == 'z-a') {
            this.setState({
                sorting1: 'nama',
                typeSorting: 'desc'
            });
        }
        else if (get_filter == 'hargarendah') {
            this.setState({
                sorting1: 'price',
                typeSorting: 'asc'
            });
        }
        else if (get_filter == 'hargatinggi') {
            this.setState({
                sorting1: 'price',
                typeSorting: 'desc'
            });
        }
    }

    getSelectShow = (event) => {
        this.setState({
            selectShow: event.target.value,
            sliceX: event.target.value - event.target.value,
            sliceY: event.target.value,
            page: 1
        });
    }

    handlePageChange = (page) => {
        this.setState(() => ({ page }));
        this.GetDataPagination(page)
    };

    render() {
        const {
            products,
            kurs,
            grid,
            offcanvas,
            layout: propsLayout,
            sidebarOpen,
            status,
            query_status,
            shoppage_category
        } = this.props;
        const { page, layout: stateLayout } = this.state;
        const layout = stateLayout || propsLayout;

        let viewModes = [
            { key: 'grid', title: 'Grid', icon: <LayoutGrid16x16Svg /> },
            // { key: 'grid-with-features', title: 'Grid With Features', icon: <LayoutGridWithDetails16x16Svg /> },
            // { key: 'list', title: 'List', icon: <LayoutList16x16Svg /> },
        ];

        viewModes = viewModes.map((viewMode) => {
            const className = classNames('layout-switcher__button', {
                'layout-switcher__button--active': layout === viewMode.key,
            });

            return (
                <button
                    key={viewMode.key}
                    title={viewMode.title}
                    type="button"
                    className={className}
                    onClick={() => this.setLayout(viewMode.key)}
                >
                    {viewMode.icon}
                </button>
            );
        });

        var doSorting = require('lodash');
        if (this.state.sorting1 == 'nama') {
            if (this.state.typeSorting == 'asc') {
                var sort = doSorting.sortBy(products, [this.state.sorting1])
            }
            else if (this.state.typeSorting == 'desc') {
                var sort = doSorting.sortBy(products, [this.state.sorting1]).reverse()
            }
        }
        else if (this.state.sorting1 == 'price') {
            if (this.state.typeSorting == 'asc') {
                var sort = products.sort(function (a, b) { return a.price - b.price });
            }
            else if (this.state.typeSorting == 'desc') {
                var sort = products.sort(function (a, b) { return b.price - a.price });
            }
        }

        var total_page = Math.ceil(this.props.totalproducts / this.state.selectShow)

        if (total_page == 1) {
            var productsList = sort.slice(this.state.sliceX_base, this.state.sliceY_base).map((product) => (
                <div key={product.id} className="products-list__item">
                    <ProductCard product={product} kurs={kurs} status={status} shoppage_category={shoppage_category} />
                </div>
            ));
        }
        else {
            var productsList = sort.slice(this.state.sliceX, this.state.sliceY).map((product) => (
                <div key={product.id} className="products-list__item">
                    <ProductCard product={product} kurs={kurs} status={status} shoppage_category={shoppage_category} />
                </div>
            ));
        }

        const viewOptionsClasses = classNames('view-options', {
            'view-options--offcanvas--always': offcanvas === 'always',
            'view-options--offcanvas--mobile': offcanvas === 'mobile',
        });

        const containerClasses = classNames('product-card', {
            'product-card--layout--grid product-card--size--sm': layout === 'grid-sm',
            'product-card--layout--grid product-card--size--nl': layout === 'grid-nl',
            'product-card--layout--grid product-card--size--lg': layout === 'grid-lg',
            'product-card--layout--list': layout === 'list',
            'product-card--layout--horizontal': layout === 'horizontal',
        });

        const total_produk = this.props.totalproducts;
        var display_notfound = 'none';
        if (productsList.length == 0) {
            display_notfound = 'block';
        }

        return (

            <div className="products-view">
                <div className="products-view__options">
                    <div className={viewOptionsClasses}>
                        <div className="view-options__filters-button">
                            <button type="button" className="filters-button" onClick={() => sidebarOpen()}>
                                <Filters16Svg className="filters-button__icon" />
                                <span className="filters-button__title">Filter</span>
                                <span className="filters-button__counter">3</span>
                            </button>
                        </div>
                        <div className="view-options__layout">
                            <div className="layout-switcher">
                                <div className="layout-switcher__list">
                                    {/* {viewModes} */}
                                </div>
                            </div>
                        </div>

                        {productsList.length > 0 ? (
                            <div className="view-options__legend" style={{marginLeft: '0px'}}>Menampilkan {productsList.length} dari {this.props.totalproducts} produk</div>
                        ) : (
                                null
                            )
                        }

                        <div className="view-options__divider" />
                        <div className="view-options__control">
                            <label htmlFor="view-options-sort">Urutkan</label>
                            <div>
                                <select className="form-control form-control-sm" name="" id="view-options-sort" onChange={this.getSelectFilter}>
                                    <option value="a-z">Nama (A-Z)</option>
                                    <option value="z-a">Nama (Z-A)</option>
                                    <option value="hargarendah">Harga (Rendah-Tinggi)</option>
                                    <option value="hargatinggi">Harga (Tinggi-Rendah)</option>
                                </select>
                            </div>
                        </div>
                        <div className="view-options__control">
                            <label htmlFor="view-options-limit">Tampil</label>
                            <div>
                                <select className="form-control form-control-sm" name="" id="view-options-limit" onChange={this.getSelectShow}>
                                    <option value="15">15</option>
                                    <option value="30">30</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="products-view__list products-list"
                    data-layout={layout !== 'list' ? grid : layout}
                    data-with-features={layout === 'grid-with-features' ? 'true' : 'false'}
                >
                    <div className="products-list__body">
                        {productsList}
                        {query_status == 'finished' ? (
                            <div className="product-card__info" style={{ paddingTop: '100px', display: display_notfound }} >
                                <center><h5>PRODUK TIDAK DITEMUKAN !</h5></center>
                            </div>
                        ) : (
                                <div className="products-list__item">
                                    <div className={containerClasses}>
                                        <div className="product-card__image" style={{ padding: '18px 18px 18px' }}>
                                            <shimmerImageProduct class="shine"></shimmerImageProduct>
                                        </div>

                                        <div className="product-card__info" style={{ padding: '0px 18px' }}>
                                            <div className="product-card__name">
                                                <shimmerNameProduct class="shine"></shimmerNameProduct>
                                            </div>
                                        </div>
                                        <div className="product-card__actions" style={{ padding: '0px 18px 18px' }}>
                                            <div className="product-card__name">
                                                <shimmerPriceProduct class="shine"></shimmerPriceProduct>
                                            </div>
                                        </div>

                                    </div>

                                    <div className={containerClasses} style={{ marginLeft: '12px', marginRight: '12px' }}>
                                        <div className="product-card__image" style={{ padding: '18px 18px 18px' }}>
                                            <shimmerImageProduct class="shine"></shimmerImageProduct>
                                        </div>

                                        <div className="product-card__info" style={{ padding: '0px 18px' }}>
                                            <div className="product-card__name">
                                                <shimmerNameProduct class="shine"></shimmerNameProduct>
                                            </div>
                                        </div>
                                        <div className="product-card__actions" style={{ padding: '0px 18px 18px' }}>
                                            <div className="product-card__name">
                                                <shimmerPriceProduct class="shine"></shimmerPriceProduct>
                                            </div>
                                        </div>

                                    </div>

                                    <div className={containerClasses}>
                                        <div className="product-card__image" style={{ padding: '18px 18px 18px' }}>
                                            <shimmerImageProduct class="shine"></shimmerImageProduct>
                                        </div>

                                        <div className="product-card__info" style={{ padding: '0px 18px' }}>
                                            <div className="product-card__name">
                                                <shimmerNameProduct class="shine"></shimmerNameProduct>
                                            </div>
                                        </div>
                                        <div className="product-card__actions" style={{ padding: '0px 18px 18px' }}>
                                            <div className="product-card__name">
                                                <shimmerPriceProduct class="shine"></shimmerPriceProduct>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="products-view__pagination">
                    {total_produk > 0 ?
                        (<div id='pagination' style={{ display: 'block' }}>
                            <Pagination
                                current={page}
                                siblings={2}
                                total={Math.ceil(this.props.totalproducts / this.state.selectShow)}
                                onPageChange={this.handlePageChange}
                            />
                        </div>) :
                        (<div id='pagination' style={{ display: 'none' }}>
                            <Pagination
                                current={page}
                                siblings={2}
                                total={Math.ceil(this.props.totalproducts / this.state.selectShow)}
                                onPageChange={this.handlePageChange}
                            />
                        </div>)
                    }
                </div>

                {/* {total_page == 1 || this.props.send_param == 'searching' ?
                    (<div className="products-view__pagination">
                        {total_produk > 0 ?
                            (<div id='pagination' style={{ display: 'block' }}>
                                <Pagination
                                    current={this.state.page_base}
                                    siblings={2}
                                    total={Math.ceil(this.props.totalproducts / this.state.selectShow)}
                                    onPageChange={this.handlePageChangeBase}
                                />
                            </div>) :
                            (<div id='pagination' style={{ display: 'none' }}>
                                <Pagination
                                    current={this.state.page_base}
                                    siblings={2}
                                    total={Math.ceil(this.props.totalproducts / this.state.selectShow)}
                                    onPageChange={this.handlePageChangeBase}
                                />
                            </div>)
                        }
                    </div>) :
                    (<div className="products-view__pagination">
                        {total_produk > 0 ?
                            (<div id='pagination' style={{ display: 'block' }}>
                                <Pagination
                                    current={page}
                                    siblings={2}
                                    total={Math.ceil(this.props.totalproducts / this.state.selectShow)}
                                    onPageChange={this.handlePageChange}
                                />
                            </div>) :
                            (<div id='pagination' style={{ display: 'none' }}>
                                <Pagination
                                    current={page}
                                    siblings={2}
                                    total={Math.ceil(this.props.totalproducts / this.state.selectShow)}
                                    onPageChange={this.handlePageChange}
                                />
                            </div>)
                        }
                    </div>)
                } */}
            </div>
        );
    }
}

ProductsView.propTypes = {
    /**
     * array of product objects
     */
    products: PropTypes.array,
    /**
     * products list layout (default: 'grid')
     * one of ['grid', 'grid-with-features', 'list']
     */
    layout: PropTypes.oneOf(['grid', 'grid-with-features', 'list']),
    /**
     * products list layout (default: 'grid')
     * one of ['grid-3-sidebar', 'grid-4-full', 'grid-5-full']
     */
    grid: PropTypes.oneOf(['grid-3-sidebar', 'grid-4-full', 'grid-5-full']),
    /**
     * indicates when sidebar bar should be off canvas
     */
    offcanvas: PropTypes.oneOf(['always', 'mobile']),
};

ProductsView.defaultProps = {
    products: [],
    totalproducts: '',
    layout: 'grid',
    grid: 'grid-3-sidebar',
    offcanvas: 'mobile',
};

const mapDispatchToProps = {
    sidebarOpen,
};

export default connect(
    () => ({}),
    mapDispatchToProps,
)(ProductsView);
