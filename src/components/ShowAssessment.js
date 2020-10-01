import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, Divider } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FolderIcon from '@material-ui/icons/Folder';
import AddAssessmentModal from './AddAssessmentModal';
import { useHistory } from "react-router-dom"
import { dateFormatter } from '../utils/formatter';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function ShowAssessment({business}) {
  const classes = useStyles();
  const history = useHistory();
  const [ assessments, setAssessments ] = useState([])

  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/assessment/${business.id}`,
    {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
    .then(result => {
      setAssessments(result.data.assessments)
    })
    .catch(error => {
      console.log('ERROR: ', error)
    })
  }, [])

  const addAssess = (item) => {
    setAssessments([...assessments, item])
  }
  const selectAssess = (id) => {
    localStorage.setItem('assess', id)
    history.push(`/assessments/${id}`)
  }
  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{business.name}</Typography>
        </AccordionSummary>
          {
            assessments.map(a =>{
              return (
                <AccordionDetails key={`assess-${a.id}`} >
                  {/* link to each assessment page (simple edit card) */}
                  <Button color='primary' startIcon={<FolderIcon />} onClick={()=>selectAssess(a.id)} >
                    {dateFormatter(a.y_e)} 
                  </Button>
                </AccordionDetails>
              )
            })
          }
          <Divider />
          <AccordionDetails>
            <AddAssessmentModal business={business} addAssess={addAssess} />
          </AccordionDetails>
      </Accordion>
    </div>
  );
}
