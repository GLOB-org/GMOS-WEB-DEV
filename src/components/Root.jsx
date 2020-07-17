// react
import React, { Component } from 'react';

// third-party
import PropTypes from 'prop-types';
import {
    BrowserRouter,
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { IntlProvider } from 'react-intl';
import { ScrollContext } from 'react-router-scroll-4';
import { decrypt, encrypt, url } from '../lib';

// application
import languages from '../i18n';
import { localeChange } from '../store/locale';

// pages
import Layout from './Layout';
import HomePageOne from './home/HomePageOne';
import HomePageTwo from './home/HomePageTwo';
import AccountPageLogin from './account/AccountPageLogin';
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';

import CartContainer from '../context/cart';
import { CartContext } from '../context/cart';

import { connect_socket } from "../response/index-response";

class Root extends Component {

    static contextType = CartContext;

    componentDidMount() {

        connect_socket(data => {

            const options = {
                autoClose: false,
                className: 'custom-toast',
                position: 'bottom-right',
                autoClose: 5000
            };

            console.log(data);

            if (data.source != 'buyer-direct_response') {
                var timeout = 0
                if(data.source == 'buyer-hold_response'){
                     timeout = 3600000
                }
                setTimeout(function () {
                    toast.success('💬 Ada balasan nego dari penjual', options);
                }, timeout);
            }
        });

        //data category
        //const count_category = this.context.category.data_category.length
        console.log(this.context.cart.check_load)
        // if (count_category == 0) {
        // const value = this.context;
        // value.loadDataCart();
        // }

        // preloader
        setTimeout(() => {
            const preloader = document.querySelector('.site-preloader');

            preloader.addEventListener('transitionend', (event) => {
                if (event.propertyName === 'opacity') {
                    preloader.parentNode.removeChild(preloader);
                }
            });
            preloader.classList.add('site-preloader__fade');
        }, 300);
    }

    render() {
        const { locale } = this.props;
        const { messages, direction } = languages[locale];
        // const checkLogin = localStorage.getItem('Login');
        // setInterval(function () { alert("Hello"); }, 10000);

        // select a.barang_id as id_listing, c.barang_id, d.nama, b.time_respon from gcm_master_cart a 
        // inner join gcm_history_nego b on a.history_nego_id = b.id 
        // inner join gcm_list_barang c on a.barang_id = c.id
        // inner join gcm_master_barang d on c.barang_id = d.id 
        // where a.company_id = 5 and a.status = 'A'

        return (
            <div>
                <CartContainer>
                    <IntlProvider locale={locale} messages={messages}>
                        <BrowserRouter basename={process.env.PUBLIC_URL}>
                            <HelmetProvider>
                                <Helmet htmlAttributes={{ lang: locale, dir: direction }} />
                                <ScrollContext>
                                    <Switch>
                                        <Route
                                            path="/"
                                            render={(props) => (
                                                <Layout {...props} headerLayout="compact" homeComponent={HomePageTwo} />
                                            )}
                                        />
                                        <Redirect to="/" />
                                    </Switch>
                                </ScrollContext>
                            </HelmetProvider>
                        </BrowserRouter>
                    </IntlProvider>
                </CartContainer>
            </div>
        );
    }
}

// const MapElement = () => (
//     <CartContext.Consumer>
//         {value =>
//             <Root context={value.cart.check_load} />
//         }
//     </CartContext.Consumer>
// )

// Root.contextType = CartContext

Root.propTypes = {
    /** current locale */
    locale: PropTypes.string,
};

const mapStateToProps = (state) => ({
    locale: state.locale,
});

const mapDispatchToProps = {
    localeChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);
