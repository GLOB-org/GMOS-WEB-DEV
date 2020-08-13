// react
import React from 'react';
import { NavLink } from 'react-router-dom';

// third-party
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Axios from 'axios';

// application
import CartIndicator from './IndicatorCart';
import ChatIndicator from './IndicatorChat';
import NotifIndicator from './IndicatorNotification';
import Departments from './Departments';
import NavLinks from './NavLinks';
import NavLinksnLogin from './NavLinksnLogin';
import IndicatorSearch from './IndicatorSearch';
import { LogoSmallSvg, LogoGLoB } from '../../svg';
import { encrypt, decrypt, url } from '../../lib';

function NavPanel(props) {
    const { layout, wishlist } = props;
    const checkLogin = localStorage.getItem('Login');

    let logo = null;
    let departments = null;
    let searchIndicator;

    if (layout === 'compact') {
        logo = (
            <div className="nav-panel__logo">
                <Link to="/"><LogoGLoB /></Link>
            </div>
        );

        searchIndicator = <IndicatorSearch />;
    }

    if (layout === 'default') {
        departments = (
            <div className="nav-panel__departments">
                <Departments />
            </div>
        );
    }

    const ClickLogout = () => {
        if (localStorage.getItem('Token') != null) {
            let query = encrypt("delete from gcm_notification_token where user_id = " + decrypt(localStorage.getItem('UserIDLogin')) +
                " and company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and token = '" + decrypt(localStorage.getItem('Token')) + "'")
            Axios.post(url.select, {
                query: query
            }).then(data => {
                localStorage.clear();
                window.location.reload()
                this.props.history.push('/')
            }).catch(err => {
                // console.log('error');
                // console.log(err);
            })
        }
        else {
            window.location.reload()
            localStorage.clear();
        }
    };

    return (
        <div className="nav-panel">
            <div className="nav-panel__container container">
                <div className="nav-panel__row">
                    {/* <h4>GLOB</h4> */}
                    {/* <img src={"/images/verified-60.png"} /> */}
                    {logo}
                    {departments}

                    {checkLogin ? (
                        <div id="nav-panel-loggedin" className="nav-panel__nav-links nav-links" style={{ marginLeft: '50px', display: 'block' }}>
                            <NavLinks />
                        </div>) : (

                            <div id="nav-panel-loggedin" className="nav-panel__nav-links nav-links" style={{ marginLeft: '50px', display: 'none' }}>
                                <NavLinks />
                            </div>
                        )
                    }

                    {checkLogin ? (
                        <div>
                        </div>) : (

                            <div id="nav-panel-loggedin" className="nav-panel__nav-links nav-links" style={{ marginLeft: '50px', display: 'block' }}>
                                <NavLinksnLogin />
                            </div>
                        )
                    }

                    <div className="nav-panel__indicators">
                        {/* {searchIndicator} */}

                        {checkLogin ?
                            (<ChatIndicator />) : null
                        }

                        {checkLogin ?
                            (<NotifIndicator />) : null
                        }

                        {checkLogin ?
                            (<CartIndicator />) : null
                        }

                        <div style={{ marginTop: '5px' }}>

                            {checkLogin ? (
                                // <NavLink to="/">
                                <button type="submit" id="btnLoginHeader" className="btn" onClick={ClickLogout}>
                                    Keluar
                                </button>
                                // </NavLink>
                            ) : (
                                    <NavLink to="/masuk">
                                        <button type="submit" id="btnLoginHeader" className="btn" >
                                            Masuk
                                        </button>
                                    </NavLink>
                                )
                            }

                            {!checkLogin ? (
                                <NavLink to="/daftar">
                                    <button type="submit" id="btnRegisterHeader" className="btn">
                                        Daftar
                               </button>
                                </NavLink>) : (
                                    null
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

NavPanel.propTypes = {
    /** one of ['default', 'compact'] (default: 'default') */
    layout: PropTypes.oneOf(['default', 'compact']),
};

NavPanel.defaultProps = {
    layout: 'default',
};

const mapStateToProps = (state) => ({
    wishlist: state.wishlist,
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(NavPanel);
