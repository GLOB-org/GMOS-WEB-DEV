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

// application
import languages from '../i18n';
import { localeChange } from '../store/locale';

// pages
import Layout from './Layout';
import HomePageOne from './home/HomePageOne';
import HomePageTwo from './home/HomePageTwo';
import AccountPageLogin from './account/AccountPageLogin';

import CartContainer from '../context/cart';
// import { CartContext } from '../context/cart';

class Root extends Component {

    componentDidMount() {
        //data category
        // const count_category = this.context.category.data_category.length
        // if (count_category == 0) {
        //     const value = this.context;
        //     value.loadDataCategory();
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

                                    {/* <Route
                                    // path="/home"
                                    // render={(props) => (
                                    //     <Layout {...props} headerLayout="default" homeComponent={HomePageOne} />
                                    // )}
                                /> */}

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
