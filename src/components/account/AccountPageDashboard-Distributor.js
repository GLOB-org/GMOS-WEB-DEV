import React, { Component } from 'react';
import { Badge } from 'reactstrap';

export default class InfoCompanyCard extends Component{
    constructor(props){
        super(props);
    }

    renderStatus(){
        if(this.props.data.status == 'Diverifikasi'){
            return <td><center><Badge color="success">{this.props.data.status}</Badge></center></td>;
        }
        else if(this.props.data.status == 'Menunggu Verifikasi'){
            return <td><center><Badge color="warning">{this.props.data.status}</Badge></center></td>;
        }
        else {
            return <td><center><Badge color="danger">{this.props.data.status}</Badge></center></td>;
        }
    }

    render(){
    return(

            <tr id='rowTransaction' style={{display:'inset'}}>
                <td>
                   {this.props.data.nama_perusahaan}
                </td>
                    {this.renderStatus()}
            </tr>
    )
    
   } 

}