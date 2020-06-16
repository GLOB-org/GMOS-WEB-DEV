// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// application
import { Cross20Svg } from '../../svg';
import { sidebarClose } from '../../store/sidebar';

// widgets
import WidgetFilters from '../widgets/WidgetFilters';
import WidgetProducts from '../widgets/WidgetProducts';

// data stubs
import filters from '../../data/shopFilters';
import products from '../../data/shopProducts';


class CategorySidebar extends Component {
    constructor(props) {
        super(props);

        this.backdropRef = React.createRef();
        this.bodyRef = React.createRef();
    }

    componentDidMount() {
        const media = matchMedia('(max-width: 991px)');
        let changedByMedia = false;

        const onChange = () => {
            const {
                offcanvas,
                sidebarClose,
                sidebarState,
            } = this.props;

            if (offcanvas === 'mobile') {
                if (sidebarState.open && !media.matches) {
                    sidebarClose();
                }
                // this is necessary to avoid the transition hiding the sidebar
                if (!sidebarState.open && media.matches && changedByMedia) {
                    /** @var {HTMLElement} */
                    const backdrop = this.backdropRef.current;
                    /** @var {HTMLElement} */
                    const body = this.bodyRef.current;

                    backdrop.style.transition = 'none';
                    body.style.transition = 'none';

                    backdrop.getBoundingClientRect(); // force reflow

                    backdrop.style.transition = '';
                    body.style.transition = '';
                }
            }
        };

        if (media.addEventListener) {
            media.addEventListener('change', onChange);
        } else {
            media.addListener(onChange);
        }

        onChange();

        changedByMedia = true;

        this.tearDown = () => {
            if (media.removeEventListener) {
                media.removeEventListener('change', onChange);
            } else {
                media.removeListener(onChange);
            }
        };
    }

    componentDidUpdate(prevProps) {
        const { sidebarState } = this.props;

        if (prevProps.sidebarState.open !== sidebarState.open) {
            if (sidebarState.open) {
                const width = document.body.clientWidth;

                document.body.style.overflow = 'hidden';
                document.body.style.paddingRight = `${document.body.clientWidth - width}px`;
            } else {
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }
        }
    }

    componentWillUnmount() {
        this.tearDown();
    }

    tearDown = () => { };

    checkDistributor = (id, index) => {
        this.props.filterDistributor(id, index)
    }

    filterCategory = (id) => {
        this.props.filterCategory(id)
    }

    search = (event) => {
        this.props.search(event)
    }

    render() {
        const {
            sidebarClose,
            sidebarState,
            offcanvas,
            daftarcategory,
            seller,
            shoppage_category
        } = this.props;

        const classes = classNames('block block-sidebar', {
            'block-sidebar--open': sidebarState.open,
            'block-sidebar--offcanvas--always': offcanvas === 'always',
            'block-sidebar--offcanvas--mobile': offcanvas === 'mobile',
        });

        return (
            <div className={classes}>
                <div className="block-sidebar__backdrop" ref={this.backdropRef} onClick={() => sidebarClose()} />
                <div className="block-sidebar__body" ref={this.bodyRef}>
                    <div className="block-sidebar__header">
                        <div className="block-sidebar__title">Filter</div>
                        <button className="block-sidebar__close" type="button" onClick={() => sidebarClose()}>
                            <Cross20Svg />
                        </button>
                    </div>
                    <div className="block-sidebar__item">
                        <WidgetFilters title="Filter" filters={filters} offcanvas={offcanvas} seller={seller} 
                        daftarcategory={daftarcategory} shoppage_category={shoppage_category} 
                        filterDistributor={this.checkDistributor} filterCategory={this.filterCategory} search={this.search} />
                    </div>
                    {offcanvas !== 'always' && (
                        <div className="block-sidebar__item d-none d-lg-block">
                            {/* <WidgetProducts title="Latest Products" products={products.slice(0, 5)} /> */}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

CategorySidebar.propTypes = {
    /**
     * indicates when sidebar bar should be off canvas
     */
    offcanvas: PropTypes.oneOf(['always', 'mobile']),
};

CategorySidebar.defaultProps = {
    offcanvas: 'mobile',
};

const mapStateToProps = (state) => ({
    sidebarState: state.sidebar,
});

const mapDispatchToProps = {
    sidebarClose,
};

export default connect(mapStateToProps, mapDispatchToProps)(CategorySidebar);
