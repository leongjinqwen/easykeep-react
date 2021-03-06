import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { amountFormatter,dateFormatter } from '../utils/formatter';

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
  header: {
    color: '#324e7b',
    margin: 1,
    textAlign:'center'
  },
  bold: {
    fontWeight: 900,
    borderTop: '2px solid black',
    borderBottom: '2px solid black',
  }
});

export default function BalSheet({ accounts, assess }) {
  const classes = useStyles();
  
  const renderAccounts = (accs) => (
    accs.map(a=>{
      return(
        <TableRow key={a.account_number}>
          <TableCell component="th" scope="row">{a.account_number} - {a.account_name}</TableCell>
          <TableCell align="right">{amountFormatter.format(a.amount)}</TableCell>
        </TableRow>
      )
    })
  )

  return (
    <>
      <h3 className={classes.header}>
        Balance Sheet Statement As At {assess ? dateFormatter(assess.y_e) : null}
      </h3>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right"><strong>Amount ($)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { accounts ? 
            <>
            {renderAccounts(accounts.f_assets.list)}
            {renderAccounts(accounts.c_assets.list)}
            </> 
            : null }
            <TableRow className={classes.bold}>
              <TableCell component="th" scope="row"><strong>Total ASSETS</strong></TableCell>
              <TableCell align="right"><strong>{amountFormatter.format(accounts.f_assets.total+accounts.c_assets.total)}</strong></TableCell>
            </TableRow>

            { accounts ? 
            <>
            {renderAccounts(accounts.n_c_liabilities.list)}
            {renderAccounts(accounts.c_liabilities.list)}
            </>
             : null }
            <TableRow className={classes.bold}>
              <TableCell component="th" scope="row">Total LIABILITIES</TableCell>
              <TableCell align="right">{amountFormatter.format(-(accounts.n_c_liabilities.total+accounts.c_liabilities.total))}</TableCell>
            </TableRow>

            { accounts ? renderAccounts(accounts.equity.list) : null }
            <TableRow>
              <TableCell component="th" scope="row"><strong>Add : Income & Expenses</strong></TableCell>
              <TableCell align="right">{amountFormatter.format(-(accounts.pl_bal))}</TableCell>
            </TableRow>
            <TableRow className={classes.bold}>
              <TableCell component="th" scope="row">Total Equity</TableCell>
              <TableCell align="right">{amountFormatter.format(-(accounts.equity.total+accounts.pl_bal))}</TableCell>
            </TableRow>

            <TableRow className={classes.bold}>
              <TableCell component="th" scope="row"><strong>Total LIABILITIES & EQUITY</strong></TableCell>
              <TableCell align="right"><strong>{amountFormatter.format(-(accounts.n_c_liabilities.total+accounts.c_liabilities.total+accounts.equity.total+accounts.pl_bal))}</strong></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
