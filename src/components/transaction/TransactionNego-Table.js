import React, { Component } from 'react';
import NumberFormat from 'react-number-format';

export default class InfoCompanyCard extends Component{
    constructor(props){
        super(props);
        this.state = {
            harga_barang: '',
            sisa_nego: '',
            harga_negopembeli: '',
            harga_negopenjual: '',
            harga_sales: '',
            harga_nego: '',
            time_to_respon:''
        };
    }

    async componentDidMount(){

        let get_hargabarang = Math.ceil(this.props.data.price * this.props.data.kurs);
        let jatah_nego = 3;
        let nego_count = this.props.data.nego_count;
        let sisa_nego_count = jatah_nego - nego_count;
        var getharga_sales; var getharga_nego;
        var gettime_respon = this.props.data.time_respon;
        var timestamp_respon = new Date(gettime_respon).getTime()
        var timestamp_now = new Date().getTime()
        var time_to_respon = "yes";

        if(timestamp_now >= timestamp_respon){
            time_to_respon="yes"
        }
        else if(timestamp_now < timestamp_respon) {
            time_to_respon="no"
        }

        if(nego_count == 1){
            getharga_sales = this.props.data.harga_sales_1
            getharga_nego = this.props.data.harga_nego_1
        }
        else if (nego_count == 2){
            getharga_sales = this.props.data.harga_sales_2
            getharga_nego = this.props.data.harga_nego_2
        }
        else if (nego_count == 3){
            getharga_sales = this.props.data.harga_sales_3
            getharga_nego = this.props.data.harga_nego_3
        }

        await this.setState({
           harga_barang: get_hargabarang,
           sisa_nego : sisa_nego_count,
           harga_sales : getharga_sales,
           harga_nego : getharga_nego,
           time_to_respon: time_to_respon
        });

        if(time_to_respon == "no" || getharga_sales == null || this.props.data.harga_sales == null){
            this.setState({
                harga_sales : null
             });
            document.getElementById('btn-setuju'+ this.props.index).disabled = true
        }
    }

    render(){

        if(this.props.data.nego_count == 1){
            var getharga_sales = this.props.data.harga_sales_1
            var getharga_nego = this.props.data.harga_nego_1
        }
        else if (this.props.data.nego_count == 2){
            var getharga_sales = this.props.data.harga_sales_2
            var getharga_nego = this.props.data.harga_nego_2
        }
        else if (this.props.data.nego_count == 3){
            var getharga_sales = this.props.data.harga_sales_3
            var getharga_nego = this.props.data.harga_nego_3
        }

        var sisa_nego = 3-this.props.data.nego_count
        var gettime_respon = this.props.data.time_respon;
        var timestamp_respon = new Date(gettime_respon).getTime()
        var timestamp_now = new Date().getTime()
        var time_to_respon = "yes";
        if(timestamp_now >= timestamp_respon){
            time_to_respon="yes"
        }
        else if(timestamp_now < timestamp_respon) {
            time_to_respon="no"
        }

        if(time_to_respon == "no" || getharga_sales == null || this.props.data.harga_sales == null){
            getharga_sales = null
            // document.getElementById('btn-setuju'+ this.props.index).disabled = true
        }

    return(

        <div style={{display: 'contents'}}>
            <tr id='rowTransactionNego' style={{display:'none'}}>
            </tr>
            <tr id='rowTransactionNego' style={{fontSize:'13px'}}>
                <td>{this.props.data.nama}</td>
                <td>{this.props.data.nama_perusahaan}</td>
                <td>{this.props.data.create_date}</td>
                <td style={{textAlign: 'right'}}><NumberFormat value={Math.ceil(this.props.data.price * this.props.data.kurs)} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} /></td>
                <td style={{textAlign: 'right'}}><NumberFormat value={getharga_nego} displayType={'text'} allowNegative={false} thousandSeparator={'.'} decimalSeparator={','} /></td>    
                
                {(time_to_respon == "yes" && getharga_sales != null) ?
                    (<td style={{textAlign: 'right'}}><span><NumberFormat value={getharga_sales} displayType={'text'} allowNegative={false}  thousandSeparator={'.'} decimalSeparator={','} /></span></td>) 
                    :
                    (<td><center><span > Menunggu respon</span></center></td>)
                }

                <td><center>{sisa_nego} x</center></td>
                <td>
                    {this.props.status == "nego_aktif" ?
                        (   <div >
                                <center>
                                    <button id={'btn-setuju'+this.props.index} type="button" class="btn btn-primary btn-xs" onClick={()=>this.props.approve_nego(this.props.index, this.state.harga_sales)} style={{ width: '80px' }}>Setuju</button>
                                </center>
                                <center>
                                    <button type="button" class="btn btn-secondary btn-xs" onClick={()=>this.props.nego_detail(this.props.index, 'aktif')} style={{ marginTop: '5px', width: '80px' }}> Nego </button>
                                </center>
                            </div>
                        ) :
                        (   <div>
                                <center>
                                    <button type="button" class="btn btn-primary btn-xs" onClick={()=>this.props.nego_detail(this.props.index, 'selesai')} style={{ marginTop: '5px', width: '80px' }}> Detail </button>
                                </center>
                            </div>
                        )
                    }
                </td>
            </tr>
        </div>
        
    )
   } 
}