// react
import React, { Component } from 'react';

// third-party
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';

// application
import CategorySidebar from './CategorySidebar';
import PageHeader from '../shared/PageHeader';
import ProductsView from './ProductsView';
import { sidebarClose } from '../../store/sidebar';
import Toast from 'light-toast';

// data stubs
//import products from '../../data/shopProducts';
import theme from '../../data/theme';

class ShopPageCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            daftarproduk: [],
            // daftarkategori: [],
            produkperkategori: [],
            totalproduk: '',
            kurs: '',
            teststate: 9999
        };
    }

    async componentDidMount() {
        if (localStorage.getItem('CompanyIDLogin') != null) {
            // var get_seller = encrypt("select string_agg(cast(gcl.seller_id as varchar), ',') as seller FROM gcm_master_company gmc ,gcm_company_listing gcl where gcl.seller_id = gmc.id  and gcl.buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and gcl.status = 'A' and gmc.seller_status = 'A'")
            var get_seller = encrypt("select string_agg(distinct cast(gcl.seller_id as varchar), ',') as seller FROM gcm_master_company gmc ,gcm_company_listing gcl where gcl.seller_id = gmc.id and gmc.seller_status = 'A'")
        }
        else {
            var get_seller = encrypt("select string_agg(distinct cast(gcl.seller_id as varchar), ',') as seller FROM gcm_master_company gmc ,gcm_company_listing gcl where gcl.seller_id = gmc.id and gmc.seller_status = 'A'")
        }
        // let yx = await Axios.get('https://api.exchangeratesapi.io/latest?base=USD');
        // let kurs = yx.data.rates.IDR;

        let query_kurs = encrypt("select nominal from gcm_master_kurs")

        await Axios.post(url.select, {
            query: query_kurs
        }).then(data => {
            this.setState({
                kurs: data.data.data[0].nominal
            });
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })

        Axios.post(url.select, {

            query: get_seller

        }).then(data => {

            if (localStorage.getItem('TipeBisnis') != null) {
                if (decrypt(localStorage.getItem('TipeBisnis')) == 1) {
                    var get_produk = encrypt("SELECT nama, b.id, price, price_terendah, foto, category_id, b.company_id, berat, b.deskripsi, c.nama_perusahaan FROM gcm_master_company c, gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where b.status='A' and b.company_id = c.id and b.company_id in(" + data.data.data[0].seller + ")  order by b.create_date desc, category_id asc, nama asc");
                }
                else {
                    var get_produk = encrypt("SELECT nama, b.id, price, price_terendah, foto, category_id, b.company_id, berat, b.deskripsi, c.nama_perusahaan FROM gcm_master_company c, gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where b.status='A' and b.company_id = c.id and b.company_id in(" + data.data.data[0].seller + ") and category_id = " + decrypt(localStorage.getItem('TipeBisnis')) + " order by b.create_date desc, category_id asc, nama asc");
                }
            }
            else {
                var get_produk = encrypt("SELECT nama, b.id, price, price_terendah, foto, category_id, b.company_id, berat, b.deskripsi, c.nama_perusahaan FROM gcm_master_company c, gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where b.status='A' and b.company_id = c.id and b.company_id in(" + data.data.data[0].seller + ")  order by b.create_date desc, category_id asc, nama asc");
            }

            Axios.post(url.select, {
                query: get_produk
            }).then(data => {
                this.setState({
                    daftarproduk: data.data.data,
                    totalproduk: data.data.data.length,
                });
              
            }).catch(err => {
                // console.log('error');
                // console.log(err);
            })

        }).catch(err => {
            // console.log('error');
            // console.log(err);
        })

        let get_produkperkategori = encrypt("select * from (select  count(1) Pharmaceutical FROM gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where b.status='A'and category_id=1) Pharmaceutical, " +
            "(select  count(1) Food_and_Beverages FROM gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where b.status='A'and category_id=2) Food_and_Beverages, " +
            "(select  count(1) Cosmetic_and_Toiletries FROM gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where b.status='A'and category_id=3) Cosmetic_and_Toiletries, " +
            "(select  count(1) Veterinary FROM gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where b.status='A'and category_id=4) Veterinary");

        Axios.post(url.select, {
            query: get_produkperkategori
        }).then(data => {
            this.setState({
                produkperkategori: data.data.data
            });
        }).catch(err => {
            // console.log('error');
            // console.log(err);
        })
    }

    render() {
        const {
            columns,
            viewMode,
            sidebarPosition,
        } = this.props;
        const breadcrumb = [
            { title: 'Beranda', url: '' },
            { title: 'Daftar Produk', url: '' },
        ];
        let content;

        const offcanvas = columns === 3 ? 'mobile' : 'always';

        if (columns > 3) {
            content = (
                <div className="container">
                    <div className="block">
                        <ProductsView
                            // products={products}
                            totalproducts={this.state.totalproduk}
                            // products={this.state.daftarproduk}
                            kurs={this.state.kurs}
                            layout={viewMode}
                            grid={`grid-${columns}-full`}
                            limit={15}
                            offcanvas={offcanvas}
                        />
                    </div>
                    <CategorySidebar offcanvas={offcanvas} barangkategori={this.state.produkperkategori}
                    />
                </div>
            );
        } else {
            const sidebar = (
                <div className="shop-layout__sidebar">
                    {/* ubah tempat filter */}
                    <CategorySidebar offcanvas={offcanvas} barangkategori={this.state.produkperkategori} />
                </div>
            );

            content = (
                <div className="container">
                    <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
                        {sidebarPosition === 'start' && sidebar}
                        <div className="shop-layout__content">
                            <div className="block">
                                <ProductsView
                                    //products={products}
                                    totalproducts={this.state.totalproduk}
                                    products={this.state.daftarproduk}
                                    kurs={this.state.kurs}
                                    layout={viewMode}
                                    grid="grid-3-sidebar"
                                    limit={15}
                                    offcanvas={offcanvas}
                                />
                            </div>
                        </div>
                        {sidebarPosition === 'end' && sidebar}
                    </div>
                </div>
            );
        }

        return (
            <React.Fragment>
                <Helmet>
                    <title>{`Daftar Produk — ${theme.name}`}</title>
                </Helmet>
                <PageHeader header="Daftar Produk" breadcrumb={breadcrumb} />
                {content}
            </React.Fragment>
        );
    }
}

ShopPageCategory.propTypes = {
    /**
     * number of product columns (default: 3)
     */
    columns: PropTypes.number,
    /**
     * mode of viewing the list of products (default: 'grid')
     * one of ['grid', 'grid-with-features', 'list']
     */
    viewMode: PropTypes.oneOf(['grid', 'grid-with-features', 'list']),
    /**
     * sidebar position (default: 'start')
     * one of ['start', 'end']
     * for LTR scripts "start" is "left" and "end" is "right"
     */
    sidebarPosition: PropTypes.oneOf(['start', 'end']),
};

ShopPageCategory.defaultProps = {
    columns: 3,
    viewMode: 'grid',
    sidebarPosition: 'start',
};

const mapStateToProps = (state) => ({
    sidebarState: state.sidebar,
});

const mapDispatchToProps = {
    sidebarClose,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCategory);