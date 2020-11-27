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
import { Button, Modal } from 'reactstrap';
import { CartContext } from '../../context/cart';

// data stubs
import categories from '../../data/shopBlockCategories';
import posts from '../../data/blogPosts';
import products from '../../data/shopProducts';
import theme from '../../data/theme';

class HomePageTwo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openPermissionNotif: false
        };
    }

    componentDidMount() {
        if (Notification.permission === 'default' && localStorage.getItem('Login') != null) {
            this.setState({ openPermissionNotif: true })
        }
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

                <CartContext.Consumer>
                    {value => {
                        const load_permission = value.notif_permission_show;
                        if (!load_permission) {
                            return (
                                <Modal isOpen={this.state.openPermissionNotif} size="md" centered>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-1 col-md-1  col-sm-1 col-xs-1">
                                                <img src={"/images/north_west.svg"} />
                                            </div>
                                            <div className="col-11 col-md-11 col-sm-11 col-xs-11">
                                                <div className="row ml-1">
                                                    <h5>Permintaan Notifikasi</h5>
                                                </div>
                                                <div className="row ml-1 mt-1">
                                                    Untuk mendapatkan notifikasi, izinkan permintaan di atas
                                                </div>
                                                <div className="row ml-1 mt-3" >
                                                    <CartContext.Consumer>
                                                        {(value) => (
                                                            <Button color="primary" onClick={async () => { await this.setState({ openPermissionNotif: false }); await value.loadNotifPermission() }}>
                                                                OK
                                                            </Button>
                                                        )}
                                                    </CartContext.Consumer>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Modal>
                            )
                        }

                    }}
                </CartContext.Consumer>

                {/* <Modal isOpen={this.state.openPermissionNotif} size="md" centered>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-1 col-md-1  col-sm-1 col-xs-1">
                                <img src={"/images/circled-up-left-24.png"} />
                            </div>
                            <div className="col-11 col-md-11 col-sm-11 col-xs-11">
                                <div className="row ml-1">
                                    <h5>Izinkan Notifikasi</h5>
                                </div>
                                <div className="row ml-1 mt-1">
                                    Untuk mendapatkan notifikasi di aplikasi GLOB
                                </div>
                                <div className="row ml-1 mt-3" >
                                    <Button color="primary" onClick={() => this.setState({ openPermissionNotif: false })}>
                                        Mengerti
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal> */}

                {/* <BlockProductColumns columns={columns} /> */}
            </React.Fragment>
            // </div>

        );
    }
}

export default HomePageTwo;
