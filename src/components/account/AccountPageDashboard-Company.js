import React, { Component } from 'react';
import { Modal, ModalHeader } from 'reactstrap';
import Axios from 'axios';
import {encrypt, url} from '../../lib';
import DialogCatch from '../shared/DialogCatch';

export default class InfoCompanyCard extends Component{
    constructor(props){
        super(props);
        this.state={
            modalStatusCompany: false,
            checkTabPane: true,
            statusTerverifikasi: [],
            statusMenungguTerverifikasi: [],
            statusDitolak: [],
            displayTerverifikasi: {display : 'none'},
            displayMenungguTerverifikasi: {display : 'none'},
            displayDitolak: {display : 'none'},
            displaycatch: false
        }
    }

    ClickTabPane = () => {
        this.setState({ checkTabPane: null });
    }

    toggleModalStatus = () => {
        this.setState({
            modalStatusCompany: !this.state.modalStatusCompany,
            checkTabPane: true
        });
    }

    async componentDidMount(){
      
        let queryListVerify = encrypt("SELECT b.id, b.nama_perusahaan, a.status FROM gcm_company_listing a inner join gcm_master_company b on a.seller_id=b.id where buyer_id = 5 and a.status = 'A' order by b.nama_perusahaan asc");
        let queryListVerifyWaiting = encrypt("SELECT b.id, b.nama_perusahaan, a.status FROM gcm_company_listing a inner join gcm_master_company b on a.seller_id=b.id where buyer_id = 5 and a.status = 'I' order by b.nama_perusahaan asc");
        let queryListVerifyReject = encrypt("SELECT b.id, b.nama_perusahaan, a.status FROM gcm_company_listing a inner join gcm_master_company b on a.seller_id=b.id where buyer_id = 5 and a.status = 'R' order by b.nama_perusahaan asc");

        Axios.post(url.select,{
            query: queryListVerify
        }).then(data=>{
            this.setState({
                statusTerverifikasi: data.data.data
            });
            if (data.data.data.length == 0){
                this.setState({displayTerverifikasi: {display : 'block'}});
            }
           }).catch(err=>{
            this.setState({ displaycatch: true });
            // console.log('error');
            // console.log(err);
        })

        Axios.post(url.select,{
            query: queryListVerifyWaiting
        }).then(data=>{
            this.setState({
                statusMenungguTerverifikasi: data.data.data
            });
            if (data.data.data.length == 0){
                this.setState({displayMenungguTerverifikasi: {display : 'block'}});
            }
        }).catch(err=>{
            this.setState({ displaycatch: true });
            // console.log('error');
            // console.log(err);
        })

        Axios.post(url.select,{
            query: queryListVerifyReject
        }).then(data=>{
            this.setState({
                statusDitolak: data.data.data
            });
            if (data.data.data.length == 0){
                this.setState({displayDitolak: {display : 'block'}});
            }
        }).catch(err=>{
            this.setState({ displaycatch: true });
            // console.log('error');
            // console.log(err);
        })
    }

    render(){

    return(
            <div>
                {/* <div className="product-card__buttons" style={{marginTop: '0px'}}>
                    <span data-toggle="tooltip" title="Edit data"> <div className="btn btn-light btn-xs mb-2 mb-md-3" onClick={this.toggleModalRegister} ><i class="fas fa-pencil-alt"></i></div></span>
                </div> */}

                <div className="address-card__name mt-3">{this.props.data.nama_perusahaan}</div>
                <div className="address-card__row">
                    <div className="address-card__row-title">Tipe Bisnis</div>
                    <div className="address-card__row-content">{this.props.data.nama_tipe_bisnis}</div>
                </div>
                <div className="address-card__row">
                    <div className="address-card__row-title">Telepon</div>
                    <div className="address-card__row-content">{this.props.data.no_telp}</div>
                </div>
                <div className="address-card__row">
                    <div className="address-card__row-title">E-mail</div>
                    <div className="address-card__row-content">{this.props.data.p_email}</div>
                </div>
                {/* <div className="address-card__row">
                    <div className="address-card__row-title">Alamat</div>
                    <div className="address-card__row-content">{this.props.data.alamat}{', '}{this.props.data.kelurahan}{', '}{this.props.data.kecamatan}{', '}{this.props.data.kota}{', '}{this.props.data.provinsi}</div>
                </div> */}
                {/* <div className="address-card__footer">
                    <div className="btn btn-primary btn-sm" onClick={this.toggleModalStatus}>Cek Status Perusahaan</div>
                </div> */}

                <DialogCatch isOpen={this.state.displaycatch}/>
            </div>  
    ) 
   } 
}