import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Backdrop, Fade, Button, TextField, InputLabel, MenuItem, FormControl, Select} from '@material-ui/core';
import { toast } from 'react-toastify';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 3, 3),
    minWidth: 250,
  },
  createButton: {
    backgroundColor:'#324e7b',
    display:'block',
    width:'100%'
  },
  inputStyle: {
    minWidth: 250,
    marginTop: 20,
    marginBottom: 20,
  },
  formControl: {
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function EditTransactionModal({ handleClose, open, assessId, setRecordDetails, recordDetails }) {
  const classes = useStyles();
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/assessment/show/${assessId}`,
    {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
    .then(result => {
      setAccounts(result.data.accounts)
    })
    .catch(error => {
      console.log('ERROR: ', error.response.data)
      toast.error(error.response.data.message)
    })
  }, [])

  const handleInput = (e) =>{
    const {name, value} = e.target
    setRecordDetails({
      ...recordDetails,
      [name]:value
    })
  }

  const handleDateChange = (date) =>{
    setRecordDetails({
      ...recordDetails,
      date: date.toDateString()
    })
  }

  const handleEdit = (e) => {
    e.preventDefault()
    axios({
      method: 'POST',
      url: `http://localhost:5000/api/v1/records/edit/${recordDetails.id}`,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      data: recordDetails,
    })
    .then(result => {
      setRecordDetails({})
      handleClose()
      toast(result.data.message)
    })
    .catch(error => {
      console.log('ERROR: ', error.response.data)
      toast.error(error.response.data.error)
    })
  }
  
  const renderSelectedRecord = (record) => {
    return(
      <form onSubmit={handleEdit} noValidate autoComplete="off">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Transaction Date"
            value={record.date}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        <br />
        <br />
        <FormControl required className={classes.formControl}>
          <InputLabel id="demo-simple-select-required-label">Account</InputLabel>
          <Select
            labelId="demo-simple-select-required-label"
            id="demo-simple-select-required"
            onChange={handleInput} 
            value={record.account}
            name='account'
            className={classes.selectEmpty}
          >
            {
              accounts.map(acc=>{
                return(
                  <MenuItem key={acc.id} value={acc.id}>{acc.acc_num} - {acc.name}</MenuItem>
                )
              })
            }
          </Select>
        </FormControl>
        <br />
        <TextField onChange={handleInput} name='reference' className={classes.inputStyle} label="Reference" value={record.reference} required/>
        <br />
        <TextField onChange={handleInput} name='description' className={classes.inputStyle} label="Description" value={record.description} required/>
        <br />
        <TextField onChange={handleInput} name='amount' className={classes.inputStyle} label="Amount" value={record.amount} required/>
        <br />
        <Button size="small" variant="contained" type='submit' color='secondary' className={classes.createButton} >Edit</Button>
      </form>
    )
  }
  
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h4 id="transition-modal-title" style={{margin: 5,textAlign:'center'}}>Edit Transaction</h4>
            {renderSelectedRecord(recordDetails)}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
