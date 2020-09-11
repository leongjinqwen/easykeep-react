import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, IconButton, Backdrop, Fade, Button, TextField, InputLabel, MenuItem, FormHelperText, FormControl, Select} from '@material-ui/core';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import { toast } from 'react-toastify';

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

export default function AddAccountModal({ addAccount,businessId }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [accDetails, setAccDetails] = useState({
    name: '',
    acc_type: 8,
    acc_num: '',
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInput = (e) =>{
    const {name, value} = e.target
    setAccDetails({
      ...accDetails,
      [name]:value
    })
  }
  const handleCreate = (e) => {
    e.preventDefault()
    axios({
        method: 'POST',
        url: `http://localhost:5000/api/v1/accounts/${businessId}`,
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        data: accDetails,
    })
    .then(result => {
        console.log(result.data)
        addAccount(result.data.account)
        setAccDetails({
          name: '',
          acc_type: 8,
          acc_num: '',
        })
        setOpen(false)
        toast(result.data.message)
    })
    .catch(error => {
      console.log('ERROR: ', error.response.data)
      toast.error(error.response.data.error)
    })
  }
  return (
    <div>
      <strong>ACCOUNTS</strong>
      <IconButton onClick={handleOpen}>
        <AddCircleRoundedIcon style={{color:"#f8f8f8"}} />
      </IconButton>
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
            <h4 id="transition-modal-title" style={{margin: 5,textAlign:'center'}}>Add Account</h4>
            <form onSubmit={handleCreate} noValidate autoComplete="off">
              <FormControl required className={classes.formControl}>
                <InputLabel id="demo-simple-select-required-label">A/c Type</InputLabel>
                <Select
                  labelId="demo-simple-select-required-label"
                  id="demo-simple-select-required"
                  onChange={handleInput} 
                  value={accDetails.acc_type}
                  name='acc_type'
                  className={classes.selectEmpty}
                >
                  <MenuItem value={0}>Equity</MenuItem>
                  <MenuItem value={1}>Fixed Assets</MenuItem>
                  <MenuItem value={2}>Current Assets</MenuItem>
                  <MenuItem value={3}>Non Current Liabilities</MenuItem>
                  <MenuItem value={4}>Current Liabilities</MenuItem>
                  <MenuItem value={5}>Sales</MenuItem>
                  <MenuItem value={6}>Other Incomes</MenuItem>
                  <MenuItem value={7}>Purchases</MenuItem>
                  <MenuItem value={8}>Expenses</MenuItem>
                </Select>
                <FormHelperText>Required</FormHelperText>
              </FormControl>
              <br />
              <TextField onChange={handleInput} name='acc_num' className={classes.inputStyle} label="Account number" required/>
              <br />
              <TextField onChange={handleInput} name='name' className={classes.inputStyle} label="Account name" required/>
              <br />
              <Button size="small" variant="contained" type='submit' color='secondary' className={classes.createButton} >Submit</Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
