// react
import React, { Component } from 'react';

// third-party
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';

// application
import PageHeader from '../shared/PageHeader';
import Product from '../shared/Product';
import ProductTabs from './ProductTabs';

// blocks
import BlockProductsCarousel from '../blocks/BlockProductsCarousel';

// widgets
import WidgetCategories from '../widgets/WidgetCategories';
import WidgetProducts from '../widgets/WidgetProducts';
// import Toast from 'light-toast';

// data stubs
import categories from '../../data/shopWidgetCategories';
import products from '../../data/shopProducts';
import theme from '../../data/theme';


class ShopPageProductLangganan extends Component {
    constructor(props) {
        super(props);
        const { match } = this.props;
        this.state = {
            product_detail: [],
            related_product: [],
            kurs: '',
            product_detail_length: '',
            status_cart: '',
            shoppage_category: 'langganan',
        }
    }

    async componentDidMount() {

        var arraystring = []
        arraystring = this.props.match.params.productId.toString().split("-")

        let query = encrypt("select a.nama, b.barang_id, b.id, b.kode_barang, price, price_terendah, " +
            "case when b.persen_nego_1 != 0 or b.persen_nego_2 != 0 or b.persen_nego_3 != 0 then true else false end as nego_auto, " +
            "case when price = price_terendah then 'no' else 'yes' end as negotiable, foto, flag_foto, category_id, b.company_id, berat, " +
            "b.deskripsi, b.jumlah_min_beli, b.jumlah_min_nego, c.kode_seller,  c.nama_perusahaan, d.alias as satuan, e.nominal as kurs FROM gcm_master_satuan d, gcm_master_company c, gcm_master_barang a " +
            "inner join gcm_list_barang b on a.id=b.barang_id inner join gcm_listing_kurs e on b.company_id = e.company_id where b.status='A' " +
            "and now() between e.tgl_start and e.tgl_end and b.company_id = c.id and a.satuan = d.id and b.id =  " + arraystring[0] + " order by b.create_date desc, category_id asc, nama asc")

        Axios.post(url.select, {
            query: query
        }).then(async (data) => {
            await this.setState({
                product_detail: data.data.data[0],
                product_detail_length: data.data.data.length,
            })

            let getrelated_product = encrypt("SELECT a.nama, b.id, b.barang_id, b.kode_barang, d.alias as satuan, price, b.price_terendah, case when price = price_terendah then 'no' else 'yes' end as negotiable,  b.jumlah_min_beli, b.jumlah_min_nego, foto, flag_foto, category_id, b.company_id, berat, b.deskripsi, c.kode_seller, c.nama_perusahaan, e.nominal as kurs " +
                "FROM gcm_master_satuan d, gcm_master_company c, gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id " +
                "inner join gcm_listing_kurs e on b.company_id = e.company_id inner join gcm_company_listing f on b.company_id = f.seller_id where b.status='A' and b.company_id = c.id and a.satuan = d.id " +
                "and b.id not in(" + arraystring[0] + ") and f.buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + "  and category_id=" + data.data.data[0].category_id + " and now() between e.tgl_start and e.tgl_end order by b.create_date desc, category_id asc, nama asc")

            Axios.post(url.select, {
                query: getrelated_product
            }).then((data) => {

                this.setState({
                    related_product: data.data.data
                })

                let related_product_length = data.data.data.length
                if (related_product_length < 5) {

                    let id_get, total_get, nama_get, category_id_get, company_id_get;
                    let kode_seller_get, nama_perusahaan_get, foto_get, flag_foto_get, price_get;
                    let price_terendah_get, deskripsi_get, jumlah_min_beli_get, jumlah_min_nego_get;
                    let berat_get, satuan_get, kurs, kode_barang_get, negotiable_get;

                    for (var i = 0; i < (5 - related_product_length); i++) {

                        id_get = data.data.data[0].id;
                        kode_barang_get = data.data.data[0].kode_barang;
                        kode_seller_get = data.data.data[0].kode_seller;
                        nama_get = data.data.data[0].nama;
                        category_id_get = data.data.data[0].category_id;
                        company_id_get = data.data.data[0].company_id;
                        nama_perusahaan_get = data.data.data[0].nama_perusahaan;
                        foto_get = data.data.data[0].foto;
                        flag_foto_get = data.data.data[0].flag_foto;
                        price_get = data.data.data[0].price;
                        price_terendah_get = data.data.data[0].price_terendah;
                        deskripsi_get = data.data.data[0].deskripsi;
                        jumlah_min_beli_get = data.data.data[0].jumlah_min_beli;
                        jumlah_min_nego_get = data.data.data[0].jumlah_min_nego;
                        berat_get = data.data.data[0].berat;
                        satuan_get = data.data.data[0].satuan;
                        kurs = data.data.data[0].kurs;
                        negotiable_get = data.data.data[0].negotiable;

                        this.setState(prevState => ({
                            related_product: [...prevState.related_product, {
                                id: id_get, kode_barang: kode_barang_get, nama: nama_get,
                                category_id: category_id_get, company_id: company_id_get,
                                kode_seller: kode_seller_get, nama_perusahaan: nama_perusahaan_get, foto: foto_get,
                                flag_foto: flag_foto_get, price: price_get, price_terendah: price_terendah_get,
                                deskripsi: deskripsi_get, jumlah_min_beli: jumlah_min_beli_get,
                                jumlah_min_nego: jumlah_min_nego_get, berat: berat_get,
                                satuan: satuan_get, kurs: kurs, negotiable: negotiable_get
                            }]
                        }))
                    }
                }
            }).catch(err => {
                // console.log('error');
                // console.log(err);
            })
        }).catch(err => {
            // console.log('error');
            // console.log(err);
        })

        let cek_statuscart = encrypt("select status, nego_count from gcm_master_cart gmc where status = 'A' and company_id =" + decrypt(localStorage.getItem('CompanyIDLogin')) + "  and barang_id = " + arraystring[0]);
        Axios.post(url.select, {
            query: cek_statuscart
        }).then(async (data) => {

            if (data.data.data.length == 0) {
                this.setState({ status_cart: 'cart_no' });
            }
            else if (data.data.data.length > 0) {
                if (data.data.data[0].nego_count > 0) {
                    this.setState({ status_cart: 'nego_yes' });
                }
                else {
                    this.setState({ status_cart: 'buy_yes' });
                }
            }
        }).catch(err => {
            // console.log('error');
            // console.log(err);
        })
    }

    render() {

        const { layout, sidebarPosition, match } = this.props;
        const cek_loaddata = this.state.product_detail_length;
        const breadcrumb = [
            { title: 'Beranda', url: '' },
            { title: 'Daftar Produk Langganan', url: '/daftarproduklangganan' },
            { title: this.state.product_detail.nama, url: '' },
        ];

        let content;

        if (layout === 'sidebar') {
            const sidebar = (
                <div className="shop-layout__sidebar">
                    <div className="block block-sidebar">
                    </div>
                </div>
            );

            content = (
                <div className="container">
                    <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
                        {sidebarPosition === 'start' && sidebar}
                        <div className=" shop-layout__content">
                            <div className=" block">
                                <Product product={this.state.product_detail} layout={layout} />
                                <ProductTabs withSidebar />
                            </div>
                            <BlockProductsCarousel title="Produk Terkait" layout="grid-4-sm" products={this.state.product_detail} withSidebar />
                        </div>
                        {sidebarPosition === 'end' && sidebar}
                    </div>
                </div>
            );
        } else {
            content = (
                <React.Fragment>
                    <div className="block">
                        {
                            cek_loaddata > 0 ?
                                (<div className="container">
                                    <Product product={this.state.product_detail} cart={this.state.status_cart} layout={layout} kurs={this.state.kurs} />
                                    <ProductTabs />
                                </div>) :
                                (<div className="container">
                                    <div className={`product product--layout--${layout}`}>
                                        <div className="product__content">
                                            <shimmerImageProductDetail class="shine"></shimmerImageProductDetail>
                                            <div className="product__info">
                                                <h5 className="product__name"><shimmerNameProductDetail class="shine"></shimmerNameProductDetail></h5>
                                                <div className="product__description">
                                                    <shimmerDescProductDetail class="shine"></shimmerDescProductDetail>
                                                </div>
                                                <shimmerDescProductDetail class="shine"></shimmerDescProductDetail>
                                                <ul className="product__meta">
                                                    <shimmerDescProductDetail class="shine"></shimmerDescProductDetail>
                                                    <li className="product__meta-availability">
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>)
                        }
                    </div>

                    {cek_loaddata > 0 ? (
                        <BlockProductsCarousel title="Produk Terkait" layout="grid-5" products={this.state.related_product}
                            ShopPageProduct={true} kurs={this.state.kurs} shoppage_category={this.state.shoppage_category} />
                    ) : (null
                        )
                    }
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <Helmet>
                    <title>{`${this.state.product_detail.nama} — ${theme.name}`}</title>
                </Helmet>

                {
                    cek_loaddata > 0 ? (<PageHeader breadcrumb={breadcrumb} />
                    ) : (<div className="page-header">
                        <div className="page-header__container container">
                            <div className="page-header__breadcrumb">
                                <div className="product__content">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <shimmerBreadCrumb class="shine"></shimmerBreadCrumb>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>)
                }
                {content}
            </React.Fragment>
        );
    }
}
ShopPageProductLangganan.propTypes = {
    /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
    layout: PropTypes.oneOf(['standard', 'sidebar', 'columnar', 'quickview']),
    /**
     * sidebar position (default: 'start')
     * one of ['start', 'end']
     * for LTR scripts "start" is "left" and "end" is "right"
     */
    sidebarPosition: PropTypes.oneOf(['start', 'end']),
};

ShopPageProductLangganan.defaultProps = {
    layout: 'standard',
    sidebarPosition: 'start',
};

export default ShopPageProductLangganan;
