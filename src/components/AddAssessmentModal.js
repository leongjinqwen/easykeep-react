import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Backdrop, Fade, Button} from '@material-ui/core';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
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
  }
}));

export default function AddAssessmentModal({ business, addAssess }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (date) =>{
    setSelectedDate(date)
  }
  const handleCreate = (e) => {
    e.preventDefault()
    axios({
        method: 'POST',
        url: `http://localhost:5000/api/v1/assessment/${business.id}`,
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        data: {
          y_a: selectedDate.getFullYear(),
          y_e: selectedDate,
        },
    })
    .then(result => {
        // console.log(result.data)
        addAssess(result.data.assessment)
        setSelectedDate(new Date())
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
      <Button size='small' onClick={handleOpen} color="secondary" startIcon={<AddCircleRoundedIcon />}>
        Add Assessment
      </Button>
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
            <h4 id="transition-modal-title" style={{margin: 5,textAlign:'center'}}>Create Assessment</h4>
            <form onSubmit={handleCreate} noValidate autoComplete="off">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date picker inline"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
              <Button size="small" variant="contained" type='submit' color='secondary' className={classes.createButton} >Submit</Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
