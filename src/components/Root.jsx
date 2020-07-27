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

//import { connect_socket } from "../response/index-response";
import openSocket from "socket.io-client";

class Root extends Component {

    static contextType = CartContext;

    componentDidMount() {

        // const socket = openSocket("https://chats-front.herokuapp.com/");

        // socket.emit("send_data_nego_to_admin", {
        //     seller_id: 20,
        //     buyer_id: 10,
        //     room_id: "10-20"
        // })

        // socket.emit("join_room_nego", {
        //     room_id: "10-20"
        // })

        // socket.on('nego_response', data => {

        //     console.log(data)

        //     const options = {
        //         autoClose: false,
        //         className: 'custom-toast',
        //         position: 'bottom-right',
        //         autoClose: 5000
        //     };

        //     if (data.source != 'buyer-direct_response') {
        //         var timeout = 0
        //         if (data.source == 'buyer-hold_response') {
        //             // timeout = 3600000
        //             timeout = 3000
        //         }
        //         setTimeout(function () {
        //             toast.success('💬 Ada balasan nego dari penjual', options);
        //         }, timeout);
        //     }

        //     console.log(this.props.value)
        // })

        // connect_socket(data => {
        //     const options = {
        //         autoClose: false,
        //         className: 'custom-toast',
        //         position: 'bottom-right',
        //         autoClose: 5000
        //     };

        //     if (data.source != 'buyer-direct_response') {
        //         var timeout = 0
        //         if (data.source == 'buyer-hold_response') {
        //             timeout = 3600000
        //         }
        //         setTimeout(function () {
        //             toast.success('💬 Ada balasan nego dari penjual', options);
        //         }, timeout);
        //     }
        // });

        //data category
        //const count_category = this.context.category.data_category.length
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

// const CartContext = React.createContext({});

// const WithContext = (WrappedComponent) => {
//     return () => (
//         <CartContext.Consumer>
//             {value => <Root />}
//         </CartContext.Consumer>
//     )
// }

const WithContext = (WrappedComponent) => (
    (props) => (
        <CartContext.Consumer>
            {(value) => <WrappedComponent {...props} value={value.cart.count_data_cart} />}
        </CartContext.Consumer>
    )
);

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

export default connect(mapStateToProps, mapDispatchToProps)(WithContext(Root));
