import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';

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
          <TableCell align="right">{(-a.amount).toFixed(2)}</TableCell>
        </TableRow>
      )
    })
  )

  return (
    <>
      <h3 className={classes.header}>
        Profit & Loss Statement for the Y/E {assess ? new Date(assess.y_e).getDate()+"-"+(new Date(assess.y_e).getMonth()+ 1)+'-'+new Date(assess.y_e).getFullYear() : null}
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
            { accounts ? renderAccounts(accounts.sales.list) : null }
            { accounts ? renderAccounts(accounts.incomes.list) : null }
            { accounts ? renderAccounts(accounts.purchases.list) : null }
            <TableRow className={classes.bold}>
              <TableCell component="th" scope="row">Gross PROFIT/-LOSS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">{(-(accounts.sales.total+accounts.incomes.total)-accounts.purchases.total).toFixed(2)}</TableCell>
            </TableRow>
            { accounts ? renderAccounts(accounts.expenses.list) : null }
            <TableRow className={classes.bold}>
              <TableCell component="th" scope="row">Net PROFIT/-LOSS</TableCell>
              <TableCell></TableCell>
              <TableCell align="right">{(-(accounts.sales.total+accounts.incomes.total)-accounts.purchases.total-accounts.expenses.total).toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
