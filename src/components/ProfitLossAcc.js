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

export default function ProfitLossAcc({ accounts, assess }) {
  const classes = useStyles();
  
  const renderAccounts = (accs) => (
    accs.map(a=>{
      return(
        <TableRow key={a.account_number}>
          <TableCell component="th" scope="row">{a.account_number}</TableCell>
          <TableCell>{a.account_name}</TableCell>
          <TableCell align="right">{amountFormatter.format(-a.amount)}</TableCell>
        </TableRow>
      )
    })
  )

  return (
    <>
      <h3 className={classes.header}>
        Profit & Loss Statement for the Y/E {assess ? dateFormatter(assess.y_e) : null}
      </h3>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="right"><strong>Amount ($)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { accounts ? 
            <>
            {renderAccounts(accounts.sales.list)} 
            {renderAccounts(accounts.incomes.list)}
            {renderAccounts(accounts.purchases.list)}
            </>
            : null }
            <TableRow className={classes.bold}>
              <TableCell component="th" scope="row">Gross PROFIT/-LOSS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">{amountFormatter.format(-(accounts.sales.total+accounts.incomes.total)-accounts.purchases.total)}</TableCell>
            </TableRow>
            { accounts ? renderAccounts(accounts.expenses.list) : null }
            <TableRow className={classes.bold}>
              <TableCell component="th" scope="row"><strong>Net PROFIT/-LOSS</strong></TableCell>
              <TableCell></TableCell>
              <TableCell align="right"><strong>{amountFormatter.format(-(accounts.sales.total+accounts.incomes.total)-accounts.purchases.total-accounts.expenses.total)}</strong></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
