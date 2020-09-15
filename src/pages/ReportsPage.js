import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab, Box } from '@material-ui/core';
import TrialBal from '../components/TrialBal';
import ProfitLossAcc from '../components/ProfitLossAcc';
import BalSheet from '../components/BalSheet';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ReportsPage() {
  const classes = useStyles();

  const [value, setValue] = useState(0);
  const [data, setData] = useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/records/reports/${localStorage.getItem('assess')}`,
    {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
    .then(result => {
      console.log(result.data)
      setData(result.data)
    })
    .catch(error => {
      console.log('ERROR: ', error)
    })
  }, [])

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Trial Balance" {...a11yProps(0)} />
          <Tab label="Balance Sheet" {...a11yProps(1)} />
          <Tab label="Profit & Loss" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <TrialBal accounts={data.tb} assess={data.assessment}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <BalSheet accounts={data.bs} assess={data.assessment}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <ProfitLossAcc accounts={data.pl} assess={data.assessment}/>
      </TabPanel>
    </div>
  );
}
