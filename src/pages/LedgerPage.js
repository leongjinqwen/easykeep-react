import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { amountFormatter,dateFormatter } from '../utils/formatter';

const columns = [
  { id: 'date', label: 'Date', minWidth: 75,
    format: (value) => (dateFormatter(value)),
  },
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
  header:{
    textAlign:'center'
  },
  title:{
    margin: '5px auto'
  },
  subtitle:{
    margin: '5px auto'
  },
  total: {
    fontWeight: 900,
    borderTop: '2px solid black',
    borderBottom: '2px solid black' ,
  }
});

export default function LedgerPage() {
  const params = useParams();
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [transactions, setTransactions] = useState([]);
  const [lastPage, setLastPage] = useState(Math.floor(transactions.length/rowsPerPage));
  const [assess, setAssess] = useState('');
  const [account, setAccount] = useState({});
  const [total, setTotal] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    setLastPage(Math.floor(transactions.length/event.target.value))
  };

  const getTotal = (records) => {
    let total = 0
    records.forEach(entry=>{
      total += entry.amount
    })
    return total
  }
  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/records/${params.assessid}/${params.accountid}`,
    {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
    .then(result => {
      setAssess(result.data.assess)
      setAccount(result.data.account)
      setTransactions(result.data.records)
      setTotal(getTotal(result.data.records))
      setLastPage(Math.floor(result.data.records.length/rowsPerPage))
    })
    .catch(error => {
      console.log('ERROR: ', error.response.data)
      toast.error(error.response.data.message)
    })
  }, [])

  return (
    <>
      <div className={classes.header}>
        <h2 className={classes.title}>{account.number} : {account.name} </h2>
        <h3 className={classes.subtitle}> Account Ledger for Year Assessment {assess} </h3>
      </div>
      <Paper className={classes.root}>
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
                  <TableRow role="checkbox" tabIndex={-1} key={row.code} key={row.id} >
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
              {
                lastPage===page ?
                <TableRow >
                  <TableCell className={classes.total} >TOTAL</TableCell>
                  <TableCell className={classes.total} ></TableCell>
                  <TableCell className={classes.total} ></TableCell>
                  <TableCell className={classes.total}  align='right'>{amountFormatter.format(total)}</TableCell>
                </TableRow>
                : null
              }
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
      </Paper>
    </>
  );
}
