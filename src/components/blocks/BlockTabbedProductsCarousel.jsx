// react
import React, { Component } from 'react';

// third-party
import PropTypes from 'prop-types';
import { decrypt, encrypt, url } from '../../lib';
import Axios from 'axios';

// application
import products from '../../data/shopProducts';

// data stubs
import BlockProductsCarousel from './BlockProductsCarousel';


export default class BlockTabbedProductsCarousel extends Component {
    timeout;

    constructor(props) {
        super(props);

        this.state = {
            products: [],
            seller: '',
            loading: false,
            kurs: '',
            shoppage_category: 'langganan',
            groups: [
                { id: 100, name: 'Semua', current: true },
                { id: 1, name: 'Pharmaceutical', current: false },
                { id: 2, name: 'Food and Beverages', current: false },
                { id: 3, name: 'Cosmetic and Toiletries', current: false },
                { id: 4, name: 'Veterinary', current: false },
                { id: 5, name: 'Umum', current: false }
            ],
        };
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    async getDataProduk(kategori_id) {

        const checkLogin = localStorage.getItem('Login');

        if (checkLogin != null) {

            var get_seller = encrypt("select string_agg(cast (seller_id as varchar ), ',') as seller_lang " +
                "from gcm_company_listing where buyer_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and status = 'A'")

            await Axios.post(url.select, {
                query: get_seller
            }).then(data => {
                this.setState({
                    seller: data.data.data[0].seller_lang,
                });
            }).catch(err => {
                console.log('error');
                console.log(err);
            })

            if (localStorage.getItem('TipeBisnis') != null) {
                if (decrypt(localStorage.getItem('TipeBisnis')) == 1) {

                    if (kategori_id == 100) {
                        var get_produk = encrypt("select a.barang_id as id, a.total, c.nama, c.category_id,  b.company_id, d.nama_perusahaan, b.foto, b.price, b.price_terendah, case when price = price_terendah then 'no' else 'yes' end as negotiable, " +
                            "b.jumlah_min_beli, b.jumlah_min_nego, b.deskripsi, c.berat, e.alias as satuan, f.nominal as kurs  from (" +
                            "select barang_id, sum(qty) as total from gcm_transaction_detail " +
                            "group by barang_id) as a, gcm_list_barang b, gcm_master_barang c,  gcm_master_company d, gcm_master_satuan e, gcm_listing_kurs f  where a.barang_id = b.id and b.barang_id=c.id and b.company_id = d.id and c.satuan = e.id " +
                            "and f.company_id = b.company_id and b.company_id in (" + this.state.seller + ") and b.status = 'A' and now() between f.tgl_start and f.tgl_end ORDER by a.total desc FETCH FIRST 5 ROWS only")
                    }
                    else {
                        var get_produk = encrypt("select a.barang_id as id, a.total, c.nama, c.category_id,  b.company_id, d.nama_perusahaan, b.foto, b.price, b.price_terendah, case when price = price_terendah then 'no' else 'yes' end as negotiable, " +
                            "b.deskripsi, b.jumlah_min_beli, b.jumlah_min_nego, c.berat, e.alias as satuan, f.nominal as kurs   from (" +
                            "select barang_id, sum(qty) as total from gcm_transaction_detail " +
                            "group by barang_id) as a, gcm_list_barang b, gcm_master_barang c,  gcm_master_company d, gcm_master_satuan e, gcm_listing_kurs f  where a.barang_id = b.id and b.barang_id=c.id and b.company_id = d.id and c.satuan = e.id and c.category_id = " + kategori_id +
                            "and f.company_id = b.company_id and b.company_id in (" + this.state.seller + ") and b.status = 'A' and now() between f.tgl_start and f.tgl_end ORDER by a.total desc FETCH FIRST 5 ROWS only")
                    }
                }

                else {
                    if (kategori_id == 100) {
                        var get_produk = encrypt("select a.barang_id as id, a.total, c.nama, c.category_id,  b.company_id, d.nama_perusahaan, b.foto, b.price, b.price_terendah, case when price = price_terendah then 'no' else 'yes' end as negotiable, " +
                            "b.deskripsi, b.jumlah_min_beli, b.jumlah_min_nego, c.berat, e.alias as satuan, f.nominal as kurs   from (" +
                            "select barang_id, sum(qty) as total from gcm_transaction_detail " +
                            "group by barang_id) as a, gcm_list_barang b, gcm_master_barang c,  gcm_master_company d, gcm_master_satuan e, gcm_listing_kurs f  where a.barang_id = b.id and b.barang_id=c.id and b.company_id = d.id " +
                            "and c.satuan = e.id and c.category_id = " + decrypt(localStorage.getItem('TipeBisnis')) +
                            "and f.company_id = b.company_id and b.company_id in (" + this.state.seller + ") and b.status = 'A' and now() between f.tgl_start and f.tgl_end ORDER by a.total desc FETCH FIRST 5 ROWS only")
                    }
                    else {
                        var get_produk = encrypt(" select * from (select a.barang_id as id, a.total, c.nama, c.category_id,  b.company_id, d.nama_perusahaan, b.foto, b.price, b.price_terendah, case when price = price_terendah then 'no' else 'yes' end as negotiable, " +
                            "b.deskripsi, b.jumlah_min_beli, b.jumlah_min_nego, c.berat, e.alias as satuan, f.nominal as kurs   from (" +
                            "select barang_id, sum(qty) as total from gcm_transaction_detail " +
                            "group by barang_id) as a, gcm_list_barang b, gcm_master_barang c,  gcm_master_company d, gcm_master_satuan e, gcm_listing_kurs f  where a.barang_id = b.id and b.barang_id=c.id and b.company_id = d.id " +
                            "and c.satuan = e.id and c.category_id = " + decrypt(localStorage.getItem('TipeBisnis')) +
                            "and f.company_id = b.company_id and b.company_id in (" + this.state.seller + ") and b.status = 'A' and now() between f.tgl_start and f.tgl_end ORDER by a.total desc FETCH FIRST 5 ROWS only) a where category_id = "+ kategori_id)
                    }
                }
            }

        }
        else {
            if (kategori_id == 100) {

                var get_produk = encrypt("select a.barang_id as id, a.total, c.nama, c.category_id,  b.company_id, d.nama_perusahaan, b.foto, b.price, b.price_terendah, b.jumlah_min_beli, b.jumlah_min_nego, b.deskripsi, c.berat, e.alias as satuan   from (" +
                    "select barang_id, sum(qty) as total from gcm_transaction_detail " +
                    "group by barang_id) as a, gcm_list_barang b, gcm_master_barang c,  gcm_master_company d, gcm_master_satuan e  where a.barang_id = b.id and b.barang_id=c.id and b.company_id = d.id and c.satuan = e.id and b.status = 'A' " +
                    "ORDER by a.total desc FETCH FIRST 5 ROWS only")
            }
            else {
                var get_produk = encrypt("select a.barang_id as id, a.total, c.nama, c.category_id,  b.company_id, d.nama_perusahaan, b.foto, b.price, b.price_terendah, b.deskripsi, b.jumlah_min_beli, b.jumlah_min_nego, c.berat, e.alias as satuan   from (" +
                    "select barang_id, sum(qty) as total from gcm_transaction_detail " +
                    "group by barang_id) as a, gcm_list_barang b, gcm_master_barang c,  gcm_master_company d, gcm_master_satuan e  where a.barang_id = b.id and b.barang_id=c.id and b.company_id = d.id and c.satuan = e.id and b.status = 'A' and c.category_id = " + kategori_id +
                    " ORDER by a.total desc FETCH FIRST 5 ROWS only")
            }
        }

        await Axios.post(url.select, {
            query: get_produk
        }).then(data => {
            this.setState({
                products: data.data.data,
                loading: false,
            });

            let products_length = data.data.data.length
            if (products_length < 5) {

                let id_get, total_get, nama_get, category_id_get, company_id_get;
                let nama_perusahaan_get, foto_get, price_get, price_terendah_get, kurs_get;
                let deskripsi_get, jumlah_min_beli_get, jumlah_min_nego_get, berat_get, satuan_get;

                for (var i = 0; i < (5 - products_length); i++) {

                    id_get = data.data.data[0].id;
                    total_get = data.data.data[0].total;
                    nama_get = data.data.data[0].nama;
                    category_id_get = data.data.data[0].category_id;
                    company_id_get = data.data.data[0].company_id;
                    nama_perusahaan_get = data.data.data[0].nama_perusahaan;
                    foto_get = data.data.data[0].foto;
                    price_get = data.data.data[0].price;
                    price_terendah_get = data.data.data[0].price_terendah;
                    deskripsi_get = data.data.data[0].deskripsi;
                    jumlah_min_beli_get = data.data.data[0].jumlah_min_beli;
                    jumlah_min_nego_get = data.data.data[0].jumlah_min_nego;
                    berat_get = data.data.data[0].berat;
                    satuan_get = data.data.data[0].satuan;
                    kurs_get = data.data.data[0].kurs;

                    this.setState(prevState => ({
                        products: [...prevState.products, {
                            id: id_get, total: total_get, nama: nama_get,
                            category_id: category_id_get, company_id: company_id_get,
                            nama_perusahaan: nama_perusahaan_get, foto: foto_get,
                            price: price_get, price_terendah: price_terendah_get,
                            deskripsi: deskripsi_get, jumlah_min_beli: jumlah_min_beli_get,
                            jumlah_min_nego: jumlah_min_nego_get, berat: berat_get, satuan: satuan_get, kurs: kurs_get
                        }]
                    }))
                }
            }

        }).catch(err => {
            console.log('error');
            console.log(err);
        })

    }

    componentDidMount() {
        this.getDataProduk(100)

    }

    handleChangeGroup = (newCurrentGroup) => {
        clearTimeout(this.timeout);
        const { groups } = this.state;
        const currentGroup = groups.find((group) => group.current);

        if (currentGroup && currentGroup.id === newCurrentGroup.id) {
            return;
        }

        this.setState((state) => (
            {
                loading: true,
                groups: state.groups.map((group) => (
                    { ...group, current: group.id === newCurrentGroup.id }
                )),
            }
        ));

        this.getDataProduk(newCurrentGroup.id)

    };

    render() {
        return (
            <BlockProductsCarousel
                {...this.props}
                {...this.state}
                onGroupClick={this.handleChangeGroup}
            />
        );
    }
}

BlockTabbedProductsCarousel.propTypes = {
    title: PropTypes.string.isRequired,
    layout: PropTypes.oneOf(['grid-4', 'grid-4-sm', 'grid-5', 'horizontal']),
    rows: PropTypes.number,
    withSidebar: PropTypes.bool,
};

BlockTabbedProductsCarousel.defaultProps = {
    layout: 'grid-4',
    rows: 1,
    withSidebar: false,
};
