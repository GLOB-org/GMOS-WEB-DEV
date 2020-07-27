import React, { Component } from 'react';
export default class InfoCompanyCard extends Component{
    constructor(props){
        super(props);
    }

    render(){
        if (this.props.data.provinsi.toString().toUpperCase().includes('DKI') == true ||
        this.props.data.provinsi.toString().toUpperCase().includes('DIY') == true) {
            var arraystring = []
            arraystring = this.props.data.provinsi.toString().split(" ")
            var get_provinsi_edit = arraystring[0].toUpperCase() + " " + arraystring[1]
        }
        else {
            var get_provinsi_edit = this.props.data.provinsi
        }

    return(
            <tr id='rowTransaction' style={{display:'inset'}}>
                <td >
                    <div className="address-card__row-title">{this.props.data.alamat}</div>
                    <div className="address-card__row-title">{'Kel. '}{this.props.data.kelurahan}{', Kec. '}{this.props.data.kecamatan}</div>
                    <div className="address-card__row-title">{this.props.data.kota}</div>
                    <div className="address-card__row-title">{get_provinsi_edit}{', '}{this.props.data.kodepos}</div>
                    <div className="address-card__row-title">{'Telepon : '}{this.props.data.no_telp}</div>
                </td>

                {this.props.data.shipto_active == 'Y' ?
                    ( <td>
                        <div className="buttonAction">
                            <center><i class="fas fa-check-circle fa-lg " style={{color: '#8CC63E'}}></i></center>
                        </div>
                    </td>) :
                    ( <td>
                        {/* <div className="buttonAction">
                            <center><i class="fas fa-times-circle fa-lg " style={{color: '#8CC63E'}}></i></center>
                        </div> */}
                    </td>)
                }

                {this.props.data.billto_active == 'Y' ?
                    ( <td>
                        <div className="buttonAction">
                        <center><i class="fas fa-check-circle fa-lg " style={{color: '#8CC63E'}}></i></center>
                        </div>
                    </td>) :
                    ( <td>
                        {/* <div className="buttonAction">
                        <center><i class="fas fa-times-circle fa-lg " style={{color: '#8CC63E'}}></i></center>
                        </div> */}
                    </td>)
                }

                <td >
                    <div className="product-card__buttons"  style={{float:'right'}}>
                        <button type="button" class="btn btn-primary btn-xs" style={{whiteSpace: 'nowrap'}} onClick={()=>this.props.setAlamat(this.props.data.id)}>Set alamat utama</button>
                        <button type="button" class="btn btn-light btn-xs"  onClick={()=>this.props.hapusAlamat(this.props.data.id, this.props.index)}>Hapus</button>
                        <button type="button" class="btn btn-light btn-xs" onClick={()=>this.props.editAlamat(this.props.data.id, this.props.index, this.props.data.shipto_active ,this.props.data.billto_active)}>Edit</button>
                    </div>
                </td>
            </tr>
    
    )
    
   } 

}