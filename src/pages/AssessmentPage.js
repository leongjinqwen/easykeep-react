import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useHistory } from "react-router-dom"
import { toast } from 'react-toastify';
import { Typography, Card, Button, IconButton, CardActions, CardContent, List, ListItem, ListItemText, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ViewListRounded, AddCircleRounded } from '@material-ui/icons';
import AddAccountModal from '../components/AddAccountModal';
import { dateFormatter } from '../utils/formatter';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
    fontWeight:600
  },
  pos: {
    marginBottom: 12,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
    color: '#373f49',
    borderRadius: 5
  },
  container: {
    flexGrow: 1,
    display:'flex',
  }
}));

const AssessmentPage = () => {
  const params = useParams()
  const history = useHistory()
  const classes = useStyles();

  const [assess, setAssess] = useState({})
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/assessment/show/${params.assessid}`,
    {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
    .then(result => {
      setAssess(result.data.assessment)
      setAccounts(result.data.accounts)
    })
    .catch(error => {
      console.log('ERROR: ', error.response.data)
      toast.error(error.response.data.message)
    })
  }, [])

  const addAccount = (item) => {
    setAccounts([...accounts,item])
  }
  return (
    <>
      <div className={classes.container}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <p>
              <strong>ASSESSMENT</strong>
            </p>
            <Card className={classes.root}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  {assess.business} : Y/A {assess.y_a}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  Year Ended : {dateFormatter(assess.y_e)} 
                </Typography>
                <Typography variant="body2" component="p">
                  {/* transaction page to list out all record */}
                  <Button color='primary' startIcon={<ViewListRounded />} onClick={()=>history.push(`/transactions/${assess.id}`)} >
                    Transactions
                  </Button>
                  <IconButton onClick={()=>history.push(`/transactions/new/${assess.id}`)}>
                    <AddCircleRounded color='primary' />
                  </IconButton>
                </Typography>
              </CardContent>
              <CardActions>
                {/* open modal to edit assessment info */}
                <Button size="small">Edit</Button>
              </CardActions>
            </Card> 
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* need interface for editing account info */}
            <AddAccountModal addAccount={addAccount} businessId={assess.business_id} />
            <List className={classes.demo}>
            {
              accounts.map(acc=>{
                return (
                  <ListItem button key={acc.id} onClick={()=>history.push(`/transactions/${localStorage.assess}/${acc.id}`)}>
                    <ListItemText
                      primary={`${acc.acc_num} : ${acc.name}`}
                    />
                  </ListItem>
                )
              })
            }
            </List>
          </Grid>
        </Grid>
      </div>
    </>
    )
}
export default AssessmentPage;