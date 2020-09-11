import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, IconButton, Backdrop, Fade, Button, TextField} from '@material-ui/core';
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
  }
}));

export default function AddBizModal({ addBiz }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInput = (e) =>{
    setName(e.target.value)
  }
  const handleCreate = (e) => {
    e.preventDefault()
    axios({
        method: 'POST',
        url: 'http://localhost:5000/api/v1/business/',
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        data: {
          name: name,
        },
    })
    .then(result => {
        // console.log(result.data)
        addBiz(result.data.business)
        setName('')
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
      <strong>Add Business</strong>
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
            <h4 id="transition-modal-title" style={{margin: 5,textAlign:'center'}}>Add Business</h4>
            <form onSubmit={handleCreate} noValidate autoComplete="off">
              <TextField onChange={handleInput} name='name' className={classes.inputStyle} label="Business name" required/>
              <Button size="small" variant="contained" type='submit' color='secondary' className={classes.createButton} >Submit</Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
