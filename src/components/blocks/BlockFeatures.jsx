// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';

// application
import {
    Fi24Hours48Svg,
    FiFreeDelivery48Svg,
    FiPaymentSecurity48Svg,
    FiTag48Svg,
} from '../../svg';


export default function BlockFeatures(props) {
    const { layout } = props;

    return (
        <div className={`block block-features block-features--layout--${layout}`}>
            <div className="container">
                <div className="block-features__list">
                    <div className="block-features__item">
                        <div className="block-features__icon">
                            <FiFreeDelivery48Svg />
                        </div>
                        <div className="block-features__content">
                            <div className="block-features__title">Gratis Biaya Pengiriman</div>
                            <div className="block-features__subtitle">Untuk wilayah tertentu</div>
                        </div>
                    </div>
                    <div className="block-features__divider" />
                    <div className="block-features__item">
                        <div className="block-features__icon">
                            <Fi24Hours48Svg />
                        </div>
                        <div className="block-features__content">
                            <div className="block-features__title">Dukungan 24/7</div>
                            <div className="block-features__subtitle">Hubungi kami kapan pun</div>
                        </div>
                    </div>
                    <div className="block-features__divider" />
                    <div className="block-features__item">
                        <div className="block-features__icon">
                            <FiPaymentSecurity48Svg />
                        </div>
                        <div className="block-features__content">
                            <div className="block-features__title">100% Aman</div>
                            <div className="block-features__subtitle">Only secure payments</div>
                        </div>
                    </div>
                    <div className="block-features__divider" />
                    <div className="block-features__item">
                        <div className="block-features__icon">
                            <FiTag48Svg />
                        </div>
                        <div className="block-features__content">
                            <div className="block-features__title">Penawaran Menarik</div>
                            <div className="block-features__subtitle">Discounts up to 90%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

BlockFeatures.propTypes = {
    layout: PropTypes.oneOf(['classic', 'boxed']),
};

BlockFeatures.defaultProps = {
    layout: 'classic',
};
