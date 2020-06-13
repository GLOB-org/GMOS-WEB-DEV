// react
import React from 'react';

// application
import FooterContacts from './FooterContacts';
import FooterLinks from './FooterLinks';
import FooterNewsletter from './FooterNewsletter';

// data stubs
import theme from '../../data/theme';


export default function Footer() {
    const informationLinks = [
        { title: 'About Us', url: '' },
        { title: 'Delivery Information', url: '' },
        { title: 'Privacy Policy', url: '' },
        { title: 'Brands', url: '' },
        { title: 'Contact Us', url: '' },
        { title: 'Returns', url: '' },
        { title: 'Site Map', url: '' },
    ];

    const accountLinks = [
        { title: 'Store Location', url: '' },
        { title: 'Order History', url: '' },
        // { title: 'Wish List', url: '' },
        // { title: 'Newsletter', url: '' },
        // { title: 'Specials', url: '' },
        // { title: 'Gift Certificates', url: '' },
        // { title: 'Affiliate', url: '' },
    ];

    return (
        <div className="site-footer">
            <div className="container">
                <div className="site-footer__widgets">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-4">
                            <FooterContacts />
                        </div>
                        <div className="col-6 col-md-3 col-lg-4">
                            {/* <FooterLinks title="Information" items={informationLinks} /> */}
                        </div>
                        <div className="col-6 col-md-3 col-lg-4">
                            {/* <div style={{ paddingBottom: '80%', position: 'relative' }}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3966.539689063573!2d106.9093948!3d-6.1922884!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4ca99798e37%3A0xea8700008cd88cc8!2sPT.%20Global%20Chemindo%20Megatrading!5e0!3m2!1sid!2sid!4v1590987999489!5m2!1sid!2sid"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight="0"
                                    marginWidth="0"
                                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                                />
                            </div> */}
                            {/* <FooterLinks title="My Account" items={accountLinks} /> */}
                            {/* <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3966.539689063573!2d106.9093948!3d-6.1922884!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4ca99798e37%3A0xea8700008cd88cc8!2sPT.%20Global%20Chemindo%20Megatrading!5e0!3m2!1sid!2sid!4v1590987999489!5m2!1sid!2sid" width="600px" height="450px" ></iframe> */}
                        </div>
                    </div>
                </div>

                {/* <div className="site-footer__bottom">
                    <div className="site-footer__copyright">
                        Powered by
                        {' '}
                        <a href="https://reactjs.org/" rel="noopener noreferrer" target="_blank">React</a>
                        {' '}
                        — Design by
                        {' '}
                        <a href={theme.author.profile_url} target="_blank" rel="noopener noreferrer">
                            {theme.author.name}
                        </a>
                    </div>
                    <div className="site-footer__payments">
                        <img src="images/payments.png" alt="" />
                    </div>
                </div> */}
            </div>
        </div>
    );
}
