// react
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class DialogCatch extends Component {

    // constructor(props){
    //     super(props);
    //     this.state={
    //         displaydialog: 
    //     }
    // }

    render() {
        return (
            <Dialog
                open={this.props.isOpen}
                aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">Nego Berhasil Disepakati </DialogTitle>
                <DialogContent>
                    <center>
                        {/* <img src={"/images/connection.png"} /> */}
                        <i class="fas fa-check-circle fa-3x mb-4" style={{ color: '#8CC63E' }}></i>
                    </center>
                    <DialogContentText>
                        <center>Harga nego berlaku dalam hari yang sama. Silakan membuat pesanan sebelum pukul 24:00 untuk dapat menggunakan harga nego</center>
                    </DialogContentText>
                    <center>
                        <button type="submit" style={{ width: '60%' }} className="btn btn-primary mt-4 mb-3" onClick={this.reload}>
                            OK
                        </button>
                    </center>
                </DialogContent>
            </Dialog>
        );
    }
}

export default DialogCatch;
