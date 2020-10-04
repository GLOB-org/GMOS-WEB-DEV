import React, { Component } from 'react';

import Axios from 'axios';
import { decrypt, encrypt, url } from '../../lib';

import {Button, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Toast from 'light-toast';
import DialogCatch from '../shared/DialogCatch';

export default class InfoCompanyCard extends Component{
    constructor(props){
        super(props);
        this.state = {
            data_username: [],
            data_akun: [],
            check_submit_false:[],
            modalOpenRegister: false, modalOpenAkun: false,
            inputNamaLengkap: '', empty_namalengkap: false, KetTextNama: '',
            inputNoKTP: '', empty_ktp: false, KetTextKTP: '',
            inputEmail: '', empty_email: false,  KetTextEmail: '',
            inputHP: '', empty_hp: false, KetTextHP: '',
            inputUsername: '', empty_username: false, KetTextUsername: '',
            inputPassword: '', empty_password: false, KetTextPassword: '',
            inputRePassword: '', empty_repassword: false, KetTextRePassword: '',
            inputStatus:'I',inputRole:'user',

            inputUsername_edit: '', empty_username_edit: false, KetTextUsername_edit: '', username_tetap_edit: '',
            inputPassword_edit_old:'', inputPassword_edit: '', empty_password_edit: false, empty_password_verif: false, KetTextPassword_edit: '', KetTextPassword_verif: '',
            inputEmail_edit: '', empty_email_edit: false,  KetTextEmail_edit: '',
            inputHP_edit: '', empty_hp_edit: false, KetTextHP_edit: '',
        
            modalEditAkun: false, 
            get_statususer: '',
            icon_pass: 'fa fa-eye-slash',
            icon_repass: 'fa fa-eye-slash',
            openConfirmation: false,
            isValidate: false,
            openTambahAkunRestrict: false,
            openConfirmationEditAkun: false,
            role_user: '',
            displaycatch: false
        };
   }

   checkSubmit= async(get_username, get_no_hp, get_email, get_submit_type)=>{

    if(get_submit_type == 'edit'){
        var id_user = decrypt(localStorage.getItem('UserIDLogin'))
        var param = "and id != " + id_user
    }
    else {
        var param = ""
    }

    let query = encrypt("select * from "+
    "(select count (username) as check_username from gcm_master_user gmu where username like '"+get_username+"' "+param+") a, "+
    "(select count (no_hp) check_nohp from gcm_master_user gmu where no_hp like '"+get_no_hp+"' "+param+") b, "+
    "(select count (email) check_email from gcm_master_user gmu where email like '"+get_email+"' "+param+") c")

    Toast.loading('loading . . .', () => {});

    await Axios.post(url.select, {
        query: query
    }).then((data) => {

        this.setState({ 
            check_submit_false: data.data.data
        })

        Toast.hide()
      
    }).catch(err => {
        // console.log("eror : " + err);
    })   

   }

   controlConfirmation=async()=>{

    if(this.state.inputNamaLengkap == '' ||
        this.state.inputNoKTP == '' ||
        this.state.inputEmail == '' ||
        this.state.inputHP == '' ||
        this.state.inputUsername == '' ||
        this.state.inputPassword == '' ||
        this.state.inputRePassword == ''
    ){
        Toast.info('Silakan isi data yang masih kosong !', 2500, () => {
        });
    
        if(this.state.inputNamaLengkap == ''){
            this.setState({ 
                empty_namalengkap: true
            })
        }
    
        if(this.state.inputNoKTP == ''){
            this.setState({ 
                empty_ktp: true
            })
        }
    
        if(this.state.inputEmail == ''){
            this.setState({ 
                empty_email: true
            })
        }
    
        if(this.state.inputHP == ''){
            this.setState({ 
                empty_hp: true
            })
        }
    
        if(this.state.inputUsername == ''){
            this.setState({ 
                empty_username: true
            })
        }
    
        if(this.state.inputPassword == ''){
            this.setState({ 
                empty_password: true
            })
        }
    
        if(this.state.inputRePassword == ''){
            this.setState({ 
                empty_repassword: true
            })
        }
    }

    else if(this.state.empty_namalengkap == true ||
        this.state.empty_ktp == true ||
        this.state.empty_email == true ||
        this.state.empty_hp == true ||
        this.state.empty_username == true ||
        this.state.empty_password == true ||
        this.state.empty_repassword == true){
        Toast.info('Silakan isi data dengan benar !', 2500, () => {
        });
    }

    else if(this.state.empty_namalengkap == false &&
        this.state.empty_ktp == false &&
        this.state.empty_email == false &&
        this.state.empty_hp == false &&
        this.state.empty_username == false &&
        this.state.empty_password == false &&
        this.state.empty_repassword == false
        )
    {

        await this.checkSubmit(this.state.inputUsername, this.state.inputHP, this.state.inputEmail, 'add')

        if(this.state.check_submit_false[0].check_username > 0){
            this.setState({
                empty_username: true,
                KetTextUsername: "username telah digunakan"
            });
        }

        if(this.state.check_submit_false[0].check_nohp > 0){
            this.setState({
                empty_hp : true,
                KetTextHP : "nomor handphone telah digunakan"
            });
        }

        if(this.state.check_submit_false[0].check_email > 0){
            this.setState({
                empty_email: true,
                KetTextEmail: "e-mail telah digunakan"
            });
        }

        else if (this.state.empty_username == false &&
            this.state.empty_hp == false &&
            this.state.empty_password == false &&
            this.state.empty_email == false
            ) {
            this.setState({ 
                openConfirmation: !this.state.openConfirmation,
                empty_namalengkap: false,
                empty_ktp: false,
                empty_email: false,
                empty_hp: false,
                empty_username: false,
                empty_password: false,
                empty_repassword: false
                });
            }   
        }
   }

   controlConfirmationEdit = async()=>{

    if(this.state.inputUsername_edit  == '' ||
    this.state.inputHP_edit == '' ||
    this.state.inputEmail_edit == '' 
    ){
        Toast.info('Silakan isi data yang masih kosong !', 2500, () => {
        });
        if (this.state.inputUsername_edit == ''){
            this.setState({ 
                empty_username_edit: true
             });
        }
        if (this.state.inputHP_edit == ''){
            this.setState({ 
                empty_hp_edit: true,
             });
        }
        if (this.state.inputEmail_edit == ''){
            this.setState({ 
                empty_email_edit: true,
             });
        } 
    }

    else if(this.state.empty_username_edit == true ||
        this.state.empty_hp_edit == true ||
        this.state.empty_email_edit == true || 
        this.state.empty_password_edit == true
      ){
        Toast.info('Silakan isi data dengan benar !', 2500, () => {
        });
    }

    else if(this.state.empty_username_edit == false &&
        this.state.empty_hp_edit == false &&
        this.state.empty_email_edit == false){

        await this.checkSubmit(this.state.inputUsername_edit, this.state.inputHP_edit, this.state.inputEmail_edit, 'edit')

        if(this.state.check_submit_false[0].check_username > 0){
            this.setState({
                empty_username_edit: true,
                KetTextUsername_edit : "username telah digunakan"
            });
        }

        if(this.state.check_submit_false[0].check_nohp > 0){
            this.setState({
                empty_hp_edit: true,
                KetTextHP_edit : "nomor handphone telah digunakan"
            });
        }

        if(this.state.check_submit_false[0].check_email > 0){
            this.setState({
                empty_email_edit: true,
                KetTextEmail_edit : "e-mail telah digunakan"
            });
        }

        else if( this.state.empty_username_edit == false &&
            this.state.empty_hp_edit == false &&
            this.state.empty_password_edit == false &&
            this.state.empty_email_edit == false
            ){
            this.setState({ 
                openConfirmationEditAkun: !this.state.openConfirmationEditAkun,
                empty_password_verif : false     
                });
        }
    }
   }

    handleChange=(event)=>{
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
        [name] : value
        })
    }

    handleWhitespace = (event) => {
        if (event.which === 32) {
            event.preventDefault();
        }
    }

    handleSubmit = async() =>{
    
    Toast.loading('loading . . .', () => {});
    
    // await this.checkSubmit(this.state.inputUsername, this.state.inputHP, this.state.inputEmail)

        if(this.state.check_submit_false[0].check_username == 0 && 
            this.state.check_submit_false[0].check_nohp == 0 && 
            this.state.check_submit_false[0].check_email == 0){

            let insertakun = encrypt("INSERT INTO gcm_master_user " +
            "(nama, no_ktp, email, no_hp, username, password, status, role, company_id, create_by, update_by, update_date, sa_role, sa_divisi, email_verif, no_hp_verif, blacklist_by, id_blacklist, is_blacklist, notes_blacklist) " +
            "VALUES ('"+this.state.inputNamaLengkap+"'," +
                    "'"+this.state.inputNoKTP+"'," +
                    "'"+this.state.inputEmail+"'," +
                    "'"+this.state.inputHP+"'," +
                    "'"+this.state.inputUsername+"'," +
                    "'"+encrypt(this.state.inputPassword)+"'," +
                    "'"+this.state.inputStatus+"'," +
                    "'"+this.state.inputRole+"'," +
                    "'"+ decrypt(localStorage.getItem('CompanyIDLogin')) +"'," + 
                    "'"+ decrypt(localStorage.getItem('UserIDLogin')) +"','"+decrypt(localStorage.getItem('UserIDLogin')) +
                    "', now(), null, null, false, false ,null, 0, false, '')") 
        
            Axios.post(url.select, {
                    query: insertakun
                }).then((data) => {
                    Toast.hide();
                    Toast.success('Berhasil menambah akun', 2000, () => {
                        });
                    this.load_dataAkun()
                    this.toggleModalRegister()
                    this.setState({ openConfirmation: false }); 
                }).catch(err => {
                    // console.log("eror : " + err);
                })   
        }
    }

    load_dataAkun = () =>{
        
        let daftarakun = encrypt("select nama, username, no_hp, email, case when status like 'I' " +
        "then 'Belum Aktif' when status like 'A' then 'Aktif' end as status  from gcm_master_user " +
        "where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and role = 'user' order by nama")

        Axios.post(url.select, {
            query: daftarakun
        }).then((data) => {
            this.setState({ 
                data_akun: data.data.data,
            }); 
        }).catch(err => {
            // console.log("eror : " + err);
        })   
    }

    toggleModalAkun = () =>{
        
        let daftarakun = encrypt("select nama, username, no_hp, email, case when status like 'I' " +
        "then 'Belum Aktif' when status like 'A' then 'Aktif' end as status  from gcm_master_user " +
        "where company_id = " + decrypt(localStorage.getItem('CompanyIDLogin')) + " and role = 'user' order by nama")

        Toast.loading('loading . . .', () => {});

        Axios.post(url.select, {
            query: daftarakun
        }).then((data) => {
            Toast.hide()
            this.setState({ 
                data_akun: data.data.data,
                modalOpenAkun: !this.state.modalOpenAkun 
            }); 
        }).catch(err => {
            // console.log("eror : " + err);
        })   
    }

    toggleModalRegister = () => {
        if (this.state.role_user == 'user'){
            this.setState({ openTambahAkunRestrict: true }); 
        }
        else { if(this.state.modalOpenRegister == false){
            // let query_username = encrypt("select username from gcm_master_user")

            // Axios.post(url.select, {
            //     query: query_username
            // }).then(data => {
            //     this.setState({ data_username: data.data.data });
            // }).catch(err => {
            //     this.setState({ displaycatch: true });
            //     // console.log('error' + err);
            //     // console.log(err);
            // }) 
        }
        this.setState({ 
            modalOpenRegister: !this.state.modalOpenRegister,
            inputNamaLengkap: '',
            inputNoKTP: '',
            inputEmail: '',
            inputHP: '',
            inputUsername: '',
            inputPassword: '',
            inputRePassword: '',
            empty_namalengkap: false, 
            empty_ktp: false,
            empty_email: false,
            empty_hp: false,
            empty_username: false,
            empty_password: false,
            empty_repassword: false
         });}
    }   
    
    toggleCloseTambahAkun =()=>{
        this.setState({  
            openTambahAkunRestrict: !this.state.openTambahAkunRestrict
        });
    }

    toggleModalEditAkun =()=>{
        // let query_username = encrypt("select username from gcm_master_user")
        //     Axios.post(url.select, {
        //         query: query_username
        //     }).then(data => {
        //         this.setState({ data_username: data.data.data });
        //     }).catch(err => {
        //         this.setState({ displaycatch: true });
        //         // console.log('error' + err);
        //         // console.log(err);
        //     }) 

        this.setState({
            empty_username_edit: false, KetTextUsername_edit: '',
            empty_password_edit: false, empty_password_verif: false, 
            KetTextPassword_edit: '', KetTextPassword_verif: '',
            empty_email_edit: false,  KetTextEmail_edit: '',
            empty_hp_edit: false, KetTextHP_edit: '',
            modalEditAkun: !this.state.modalEditAkun,
            inputUsername_edit: this.props.data.username,
            inputPassword_edit_old: decrypt(this.props.data.password),
            inputEmail_edit: this.props.data.u_email,
            inputHP_edit: this.props.data.no_hp
        });
       
    }

    Email_validation = async (event)=>{
        this.handleChange(event);
        var get_input = event.target.value;
        this.setState({ inputEmail_edit: get_input});
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(get_input.match(mailformat) || get_input.length == 0){
            this.setState({empty_email : false, 
                           empty_email_edit : false});
            this.setState({KetTextEmail : "",
                           KetTextEmail_edit : ""});
        }
        else{
            this.setState({empty_email : true,
                           empty_email_edit : true});
            this.setState({KetTextEmail : "Tidak valid",
                           KetTextEmail_edit : "Tidak valid"});
        }
    }

    HP_validation = async (event) => {
        if (isNaN(Number(event.target.value))) {
            return;
          } else {
            this.setState({ 
                inputHP: event.target.value, 
                inputHP_edit: event.target.value
            });
          }
        var get_input = event.target.value
        
        if (get_input.length >=1){
            // get_input.substring(0,2) != '08' && get_input.length > 0 ) || 
            if (get_input.substring(0,1) != '0'){
                this.setState({
                    empty_hp : true,
                    empty_hp_edit : true
                });
                this.setState({
                    KetTextHP : "Tidak valid",
                    KetTextHP_edit: "Tidak valid"
                });
            }

            else if (get_input.substring(0,1) == '0' && get_input.length < 10){
                this.setState({
                    empty_hp : true,
                    empty_hp_edit : true
                });
                this.setState({
                    KetTextHP : "Tidak valid",
                    KetTextHP_edit: "Tidak valid"
                });
            }

            else if ((get_input.substring(0,1) == '0' && get_input.length >= 10)){
                this.setState({
                    empty_hp : false,
                    empty_hp_edit : false
                });
                this.setState({
                    KetTextHP : "",
                    KetTextHP_edit: ""
                });
            }
        }  
        
        else if (get_input.length == 0){
            this.setState({
                empty_hp : false,
                empty_hp_edit : false
            });
            this.setState({
                KetTextHP : "",
                KetTextHP_edit: ""
            });
        }
    }

    KTP_validation = async (event) => {
        if (isNaN(Number(event.target.value))) {
            return;
          } else {
            this.setState({ inputNoKTP: event.target.value });
        }

        const get_input = event.target.value        
        if (get_input.length < 16 && get_input.length > 0){
            this.setState({empty_ktp : true});
            this.setState({KetTextKTP : "Tidak valid ("+get_input.length + "/16)"});
        }
        else if (get_input.length == 16 || get_input.length == 0){
            this.setState({empty_ktp : false});
            this.setState({KetTextKTP : ""});
        }
    }

    NamaLengkap_handle = (event) => {
        // this.setState({ 
        //     inputNamaLengkap: event.target.value,
        //     empty_namalengkap: false
        // });

        if (event.target.value.match("^[a-zA-Z ]*$") !== null) {
            this.setState({
                inputNamaLengkap: event.target.value,
                empty_namalengkap: false
            });
        } else {
            return;
        }
    }

    Password_validation = (event)=>{
        this.Repassword_validation(event);
        const get_input = event.target.value;
        var contain_LowerCase = 'n';
        var contain_UpperCase = 'n'; 
        var contain_Number = 'n';
        if (get_input.toUpperCase() != get_input) {
         contain_LowerCase = 'y';
         }
        
        if (get_input.toLowerCase() != get_input) {
         contain_UpperCase = 'y';
         }
 
        if (/\d/.test(get_input)){
         contain_Number = 'y';
        }
        
         if ((contain_UpperCase == 'y' && contain_LowerCase == 'y' && contain_Number == 'y' && get_input.length >= 8) || get_input.length == 0){
             this.setState({empty_password : false});
             this.setState({KetTextPassword : ""});
         }
         else if (contain_UpperCase == 'n' || contain_LowerCase == 'n' || contain_Number == 'n' || (get_input.length > 0 && get_input.length <8)) {
             this.setState({empty_password : true});
             this.setState({KetTextPassword : "Minimal 8 karakter dan harus terdiri dari A-Z, a-z, dan 0-9"});
         }
    }

    Repassword_validation = (event)=>{
        this.handleChange(event);
        if (this.state.inputRePassword != event.target.value && this.state.inputPassword != event.target.value && 
            document.getElementById("account-repassword").value != ''){        
            this.setState({empty_repassword : true});
            this.setState({KetTextRePassword : 'Password tidak cocok'});
          }
        else if (this.state.inputRePassword == event.target.value || 
            this.state.inputPassword == event.target.value){
            this.setState({empty_repassword : false});
            this.state.KetTextRePassword = ''
        }

        else if (event.target.value.length == 0){
            this.setState({empty_repassword : false});
            this.state.KetTextRePassword = ''
        }
    }

    Password_validation_edit = (event) =>{
        const get_input = event.target.value;
        this.setState({inputPassword_edit : get_input});
        var contain_LowerCase = 'n';
        var contain_UpperCase = 'n'; 
        var contain_Number = 'n';
        if (get_input.toUpperCase() != get_input) {
         contain_LowerCase = 'y';
         }
        
        if (get_input.toLowerCase() != get_input) {
         contain_UpperCase = 'y';
         }
 
        if (/\d/.test(get_input)){
         contain_Number = 'y';
        }
        
         if ((contain_UpperCase == 'y' && contain_LowerCase == 'y' && contain_Number == 'y' && get_input.length >= 8) || get_input.length == 0){
             this.setState({empty_password_edit : false});
             this.setState({KetTextPassword_edit : ""});
         }
         else if (contain_UpperCase == 'n' || contain_LowerCase == 'n' || contain_Number == 'n' || (get_input.length > 0 && get_input.length <8)) {
             this.setState({empty_password_edit : true});
             this.setState({KetTextPassword_edit : "Minimal 8 karakter dan harus terdiri dari A-Z, a-z, dan 0-9"});
         }    
        }

    Password_verif =(event) =>{
        if(event.target.value.length > 0){
            this.setState({
                empty_password_verif : false,
                KetTextPassword_verif: ''
            });
        }
    }

    Username_validation = async (event)=>{
        this.handleChange(event);
        const get_input = event.target.value
        this.setState({inputUsername : event.target.value,
                       inputUsername_edit : event.target.value});
        
        if (get_input.length < 8 && get_input.length > 0){
            this.setState({empty_username : true,
                           empty_username_edit: true});
            this.setState({KetTextUsername : "Tidak valid (Minimal 8 karakter)",
                            KetTextUsername_edit : "Tidak valid (Minimal 8 karakter)"});
        }
        else if (get_input.length >= 8 || get_input.length == 0){
            this.setState({empty_username : false,
                           empty_username_edit: false});
            this.setState({KetTextUsername : "",
                           KetTextUsername_edit : ""});
            let check_username = this.state.data_username.filter(input_username => {
                return input_username.username === event.target.value; 
              }); 
              if (check_username != '' && event.target.value != this.state.username_tetap_edit){
                this.setState({empty_username : true,
                               empty_username_edit: true});
                this.setState({KetTextUsername : "Username sudah digunakan",
                               KetTextUsername_edit : "Username sudah digunakan"});
              }
              else {
                this.setState({empty_username : false,
                               empty_username_edit: false});
                this.setState({KetTextUsername : "",
                               KetTextUsername_edit : ""});
              }
        }
    }

    Password_appear = () =>{
        if (document.getElementById('account-password').type == 'password'){
            document.getElementById('account-password').type = 'text'
            this.setState({icon_pass : 'fa fa-eye'});        
        }
        else {
            document.getElementById('account-password').type = 'password'
            this.setState({icon_pass : 'fa fa-eye-slash'});        
        }
    }

    RePassword_appear = () =>{
        if (document.getElementById('account-repassword').type == 'password'){
            document.getElementById('account-repassword').type = 'text'
            this.setState({icon_repass : 'fa fa-eye'});        
        }
        else {
            document.getElementById('account-repassword').type = 'password'
            this.setState({icon_repass : 'fa fa-eye-slash'});        
        }
    }

    submitEditAkun =()=> {
        if (document.getElementById('password-verif').value == "" ){
            this.setState({empty_password_verif : true});        
        }
        else {
            if (document.getElementById('password-verif').value == this.state.inputPassword_edit_old){
                
                if(this.state.inputPassword_edit != ''){
                    var get_password = this.state.inputPassword_edit
                }
                else {
                    var get_password = this.state.inputPassword_edit_old
                }

                let updatedata = encrypt("update gcm_master_user set username = '" + this.state.inputUsername_edit + "', email = '" + this.state.inputEmail_edit + "', password = '" + 
                                 encrypt(get_password) + "', no_hp = '" + this.state.inputHP_edit + "', update_date = now(), update_by = " + 
                                 decrypt(localStorage.getItem('UserIDLogin')) + " where id = " + decrypt(localStorage.getItem('UserIDLogin')))
                      
                       Toast.loading('loading . . .', () => {
                        });
                        Axios.post(url.select, {
                                query: updatedata
                            }).then((data) => {
                                Toast.hide();
                                Toast.success('Berhasil menyimpan perubahan', 2000, () => {
                                });
                                this.props.load_dataAkun()
                                this.setState({
                                    openConfirmationEditAkun : false,
                                    modalEditAkun: false
                                });        
                            }).catch(err => {
                                // console.log("eror : " + err);
                            }) 
            }
            else if (document.getElementById('password-verif').value != this.state.inputPassword_edit_old) {
                this.setState({
                    empty_password_verif : true,
                    KetTextPassword_verif: 'password salah'
                });
            }
        }
    }

    validation=()=>{

        if (this.state.inputNamaLengkap == '' || this.state.empty_namalengkap == true){
            this.setState({empty_namalengkap : true});
        }
        else{
            this.setState({empty_namalengkap : false});
        }
        if (this.state.inputNoKTP == '' || this.state.isEmptyKTP == true){
            this.setState({empty_ktp : true});
        }
        else{
            this.setState({empty_ktp : false});
        }
        if (this.state.inputEmail == '' || this.state.empty_email == true){
            this.setState({empty_email : true});
        }
        else{
            this.setState({empty_email : false});
        }
        if (this.state.inputHP == '' || this.state.empty_hp == true){
            this.setState({empty_hp : true});
        }
        else{
            this.setState({empty_hp : false});
        }
        if (this.state.inputUsername == '' || this.state.empty_username == true){
            this.setState({empty_username : true});
        }
        else{
            this.setState({empty_username : false});
        }
        if (this.state.inputPassword == '' || this.state.empty_password == true){
            this.setState({empty_password : true});
        }
        else{
            this.setState({empty_password : false});
        }
        if (this.state.inputRePassword == '' || this.state.empty_repassword == true){
            this.setState({empty_repassword : true});
        }
        else{
            this.setState({empty_repassword : false});
        }

        if (this.state.inputNamaLengkap == '' || this.state.inputNoKTP == '' ||
            this.state.inputEmail == '' || this.state.inputHP == '' ||
            this.state.inputUsername == '' || this.state.inputPassword == '' ||
            this.state.inputRePassword == ''){
                this.setState({isValidate : false});
        }

        else if (this.state.inputNamaLengkap != '' && this.state.inputNoKTP != '' &&
            this.state.inputEmail != '' && this.state.inputHP != '' &&
            this.state.inputUsername != '' && this.state.inputPassword != '' &&
            this.state.inputRePassword != ''){
                if (this.state.empty_namalengkap == true || this.state.empty_ktp == true ||
                    this.state.empty_email == true || this.state.empty_hp == true || this.state.empty_username == true ||
                    this.state.empty_password == true || this.state.empty_repassword == true){
                        this.setState({isValidate : false});
                    }
        
                else if (this.state.empty_namalengkap == false && this.state.empty_ktp == false &&
                    this.state.empty_email == false && this.state.empty_hp == false && this.state.empty_username == false && 
                    this.state.empty_password == false && this.state.empty_repassword == false){

                        let insertakun = encrypt("INSERT INTO gcm_master_user " +
                        "(nama, no_ktp, email, no_hp, username, password, status, role, company_id, create_by, update_by, update_date, sa_role, sa_divisi, email_verif, no_hp_verif, blacklist_by, id_blacklist, is_blacklist, notes_blacklist) " +
                        "VALUES ('"+this.state.inputNamaLengkap+"'," +
                                "'"+this.state.inputNoKTP+"'," +
                                "'"+this.state.inputEmail+"'," +
                                "'"+this.state.inputHP+"'," +
                                "'"+this.state.inputUsername+"'," +
                                "'"+encrypt(this.state.inputPassword)+"'," +
                                "'"+this.state.inputStatus+"'," +
                                "'"+this.state.inputRole+"'," +
                                "'"+ decrypt(localStorage.getItem('CompanyIDLogin')) +"'," + 
                                "'"+ decrypt(localStorage.getItem('UserIDLogin')) +"','"+decrypt(localStorage.getItem('UserIDLogin')) +
                                "', null, null, null, false, true,null,0,false,'')") 
            
                        Toast.loading('loading . . .', () => {
                        });
                        Axios.post(url.select, {
                                query: insertakun
                            }).then((data) => {
                                Toast.hide();
                                Toast.success('Berhasil menambah akun', 2000, () => {
                                  });
                                this.toggleModalRegister()
                                this.controlConfirmation()
                            }).catch(err => {
                                // console.log("eror : " + err);
                            })          
                }
        }
    }
    
    componentDidMount(){

       if (this.props.data.u_status == 'A'){
        this.setState({get_statususer : 'Aktif'});
       }

       if (this.props.data.role == 'user'){
        this.setState({role_user: 'user'})
       }

       this.setState({  
            inputUsername_edit: this.props.data.username,
            username_tetap_edit: this.props.data.username,
            inputPassword_edit_old: decrypt(this.props.data.password),
            inputEmail_edit: this.props.data.u_email,
            inputHP_edit: this.props.data.no_hp
        });
    }

    render(){
        return(
                <div>
                        <div className="row mt-3">
                            <div className="col-9">
                                <div className="address-card__name">{this.props.data.u_nama}</div>
                            </div>
                            <div className="col-3">
                                <div className="product-card__buttons" style={{marginTop: '0px', float: 'right'}}>
                                    <span data-toggle="tooltip" title="Edit data"><div className="btn btn-light btn-xs " onClick={this.toggleModalEditAkun} ><i class="fas fa-pencil-alt"></i></div></span>
                                </div>
                            </div>
                        </div>    

                        {/* <div className="product-card__buttons" style={{marginTop: '0px'}}>
                            <span data-toggle="tooltip" title="Edit data"> <div className="btn btn-light btn-xs mb-2 mb-md-3" onClick={this.toggleModalEditAkun} ><i class="fas fa-pencil-alt"></i></div></span>
                        </div>
                        <div className="address-card__name">{this.props.data.u_nama}</div> */}
                        <div className="address-card__row">
                            <div className="address-card__row-title">Username</div>
                            <div className="address-card__row-content">{this.props.data.username}</div>
                        </div>
                        <div className="address-card__row">
                            <div className="address-card__row-title">Nomor Identitas (KTP)</div>
                            <div className="address-card__row-content">{this.props.data.no_ktp}</div>
                        </div>
                        <div className="address-card__row">
                            <div className="address-card__row-title">Nomor Handphone</div>
                            <div className="address-card__row-content">{this.props.data.no_hp}</div>
                        </div>
                        <div className="address-card__row">
                            <div className="address-card__row-title">E-mail</div>
                            <div className="address-card__row-content">{this.props.data.u_email}</div>
                        </div>
                        <div className="address-card__row">
                            <div className="address-card__row-title">Role</div>
                            <div className="address-card__row-content">{this.props.data.role}</div>
                        </div>
                        <div className="address-card__row">
                            <div className="address-card__row-title">Status</div>
                            <div className="address-card__row-content">{this.state.get_statususer}
                        </div>
                        </div>

                        {this.props.data.role == 'admin' ?
                            (<div className="product-card__buttons" >
                                {/* <div className="btn btn-primary btn-sm" style={{whiteSpace: 'nowrap'}} onClick={this.toggleModalRegister} >  <span style={{ paddingRight: '5px' }}><i class="fas fa-plus"></i></span>Tambah Akun </div>  */}
                                <div className="btn btn-primary btn-sm" style={{whiteSpace: 'nowrap'}} onClick={this.toggleModalAkun} >  <span style={{ paddingRight: '5px' }}><i class="fas fa-user"></i></span>Lihat Daftar Akun </div>
                            </div>) :
                            (null)
                        }

                        <Dialog
                            maxWidth="xs"
                            open={this.state.openTambahAkunRestrict}
                            aria-labelledby="responsive-dialog-title">
                            <DialogTitle id="responsive-dialog-title">Tambah Akun</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Proses tambah akun hanya dapat dilakukan oleh <strong>admin</strong>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button color="primary" onClick={this.toggleCloseTambahAkun}>
                                    Mengerti
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* <div className="card-body">
                        <div className="row">
                            <div className="col-md-12 "></div> */}

                        <Modal isOpen={this.state.modalEditAkun} centered size="md" backdrop="static" >
                        <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={()=>this.setState({modalEditAkun: false})}>Edit Data Akun</ModalHeader>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12 ">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="alamat-provinsi">Username</label>
                                            <InputGroup>
                                                <Input
                                                    id="alamat-provinsi"
                                                    type="text"
                                                    spellCheck="false"
                                                    autoComplete="off"
                                                    className="form-control"
                                                    maxLength={20}
                                                    invalid={this.state.empty_username_edit}
                                                    onKeyPress={event => this.handleWhitespace(event)}
                                                    onChange={event=>this.Username_validation(event)}
                                                    value={this.state.inputUsername_edit}
                                                />
                                                <FormFeedback>{this.state.KetTextUsername_edit}</FormFeedback>
                                            </InputGroup>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="alamat-provinsi">E-mail</label>
                                            <InputGroup>
                                                <Input
                                                    id="alamat-provinsi"
                                                    type="text"
                                                    spellCheck="false"
                                                    autoComplete="off"
                                                    className="form-control"
                                                    maxLength={50}
                                                    invalid={this.state.empty_email_edit}
                                                    onKeyPress={event => this.handleWhitespace(event)}
                                                    onChange={this.Email_validation} 
                                                    value={this.state.inputEmail_edit}
                                                />
                                                <FormFeedback>{this.state.KetTextEmail_edit}</FormFeedback>
                                            </InputGroup>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="alamat-provinsi">Nomor Handphone</label>
                                            <InputGroup>
                                                <Input
                                                    id="alamat-provinsi"
                                                    type="text"
                                                    spellCheck="false"
                                                    autoComplete="off"
                                                    className="form-control"
                                                    maxLength={20}
                                                    invalid={this.state.empty_hp_edit}
                                                    onKeyPress={event => this.handleWhitespace(event)}
                                                    onChange={event=>this.HP_validation(event)}
                                                    value={this.state.inputHP_edit}
                                                />
                                                <FormFeedback>{this.state.KetTextHP_edit}</FormFeedback>
                                            </InputGroup>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="account-password">Ubah Password <span style={{ fontSize: '10px', fontWeight: '500' }}>(Kosongkan jika password tidak diubah)</span></label>
                                            <InputGroup>
                                                <Input
                                                    id="account-password"
                                                    name="inputPassword"
                                                    type="password"
                                                    spellCheck="false"
                                                    autoComplete="off"
                                                    className="form-control"
                                                    maxLength={50}
                                                    invalid={this.state.empty_password_edit}
                                                    onKeyPress={event => this.handleWhitespace(event)}
                                                    onChange={event=>this.Password_validation_edit(event)}
                                                    value={this.state.inputPassword_edit}
                                                />
                                                <InputGroupAddon addonType="append">
                                                <InputGroupText style={{cursor: 'pointer'}} onClick={this.Password_appear}><i class={this.state.icon_pass} aria-hidden="true" ></i></InputGroupText>
                                                </InputGroupAddon>
                                                <FormFeedback>{this.state.KetTextPassword_edit}</FormFeedback>
                                            </InputGroup>
                                        </div>

                                    </form>
                                </div>
                            </div>      
                            <div className="row">
                                <div className="col-md-12 d-flex">
                                    <button id="btnRegister" type="submit" onClick={this.controlConfirmationEdit.bind(this)} block className="btn btn-primary mt-12 mt-md-3 mt-lg-4">
                                        Simpan
                                </button>
                                </div>
                            </div>
                        </div>
                    </Modal>    

                    <Modal isOpen={this.state.modalOpenRegister} centered size="lg" backdrop="static" >
                    <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={this.toggleModalRegister}>Daftar Akun Baru </ModalHeader>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 d-flex">
                                <div className="card flex-grow-1 mb-md-0">
                                    <div className="card-body">
                                        <h3 className="card-title">Data Pengguna</h3>
                                        <form>

                                            <div className="form-group">
                                                <label htmlFor="pengguna-nama">Nama Lengkap </label>
                                                <InputGroup>
                                                    <Input
                                                        id="pengguna-nama"
                                                        type="text"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        invalid={this.state.empty_namalengkap}
                                                        value={this.state.inputNamaLengkap}
                                                        onChange={event=>this.NamaLengkap_handle(event)} 
                                                    />
                                                    <FormFeedback>{this.state.KetTextNama}</FormFeedback>
                                                </InputGroup>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="pengguna-KTP">Nomor Identitas (KTP) </label>
                                                <InputGroup>
                                                    <Input
                                                        id="pengguna-KTP"
                                                        type="text"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        maxLength={16} 
                                                        invalid={this.state.empty_ktp}
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        onChange={event=>this.KTP_validation(event)} 
                                                        value={this.state.inputNoKTP}
                                                    />
                                                    <FormFeedback>{this.state.KetTextKTP}</FormFeedback>
                                                </InputGroup>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="pengguna-email">E-mail </label>
                                                <InputGroup>
                                                    <Input
                                                        id="pengguna-email"
                                                        type="text"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        invalid={this.state.empty_email}
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        onChange={this.Email_validation} 
                                                        value={this.state.inputEmail}
                                                        name="inputEmail"
                                                    />

                                                    <FormFeedback>{this.state.KetTextEmail}</FormFeedback>
                                                </InputGroup>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="pengguna-hp">Nomor Handphone </label>
                                                <InputGroup>
                                                    <Input
                                                        id="pengguna-hp"
                                                        type="text"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        maxLength={15} 
                                                        invalid={this.state.empty_hp}
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        onChange={event=>this.HP_validation(event)}
                                                        value={this.state.inputHP}
                                                    />
                                                    <FormFeedback>{this.state.KetTextHP}</FormFeedback>
                                                </InputGroup>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 d-flex mt-4 mt-md-0">
                                <div className="card flex-grow-1 mb-0">
                                    <div className="card-body">
                                        <h3 className="card-title">Data Akun</h3>
                                        <form>

                                            <div className="form-group">
                                                <label htmlFor="account-username">Username </label>
                                                <InputGroup>
                                                    <Input
                                                        id="account-username"
                                                        type="text"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        invalid={this.state.empty_username}
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        onChange={event=>this.Username_validation(event)}
                                                        value={this.state.inputUsername}
                                                    />
                                                    <FormFeedback>{this.state.KetTextUsername}</FormFeedback>
                                                </InputGroup>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="account-password">Password </label>
                                                <InputGroup>
                                               
                                                    <Input
                                                        id="account-password"
                                                        name="inputPassword"
                                                        type="password"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        invalid={this.state.empty_password}
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        value={this.state.inputPassword}
                                                        onChange={event=>this.Password_validation(event)}
                                                    />
                                                     <InputGroupAddon addonType="append">
                                                    <InputGroupText style={{cursor: 'pointer'}} onClick={this.Password_appear}><i class={this.state.icon_pass} aria-hidden="true" ></i></InputGroupText>
                                                    </InputGroupAddon>
                                                    <FormFeedback>{this.state.KetTextPassword}</FormFeedback>
                                                </InputGroup>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="account-repassword">Konfirmasi Password</label>
                                                <InputGroup>
                                                    <Input
                                                        id="account-repassword"
                                                        name="inputRePassword"
                                                        type="password"
                                                        spellCheck="false"
                                                        autoComplete="off"
                                                        className="form-control"
                                                        invalid={this.state.empty_repassword}
                                                        onKeyPress={event => this.handleWhitespace(event)}
                                                        value={this.state.inputRePassword}
                                                        onChange={event=>this.Repassword_validation(event)}
                                                    />
                                                    <InputGroupAddon addonType="append">
                                                    <InputGroupText style={{cursor: 'pointer'}} onClick={this.RePassword_appear}><i class={this.state.icon_repass} aria-hidden="true" ></i></InputGroupText>
                                                    </InputGroupAddon>
                                                    <FormFeedback>{this.state.KetTextRePassword}</FormFeedback>
                                                </InputGroup>
                                            </div>
                                        
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 d-flex">
                                <button id="btnRegister" type="submit" block onClick={this.controlConfirmation.bind(this)} className="btn btn-primary mt-12 mt-md-3 mt-lg-4">
                                    Daftar
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={this.state.modalOpenAkun} centered size="xl" backdrop="static" >
                    <ModalHeader className="modalHeaderCustom stickytopmodal" toggle={()=>this.setState({modalOpenAkun: false})}>Daftar Akun</ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="btn btn-primary btn-sm" style={{whiteSpace: 'nowrap', float: 'right'}} onClick={this.toggleModalRegister} >  <span style={{ paddingRight: '5px' }}><i class="fas fa-plus"></i></span>Tambah Akun </div> 
                            </div>
                        </div>
                    </ModalBody>
                    <div className="card-table">
                        <div className="table-responsive-sm">
                            <table>
                                <thead>
                                    <tr style={{ textAlign: 'center' }}>
                                        <th>Nama Lengkap</th>
                                        <th>Username</th>
                                        <th>Nomor Handphone</th>
                                        <th>E-mail</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>

                                {this.state.data_akun.length > 0 ?
                                    (
                                        <div id="shimmerTransaction" style={{ display: 'contents' }}>
                                            {this.state.data_akun.map((value, index) => {
                                                        return (
                                                            <tr>
                                                                <td>{this.state.data_akun[index].nama}</td>
                                                                <td>{this.state.data_akun[index].username}</td>
                                                                <td>{this.state.data_akun[index].no_hp}</td>
                                                                <td>{this.state.data_akun[index].email}</td>
                                                                <td><center>{this.state.data_akun[index].status}</center></td>
                                                            </tr>
                                                        )
                                                    }
                                                )
                                            }
                                        </div>
                                    ) :
                                    (
                                        <div id="shimmerTransaction" style={{ display: 'contents' }}>
                                           <tr>
                                                <td colspan="5"><center>- Tidak Ada Data -</center></td>
                                            </tr>
                                        </div>
                                    )
                                }
                                </tbody>

                            </table>
                        </div>
                    </div>
                </Modal>    

                <Dialog
                    open={this.state.openConfirmation}
                    aria-labelledby="responsive-dialog-title"
                    >
                    <DialogTitle id="responsive-dialog-title">Konfirmasi</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Apakah Anda yakin akan menambahkan akun baru ?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <button className='btn btn-primary' onClick={this.handleSubmit}>
                        Ya
                    </button>
                    <button  className="btn btn-light"  onClick={()=>this.setState({openConfirmation: false})}>
                        Batal
                    </button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.openConfirmationEditAkun}
                    aria-labelledby="responsive-dialog-title"
                    >
                    <DialogTitle id="responsive-dialog-title">Verifikasi</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Inputkan password Anda saat ini ! 
                    </DialogContentText>
                    <InputGroup>
                    <Input
                        id="password-verif"
                        type="password"
                        spellCheck="false"
                        autoComplete="off"
                        className="form-control"
                        maxLength={50}
                        invalid={this.state.empty_password_verif}
                        onChange={event=>this.Password_verif(event)}
                    />   
                    <FormFeedback>{this.state.KetTextPassword_verif}</FormFeedback> 
                    </InputGroup>                  
                    </DialogContent>
                    <DialogActions>
                        <button className='btn btn-primary' onClick={this.submitEditAkun.bind(this)}>
                            OK
                        </button>
                        <button  className="btn btn-light"  onClick={()=>this.setState({openConfirmationEditAkun: false})}>
                            Batal
                        </button>
                    </DialogActions>
                </Dialog>
                <DialogCatch isOpen={this.state.displaycatch} />
          </div>
    )
        

   } 
   

}