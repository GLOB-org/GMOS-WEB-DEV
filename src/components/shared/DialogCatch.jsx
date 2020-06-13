// react
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class DialogCatch extends Component {

    reload(){
        window.location.reload()
    } 

    render() {
        return (
            <Dialog
                // maxWidth={'xs'}
                open={this.props.isOpen}
                aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">Koneksi Timeout !</DialogTitle>
                <DialogContent>
                    <center>
                        <img src={"/images/connection.png"} />
                    </center>
                    <DialogContentText>
                        Periksa koneksi internet Anda dan silakan coba kembali
                    </DialogContentText>
                    <center>
                        <button type="submit" style={{ width: '60%' }} className="btn btn-primary mt-4 mb-3" onClick={this.reload}>
                            Coba Lagi
                        </button>
                    </center>
                </DialogContent>
                {/* <DialogActions>
                    <Button color="primary">
                        Coba Lagi
                </Button>
                </DialogActions> */}
            </Dialog>
        );
    }
}

export default DialogCatch;
