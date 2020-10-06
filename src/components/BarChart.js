import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { Chart, ArgumentAxis, ValueAxis, BarSeries, Title, Legend } from '@devexpress/dx-react-chart-material-ui';
import { withStyles } from '@material-ui/core/styles';
import { Stack, Animation } from '@devexpress/dx-react-chart';
import axios from 'axios'

const legendStyles = () => ({
  root: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row',
  },
});
const legendLabelStyles = theme => ({
  label: {
    paddingTop: theme.spacing(1),
    whiteSpace: 'nowrap',
  },
});


const legendRootBase = ({ classes, ...restProps }) => (
  <Legend.Root {...restProps} className={classes.root} />
);
const legendLabelBase = ({ classes, ...restProps }) => (
  <Legend.Label className={classes.label} {...restProps} />
);

const Root = withStyles(legendStyles, { name: 'LegendRoot' })(legendRootBase);
const Label = withStyles(legendLabelStyles, { name: 'LegendLabel' })(legendLabelBase);

const titleStyles = {
  title: {
    whiteSpace: 'pre',
  },
};
const TitleText = withStyles(titleStyles)(({ classes, ...props }) => (
  <Title.Text {...props} className={classes.title} />
));

function BarChart (){
  const [data, setData] = useState([])
  const [assess, setAssess] = useState("")

  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/records/charts/${localStorage.assess}`,
    {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
    .then(result => {
      setAssess(result.data.assess)
      setData(result.data.list)
    })
    .catch(error => {
      console.log('ERROR: ', error.response.data)
    })
  }, [])
  return (
    <Paper>
      <Chart
        data={data}
      >
        <ArgumentAxis />
        <ValueAxis />

        <BarSeries
          name="Revenue"
          valueField="revenue"
          argumentField="month"
        />
        <BarSeries
          name="COGS & Expenses"
          valueField="exp"
          argumentField="month"
        />
        <BarSeries
          name="Profit"
          valueField="np"
          argumentField="month"
        />

        <Animation />
        <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
        <Title
          text={`Monthly Profit and Loss for YA ${assess}`}
          textComponent={TitleText}
        />
        <Stack />
      </Chart>
    </Paper>
  );
}

export default BarChart;