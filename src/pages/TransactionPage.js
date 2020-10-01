import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, IconButton } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditTransactionModal from '../components/EditTransactionModal';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import { amountFormatter } from '../utils/formatter';

const columns = [
  { id: 'date', label: 'Date', minWidth: 75,
    format: (value) => (new Date(value).getDate()+"-"+(new Date(value).getMonth()+ 1)+'-'+new Date(value).getFullYear()),
  },
  { id: 'account', label: 'Account', minWidth: 50 },
  { id: 'account_name', label: 'Account Name', minWidth: 100 },
  { id: 'reference', label: 'Reference', minWidth: 50 },
  { id: 'description', label: 'Description', minWidth: 200 },
  {
    id: 'amount',
    label: 'Amount ($)',
    minWidth: 50,
    align: 'right',
    format: (value) => amountFormatter.format(value),
  },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
    textAlign: 'right'
  },
  container: {
    maxHeight: 500,
  },
});

export default function TransactionPage() {
  const params = useParams();
  const history = useHistory()
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [transactions, setTransactions] = useState([]);
  const [open, setOpen] = useState(false);
  const [tally, setTally] = useState(0);
  const [assess, setAssess] = useState('');
  const [recordDetails, setRecordDetails] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const checkTotalBalance = (records) => {
    let total = 0
    records.forEach(entry=>{
      total += entry.amount
    })
    return (total - 0)
  }
  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/records/${params.assessid}/all`,
    {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
    .then(result => {
      setAssess(result.data.assess)
      setTransactions(result.data.records)
      setTally(checkTotalBalance(result.data.records))
    })
    .catch(error => {
      console.log('ERROR: ', error.response.data)
      toast.error(error.response.data.message)
    })
  }, [open])

  const onOpenModal = (record) => {
    setOpen(true);
    setRecordDetails({
      account: record.account_id,
      reference: record.reference,
      description: record.description,
      amount: record.amount,
      id: record.id,
      date: record.date,
    })
  } 

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <strong>Transactions for Year Assessment {assess} </strong>
      <IconButton onClick={()=>history.push(`/transactions/new/${params.assessid}`)}>
        <AddCircleRoundedIcon style={{color:"#f8f8f8"}} />
      </IconButton>
      <Paper className={classes.root}>
        {
          tally ? 
          <Chip label={`Transactions not balanced. Amount of difference $ ${tally}`} color="secondary" variant="outlined" style={{margin: 5}} />
          : null
        }
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code} key={row.id} onClick={() => onOpenModal(row)}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <EditTransactionModal open={open} handleClose={handleClose} assessId={params.assessid} recordDetails={recordDetails} setRecordDetails={setRecordDetails} />
      </Paper>
    </>
  );
}
