import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import { useParams,useHistory } from "react-router-dom"
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText, ListSubheader } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 400,
    overflow:'auto',
    backgroundColor: theme.palette.background.paper,
  },
}));

function renderRow(data) {
  return (data.map((item,index)=>{
    return (
      <ListItem button key={index} style={{color:'black'}}>
        <ListItemText primary={`Item ${item}`} />
      </ListItem>
    );
  }))
}


export default function VirtualizedList() {
  const classes = useStyles();
  const params = useParams()
  const history = useHistory()

  const [records, setRecords] = useState([])

  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/records/${params.assessid}`,
    {
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
    })
    .then(result => {
    console.log(result.data)
    //   setAssess(result.data.assessment)
    let data = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
      setRecords(data)
    })
    .catch(error => {
    console.log('ERROR: ', error.response.data)
    toast.error(error.response.data.message)
    })
  }, [])
  
  return (
    <div className={classes.root}>
      <ListSubheader>Headers</ListSubheader>
      {renderRow(records)}
    </div>
  );
}
