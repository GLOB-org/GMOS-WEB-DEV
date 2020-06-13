// react
import React, { Component } from 'react';

// third-party
import PropTypes, { string } from 'prop-types';
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
            daftarproduk_tetap: [],
            daftarcategory: [],
            produkperkategori: [],
            seller_id: [],
            dataseller: [],
            filter_distributor: [],
            seller_filter: [],
            category_selected: '0',
            totalproduk: '',
            kurs: '',
            test: '',
            query_status: 'unfinished',
            shoppage_category: 'nonlangganan',
            query_get_seller: '',
            search_value: ''
        };
    }

    async componentDidMount() {

        // let yx = await Axios.get('https://api.exchangeratesapi.io/latest?base=USD');
        // let kurs = yx.data.rates.IDR;

        let get_seller = encrypt("select string_agg(distinct cast(gcl.seller_id as varchar), ',') as seller FROM gcm_master_company gmc ,gcm_company_listing gcl where gcl.seller_id = gmc.id  and gcl.buyer_id  = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and gcl.status = 'A' and gmc.seller_status = 'A'")
        let query_category = encrypt('select id, nama from gcm_master_category order by nama')

        await Axios.post(url.select, {
            query: query_category
        }).then(data => {
            this.setState({
                daftarcategory: data.data.data
            });
        }).catch(err => {
            // console.log('error' + err);
            // console.log(err);
        })

        await this.setState(prevState => ({
            daftarcategory: [{ id: '0', nama: 'All' }, ...prevState.daftarcategory]
        }))

        await Axios.post(url.select, {

            query: get_seller

        }).then(async (data) => {

            this.setState({
                seller_id: data.data.data
            });

            if (data.data.data[0].seller == null) {
                var set_seller = 0
            } else {
                var set_seller = data.data.data[0].seller
            }

            if (decrypt(localStorage.getItem('TipeBisnis')) == 1) {
                var get_produk = encrypt("SELECT a.nama, b.barang_id, b.id, b.kode_barang, price, price_terendah, foto, category_id, b.company_id, berat, b.deskripsi, b.jumlah_min_beli, b.jumlah_min_nego, c.nama_perusahaan, d.alias as satuan FROM gcm_master_satuan d ,gcm_master_company c, gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where a.status='A' and b.status='A' and b.company_id = c.id and d.id = a.satuan and b.company_id not in (" + set_seller + ") order by b.create_date desc, category_id asc, nama asc")
                var get_seller = encrypt("select distinct b.company_id as id, c.nama_perusahaan FROM gcm_master_satuan d ,gcm_master_company c, gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where a.status='A' and b.status='A' and b.company_id = c.id and d.id = a.satuan and b.company_id not in (" + set_seller + ")")
            }
            else {
                var get_produk = encrypt("SELECT a.nama, b.barang_id, b.id, b.kode_barang, price, price_terendah, foto, category_id, b.company_id, berat, b.deskripsi, b.jumlah_min_beli, b.jumlah_min_nego, c.nama_perusahaan, d.alias as satuan FROM gcm_master_satuan d ,gcm_master_company c, gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where a.status='A' and b.status='A' and b.company_id = c.id and d.id = a.satuan and b.company_id not in (" + set_seller + ") and category_id = " + decrypt(localStorage.getItem('TipeBisnis')) + " order by b.create_date desc, category_id asc, nama asc")
                var get_seller = encrypt("SELECT b.company_id as id, c.nama_perusahaan FROM gcm_master_satuan d ,gcm_master_company c, gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where a.status='A' and b.status='A' and b.company_id = c.id and d.id = a.satuan and b.company_id not in (" + set_seller + ") and category_id =  " + decrypt(localStorage.getItem('TipeBisnis')))
            }

            await Axios.post(url.select, {
                query: get_produk
            }).then(async (data) => {
                await this.setState({
                    query_get_seller: get_seller,
                    daftarproduk: data.data.data,
                    daftarproduk_tetap: data.data.data,
                    totalproduk: data.data.data.length,
                    query_status: 'finished'
                });
                this.get_sellerfilter()

            }).catch(err => {
                // console.log('error');
                // console.log(err);
            })

        }).catch(err => {
            // console.log('error');
            // console.log(err);
        })

        // if (decrypt(localStorage.getItem('TipeBisnis')) == 1) {
        //     var getseller_nonlang = encrypt("SELECT string_agg(distinct cast(b.company_id as varchar), ',') as company_id FROM gcm_master_company c, gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where b.status='A' and b.company_id = c.id and b.company_id in(" + this.state.seller_id[0].seller + ")");
        // }
        // else {
        //     var getseller_nonlang = encrypt("SELECT string_agg(distinct cast(b.company_id as varchar), ',') as company_id FROM gcm_master_company c, gcm_master_barang a inner join gcm_list_barang b on a.id=b.barang_id where b.status='A' and b.company_id = c.id and b.company_id in(" + this.state.seller_id[0].seller + ") and category_id = " + decrypt(localStorage.getItem('TipeBisnis')))
        // }

        // await Axios.post(url.select, {
        //     query: getseller_nonlang
        // }).then(data => {
        //     this.setState({
        //         seller_nonlang: data.data.data,
        //     });

        // }).catch(err => {
        //     console.log('error');
        //     console.log(err);
        // })

        // this.get_sellerfilter()
    }

    get_sellerfilter = () => {
        Axios.post(url.select, {
            query: this.state.query_get_seller
        }).then(data => {
            this.setState({
                dataseller: data.data.data
            });
        }).catch(err => {
            // console.log('error');
            // console.log(err);
        })
    }

    get_filterCategory = async (id) => {
        let filter;

        await this.setState({
            category_selected: id,
        });

        if (this.state.filter_distributor == 0) {
            if (id == 0) {
                if (this.state.search_value == '') {
                    await this.setState({
                        daftarproduk: this.state.daftarproduk_tetap,
                        totalproduk: this.state.daftarproduk_tetap.length
                    });
                } else {
                    let searching = this.state.daftarproduk_tetap.filter(input => {
                        return input.nama.toLowerCase().includes(this.state.search_value);
                    });

                    await this.setState({
                        daftarproduk: searching,
                        totalproduk: searching.length
                    });
                }
            }
            else {
                filter = this.state.daftarproduk_tetap.filter(input => {
                    return input.category_id == id;
                });

                if (this.state.search_value == '') {
                    await this.setState({
                        daftarproduk: filter,
                        totalproduk: filter.length,
                    });
                } else {
                    let searching = filter.filter(input => {
                        return input.nama.toLowerCase().includes(this.state.search_value);
                    });

                    await this.setState({
                        daftarproduk: searching,
                        totalproduk: searching.length
                    });
                }
            }
        }
        else if (this.state.filter_distributor.length > 0) {
            if (id == 0) {
                let get_filterDistributor = this.state.daftarproduk_tetap;
                for (var i = 0; i < this.state.filter_distributor.length; i++) {
                    get_filterDistributor = get_filterDistributor.filter(id_dist => {
                        return id_dist.company_id != this.state.filter_distributor[i].id;
                    });
                }

                if (this.state.search_value == '') {
                    await this.setState({
                        daftarproduk: get_filterDistributor,
                        totalproduk: get_filterDistributor.length
                    });
                } else {
                    let searching = get_filterDistributor.filter(input => {
                        return input.nama.toLowerCase().includes(this.state.search_value);
                    });

                    await this.setState({
                        daftarproduk: searching,
                        totalproduk: searching.length
                    });
                }

            }
            else {

                filter = this.state.daftarproduk_tetap.filter(input => {
                    return input.category_id == id;
                });

                let get_filterDistributor = filter;

                for (var i = 0; i < this.state.filter_distributor.length; i++) {
                    get_filterDistributor = get_filterDistributor.filter(id_dist => {
                        return id_dist.company_id != this.state.filter_distributor[i].id;
                    });
                }

                if (this.state.search_value == '') {
                    await this.setState({
                        daftarproduk: get_filterDistributor,
                        totalproduk: get_filterDistributor.length
                    });
                } else {
                    let searching = get_filterDistributor.filter(input => {
                        return input.nama.toLowerCase().includes(this.state.search_value);
                    });

                    await this.setState({
                        daftarproduk: searching,
                        totalproduk: searching.length
                    });
                }
            }
        }

    }


    checkDistributor = async (id, index) => {

        var id_get = id

        if (document.getElementById(id).checked == true) {

            await this.setState({
                filter_distributor: this.state.filter_distributor.filter(
                    id_get => { return id_get.id != id }
                )
            });

            // ketika distributor tdk terpilih semua
            if (this.state.filter_distributor.length > 0) {
                var get_filterDistributor = this.state.daftarproduk_tetap;

                for (var i = 0; i < this.state.filter_distributor.length; i++) {
                    get_filterDistributor = get_filterDistributor.filter(id_dist => {
                        return id_dist.company_id != this.state.filter_distributor[i].id;
                    });
                }
                // kategori all
                if (this.state.category_selected == '0') {
                    if (this.state.search_value == '') {
                        await this.setState({
                            daftarproduk: get_filterDistributor,
                            totalproduk: get_filterDistributor.length,
                        });
                    }
                    else {
                        let searching = get_filterDistributor.filter(input => {
                            return input.nama.toLowerCase().includes(this.state.search_value);
                        });
                        await this.setState({
                            daftarproduk: searching,
                            totalproduk: searching.length,
                        });
                    }
                }
                //kategori bukan all
                else if (this.state.category_selected != '0') {
                    let filter = get_filterDistributor.filter(input => {
                        return input.category_id == this.state.category_selected;
                    });

                    if (this.state.search_value == '') {
                        await this.setState({
                            daftarproduk: filter,
                            totalproduk: filter.length,
                        });
                    }
                    else {
                        let searching = get_filterDistributor.filter(input => {
                            return input.nama.toLowerCase().includes(this.state.search_value);
                        });
                        await this.setState({
                            daftarproduk: searching,
                            totalproduk: searching.length,
                        });
                    }
                }
            }

            // distributor terpilih semua
            else {
                // kategori all
                if (this.state.category_selected == '0') {
                    if (this.state.search_value == '') {
                        await this.setState({
                            daftarproduk: this.state.daftarproduk_tetap,
                            totalproduk: this.state.daftarproduk_tetap.length,
                        });
                    }
                    else {
                        let searching = this.state.daftarproduk_tetap.filter(input => {
                            return input.nama.toLowerCase().includes(this.state.search_value);
                        });
                        await this.setState({
                            daftarproduk: searching,
                            totalproduk: searching.length,
                        });
                    }
                }
                // kategori bukan all
                else if (this.state.category_selected != '0') {
                    let filter = this.state.daftarproduk_tetap.filter(input => {
                        return input.category_id == this.state.category_selected;
                    });

                    if (this.state.search_value == '') {
                        await this.setState({
                            daftarproduk: filter,
                            totalproduk: filter.length,
                        });
                    }
                    else {
                        let searching = filter.filter(input => {
                            return input.nama.toLowerCase().includes(this.state.search_value);
                        });
                        await this.setState({
                            daftarproduk: searching,
                            totalproduk: searching.length,
                        });
                    }
                }
            }
        }

        // unchecked
        else {
            await this.setState(prevState => ({
                filter_distributor: [...prevState.filter_distributor, { id: id_get }]
            }))
            if (this.state.filter_distributor.length > 0) {
                var get_filterDistributor = this.state.daftarproduk_tetap;

                for (var i = 0; i < this.state.filter_distributor.length; i++) {
                    get_filterDistributor = get_filterDistributor.filter(id_dist => {
                        return id_dist.company_id != this.state.filter_distributor[i].id;
                    });
                }

                if (this.state.category_selected == '0') {
                    if (this.state.search_value == '') {
                        await this.setState({
                            daftarproduk: get_filterDistributor,
                            totalproduk: get_filterDistributor.length
                        });
                    }
                    else {
                        let searching = get_filterDistributor.filter(input => {
                            return input.nama.toLowerCase().includes(this.state.search_value);
                        });
                        await this.setState({
                            daftarproduk: searching,
                            totalproduk: searching.length,
                        });
                    }
                }
                // kategori bukan all
                else if (this.state.category_selected != '0') {
                    let filter = get_filterDistributor.filter(input => {
                        return input.category_id == this.state.category_selected;
                    });

                    if (this.state.search_value == '') {
                        await this.setState({
                            daftarproduk: filter,
                            totalproduk: filter.length,
                        });
                    }
                    else {
                        let searching = filter.filter(input => {
                            return input.nama.toLowerCase().includes(this.state.search_value);
                        });
                        await this.setState({
                            daftarproduk: searching,
                            totalproduk: searching.length,
                        });
                    }
                }


            }
        }
    }

    search = async (event) => {
        var searching;

        await this.setState({
            search_value: event
        });

        // jika pilih semua dist 
        if (this.state.filter_distributor.length == 0) {
            // jika pilih semua kategori
            var filterkat;
            if (this.state.category_selected == '0') {
                filterkat = this.state.daftarproduk_tetap
            }
            else if (this.state.category_selected != '0') {
                filterkat = this.state.daftarproduk_tetap.filter(input => {
                    return input.category_id == this.state.category_selected
                });
            }

            searching = filterkat.filter(input => {
                return input.nama.toLowerCase().indexOf(event.toLowerCase()) !== -1;
            });

            await this.setState({
                totalproduk: searching.length,
                daftarproduk: searching
            });
        }

        // jika ada dist yg tdk dipilih
        else if (this.state.filter_distributor.length > 0) {

            var filterdist = this.state.daftarproduk_tetap;

            for (var i = 0; i < this.state.filter_distributor.length; i++) {
                filterdist = filterdist.filter(id_dist => {
                    return id_dist.company_id != this.state.filter_distributor[i].id;
                });
            }

            var filterkat;
            if (this.state.category_selected == '0') {
                filterkat = filterdist
            }
            else if (this.state.category_selected != '0') {
                filterkat = filterdist.filter(input => {
                    return input.category_id == this.state.category_selected
                });
            }

            searching = filterkat.filter(input => {
                return input.nama.toLowerCase().indexOf(event.toLowerCase()) !== -1;
            });

            await this.setState({
                totalproduk: searching.length,
                daftarproduk: searching
            });
        }
    }

    render() {
        const {
            columns,
            viewMode,
            sidebarPosition,
        } = this.props;
        const breadcrumb = [
            { title: 'Beranda', url: '' },
            { title: 'Daftar Produk Non Langganan', url: '' },
        ];
        let content;

        const offcanvas = columns === 3 ? 'mobile' : 'always';

        if (columns > 3) {
            content = (
                <div className="container">
                    <div className="block">
                        <ProductsView
                            // products={products}
                            shoppage_category={this.state.shoppage_category}
                            query_status={this.state.query_status}
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
                    <CategorySidebar offcanvas={offcanvas} seller={this.state.dataseller} daftarcategory={this.state.daftarcategory} shoppage_category={this.state.shoppage_category} filterDistributor={this.checkDistributor} filterCategory={this.get_filterCategory} search={this.search} />
                </div>
            );

            content = (
                <div className="container">
                    <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
                        {sidebarPosition === 'start' && sidebar}
                        <div className="shop-layout__content">
                            <div className="block">
                                <ProductsView
                                    shoppage_category={this.state.shoppage_category}
                                    query_status={this.state.query_status}
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