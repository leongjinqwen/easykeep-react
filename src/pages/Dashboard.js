import React from 'react';
import Bar from '../components/BarChart';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Bar />
        </Grid>
      </Grid>
    </div>
    )
}
export default Dashboard;