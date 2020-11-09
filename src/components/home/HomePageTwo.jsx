// react
import React, { Component } from 'react';

// third-party
import { Helmet } from 'react-helmet-async';

// blocks
import BlockBanner from '../blocks/BlockBanner';
import BlockBrands from '../blocks/BlockBrands';
import BlockCategories from '../blocks/BlockCategories';
import BlockFeatures from '../blocks/BlockFeatures';
import BlockPosts from '../blocks/BlockPosts';
import BlockProductColumns from '../blocks/BlockProductColumns';
import BlockProducts from '../blocks/BlockProducts';
import BlockSlideShow from '../blocks/BlockSlideShow';
import BlockTabbedProductsCarousel from '../blocks/BlockTabbedProductsCarousel';

// data stubs
import categories from '../../data/shopBlockCategories';
import posts from '../../data/blogPosts';
import products from '../../data/shopProducts';
import theme from '../../data/theme';

class HomePageTwo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            display_overlay: 'block'
        };
    }

    clickOverlay = () => {
        this.setState({ display_overlay: 'none' })
    }

    render() {
        const columns = [
            {
                title: 'Top Rated Products',
                products: products.slice(0, 3),
            },
            {
                title: 'Special Offers',
                products: products.slice(3, 6),
            },
            {
                title: 'Bestsellers',
                products: products.slice(6, 9),
            },
        ];

        const checkLogin = localStorage.getItem('Login');
        if (checkLogin) {
            if (this.state.display_overlay == 'none') {
                var display_overlay = 'none'
            }
            else {
                var display_overlay = 'block'
            }

        }
        else {
            var display_overlay = 'none'
        }

        return (

            // <div className="overlay-notification" onClick={this.clickOverlay} style={{ display: display_overlay }}>

                <React.Fragment>

                    <Helmet>
                        <title>{`Beranda — ${theme.name}`}</title>
                    </Helmet>

                    <BlockSlideShow />

                    <BlockFeatures layout="boxed" />

                    {/* <BlockTabbedProductsCarousel title="Produk Unggulan" layout="grid-5" rows={2} /> */}

                    {/* <BlockProducts
                    title="Terlaris"
                    layout="large-last"
                    featuredProduct={products[0]}
                    products={products.slice(1, 7)}
                /> */}

                    {checkLogin ?
                        (<BlockTabbedProductsCarousel title="Produk Langganan Terlaris" layout="grid-5" rows={1} />) :
                        (<BlockTabbedProductsCarousel title="Produk Terlaris" layout="grid-5" rows={1} />)
                    }

                    <BlockBanner />

                    {/* <BlockCategories title="Categories" layout="compact" categories={categories} /> */}

                    {/* <BlockTabbedProductsCarousel title="New Arrivals" layout="grid-5" /> */}

                    <BlockPosts title="Latest News" layout="grid-nl" posts={posts} />

                    <BlockBrands />

                    {/* <BlockProductColumns columns={columns} /> */}
                </React.Fragment>
            // </div>

        );
    }
}

export default HomePageTwo;
