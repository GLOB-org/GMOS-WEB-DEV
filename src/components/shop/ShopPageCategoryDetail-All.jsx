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

class ShopPageCategoryDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            daftarproduk: [],
            daftarproduk_kategori: [],
            produkperkategori: [],
            totalproduk: '',
            totalproduk_kategori: '',
            kurs: '',
            seller_id: [],
            dataseller: [],
            query_status: 'unfinished',
            shoppage_category: 'all'
        };
    }

    async getdata_category() {
        let filter;
        filter = this.state.daftarproduk.filter(category => {
            return category.nama_kategori.toLowerCase() == this.props.match.params.categoryName.toLowerCase()
        });
        await this.setState({
            daftarproduk_kategori: filter,
            totalproduk_kategori: filter.length
        });
    }

    get_sellerfilter = () => {
        let get_seller = encrypt("select id, nama_perusahaan from gcm_master_company gmc where id in (" + this.state.seller_id[0].seller + ") order by nama_perusahaan")
        
        Axios.post(url.select, {
            query: get_seller
        }).then(data => {
            this.setState({
                dataseller: data.data.data
            });
          
        }).catch(err => {
            // console.log('error');
            // console.log(err);
        })
    }

    async componentDidMount() {
        // alert(this.props.match.params.categoryName)

        if (localStorage.getItem('CompanyIDLogin') != null) {
            var get_seller = encrypt("select string_agg(cast(gcl.seller_id as varchar), ',') as seller FROM gcm_master_company gmc ,gcm_company_listing gcl where gcl.seller_id = gmc.id  and gcl.buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and gcl.status = 'A' and gmc.seller_status = 'A'")
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

        await Axios.post(url.select, {

            query: get_seller

        }).then(data => {

            this.setState({
                seller_id: data.data.data
            });

            if (localStorage.getItem('TipeBisnis') != null) {
                if (decrypt(localStorage.getItem('TipeBisnis')) == 1) {
                    //var get_produk = encrypt("SELECT a.nama, b.id, b.price, b.foto, a.category_id, b.company_id, a.berat, b.deskripsi, c.nama_perusahaan FROM gcm_master_company c, gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where b.status='A' and b.company_id = c.id and b.company_id in(" + data.data.data[0].seller + ")  order by b.create_date desc, category_id asc, nama asc");
                    var get_produk = encrypt("SELECT a.nama, b.id, b.price, b.foto, a.category_id, d.nama as nama_kategori,  b.company_id, a.berat, b.deskripsi, c.nama_perusahaan FROM gcm_master_company c, gcm_master_category d, gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where b.status='A' and b.company_id = c.id and  a.category_id = d.id and b.company_id in(" + data.data.data[0].seller + ")  order by b.create_date desc, a.category_id asc, a.nama asc")
                }
                else {
                    var get_produk = encrypt("SELECT a.nama, b.id, b.price, b.foto, a.category_id,  d.nama as nama_kategori, b.company_id, a.berat, b.deskripsi, c.nama_perusahaan FROM gcm_master_company c, gcm_master_category d, gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where b.status='A' and b.company_id = c.id and  a.category_id = d.id and b.company_id in(" + data.data.data[0].seller + ") and category_id = " + decrypt(localStorage.getItem('TipeBisnis')) + " order by b.create_date desc, category_id asc, nama asc");
                }
            }
            else {
                // var get_produk = encrypt("SELECT a.nama, b.id, b.price, b.foto, a.category_id, b.company_id, a.berat, b.deskripsi, c.nama_perusahaan FROM gcm_master_company c, gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where b.status='A' and b.company_id = c.id and b.company_id in(" + data.data.data[0].seller + ")  order by b.create_date desc, category_id asc, nama asc");
                var get_produk = encrypt("SELECT a.nama, b.id, b.price, b.foto, a.category_id, d.nama as nama_kategori,  b.company_id, a.berat, b.deskripsi, c.nama_perusahaan FROM gcm_master_company c, gcm_master_category d, gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where b.status='A' and b.company_id = c.id and  a.category_id = d.id and b.company_id in(" + data.data.data[0].seller + ")  order by b.create_date desc, a.category_id asc, a.nama asc")
            }
          
            Axios.post(url.select, {
                query: get_produk
            }).then(data => {
                this.setState({
                    query_status: 'finished',
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

        await this.get_sellerfilter()

    }

    render() {
        const {
            columns,
            viewMode,
            sidebarPosition,
        } = this.props;
        const breadcrumb = [
            { title: 'Beranda', url: '' },
            { title: 'Daftar Produk', url: '/daftarprodukall' },
            { title: this.props.match.params.categoryName, url: '' }
        ];
        let content;

        this.getdata_category()

        const offcanvas = columns === 3 ? 'mobile' : 'always';

        if (columns > 3) {
            content = (
                <div className="container">
                    <div className="block">
                        <ProductsView
                            // products={products}
                            totalproducts={this.state.totalproduk}
                            // products={this.state.daftarproduk}
                            shoppage_category={this.state.shoppage_category}
                            query_status={this.state.query_status}
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
                    <CategorySidebar offcanvas={offcanvas} barangkategori={this.state.produkperkategori} test={this.state.test} seller={this.state.dataseller} shoppage_category={this.state.shoppage_category}/>
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
                                    shoppage_category={this.state.shoppage_category}
                                    query_status={this.state.query_status}
                                    totalproducts={this.state.totalproduk_kategori}
                                    products={this.state.daftarproduk_kategori}
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

ShopPageCategoryDetail.propTypes = {
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

ShopPageCategoryDetail.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCategoryDetail);