import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { amountFormatter } from '../utils/formatter';

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
  header: {
    color: '#324e7b',
    margin: 1,
    textAlign:'center'
  }
});

export default function TrialBal({ accounts, assess }) {
  const classes = useStyles();
  const [balances, setBalances] = useState({ debit: 0, credit: 0 })
  
  useEffect(() => {
    if (accounts){
      accounts.sort(function(a,b){
        if (a.account_type < b.account_type) return -1
        if (a.account_type > b.account_type) return 1
        return 0
      })
      let debit = 0
      let credit = 0
      accounts.forEach(acc=>{
        if (acc.amount > 0){
          debit += acc.amount
        } else {
          credit += acc.amount
        }
      })
      setBalances({...balances, debit: debit, credit: credit})
    }
  }, [accounts])
  return (
    <>
      <h3 className={classes.header}>
        Trial Balance As At {assess ? new Date(assess.y_e).getDate()+"-"+(new Date(assess.y_e).getMonth()+ 1)+'-'+new Date(assess.y_e).getFullYear() : null}
      </h3>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Account number</strong></TableCell>
              <TableCell align="center"><strong>Type</strong></TableCell>
              <TableCell><strong>Account Name</strong></TableCell>
              <TableCell align="right"><strong>Debit ($)</strong></TableCell>
              <TableCell align="right"><strong>Credit ($)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts ? (accounts.map((acc) => (
              <TableRow key={acc.account_number}>
                <TableCell component="th" scope="row">
                  {acc.account_number}
                </TableCell>
                <TableCell align="center">{acc.account_type}</TableCell>
                <TableCell>{acc.account_name}</TableCell>
                {
                  acc.amount > 0 ? 
                  <>
                    <TableCell align="right">{amountFormatter.format(acc.amount)}</TableCell>
                    <TableCell align="right"></TableCell>
                  </>
                  :
                  <>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right">{amountFormatter.format(-acc.amount)}</TableCell>
                  </>
                }
              </TableRow>
            ))) : null}
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell align="right"><strong>{amountFormatter.format(balances.debit)}</strong></TableCell>
                <TableCell align="right"><strong>{amountFormatter.format(-balances.credit)}</strong></TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
