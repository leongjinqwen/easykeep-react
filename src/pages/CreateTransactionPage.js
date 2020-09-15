import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Typography, Button } from '@material-ui/core';
import MaterialTable from 'material-table';
import { Search, ViewColumn, SaveAlt, ChevronLeft, ChevronRight, FirstPage, LastPage, Check, FilterList, Remove, Edit, Delete, AddCircle, Clear, Save, SortByAlpha } from "@material-ui/icons"
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(3, 3, 3),
    minWidth: 250,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius : 5
  },
}));

export default function CreateTransactionPage() {
  const params = useParams()
  const classes = useStyles();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [accounts, setAccounts] = useState({})
  const [state, setState] = useState({});
  
  const handleCreate = () => {
    if (checkBalance()) {
      axios({
          method: 'POST',
          url: `http://localhost:5000/api/v1/records/${params.assessid}`,
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
          },
          data: {
            date: selectedDate,
            transactions: state.data
          },
      })
      .then(result => {
        setState({ data: [] })
        toast(result.data.message)
      })
      .catch(error => {
        console.log('ERROR: ', error.response.data)
        toast.error(error.response.data.error)
      })
    }
    else {
      toast("Accounts are not balanced. Please check again.")
    }
  }
  const checkBalance = () => {
    let total = 0
    state.data.forEach(entry=>{
      total += entry.amount
    })
    return true ? total === 0 : false
  }
  const handleDateChange = (date) =>{
    setSelectedDate(date.toDateString())
  }
  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/assessment/show/${params.assessid}`,
    {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
    .then(result => {
      let obj = {}
      result.data.accounts.forEach(acc=>{
        obj = {
          ...obj, 
          [acc.id] : acc.name
        }
      })
      setAccounts(obj)
      setState({
        data: []
      })
    })
    .catch(error => {
      console.log('ERROR: ', error.response.data)
      toast.error(error.response.data.message)
    })
  }, [])
  
  return (
    <div className={classes.root}>
      <div className={classes.paper}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Transaction Date"
            value={selectedDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        <Typography variant="body2" component="p">
          <Button color='secondary' variant="contained" startIcon={<Save />} onClick={handleCreate} >
            Save
          </Button>
        </Typography>
      </div>
      <MaterialTable
        title="Transaction Entries"
        columns={[
          { title: 'Doc. Ref', field: 'reference' },
          {
            title: 'Account',
            field: 'account',
            lookup: accounts,
          },
          { title: 'Description', field: 'description' },
          { title: 'Amount', field: 'amount', type: 'numeric' },
        ]}
        data={state.data}
        icons={{
          Check: () => <Check />,
          Export: () => <SaveAlt />,
          Filter: () => <FilterList />,
          FirstPage: () => <FirstPage />,
          LastPage: () => <LastPage />,
          NextPage: () => <ChevronRight />,
          PreviousPage: () => <ChevronLeft />,
          Search: () => <Search />,
          ThirdStateCheck: () => <Remove />,
          ViewColumn: () => <ViewColumn />,
          DetailPanel: () => <ChevronRight />,
          Edit: () => <Edit color='disabled' fontSize="small" />,
          Delete: () => <Delete color='disabled' fontSize="small" />,
          Add: () => <AddCircle color='disabled' fontSize="small" />,
          Clear: () => <Clear color='disabled' fontSize="small" />,
          ResetSearch: () => <Clear color='disabled' fontSize="small" />,
          SortArrow: () => <SortByAlpha color='disabled' fontSize="small" />,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                setState((prevState) => {
                  const data = [...prevState.data];
                  data.push(newData);
                  return { ...prevState, data };
                });
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                if (oldData) {
                  setState((prevState) => {
                    const data = [...prevState.data];
                    data[data.indexOf(oldData)] = newData;
                    return { ...prevState, data };
                  });
                }
              }, 600);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                setState((prevState) => {
                  const data = [...prevState.data];
                  data.splice(data.indexOf(oldData), 1);
                  return { ...prevState, data };
                });
              }, 600);
            }),
        }}
      />
    </div>
  );
}
