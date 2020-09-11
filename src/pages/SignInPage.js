import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import { useHistory } from "react-router-dom"
import { TextField,Card,CardActions,CardContent,Button,Grid } from '@material-ui/core';
import { LockRounded, AccountCircle } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    minWidth: 375,
    position: 'absolute', /*Can also be `fixed`*/
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  },
  inputContainer: {
    width: '100%',
    justifyContent:'center',
    border: '#324e7b'
  },
  inputStyle: {
    width: '100%',
  },
  formStyles: {
    padding: '10px',
  },
  formTitle: {
    fontFamily: 'Montserrat',
    fontSize:'1.5rem',
    fontWeight:700,
    marginBottom:'0.5rem'
  },
  signup: {
    backgroundColor:'#324e7b',
    display:'block',
    width:'100%'
  }
}));

const SignInPage = ({setCurrentUser}) => {
  const [ details, setDetails ] = useState({
    username: '',
    password: '',
  })
  const classes = useStyles();
  const history = useHistory()

  const handleSignIn = (e) => {
    e.preventDefault()
    axios({
        method: 'POST',
        url: 'http://localhost:5000/api/v1/login',
        data: {
          username: details.username,
          password: details.password
        }
    })
    .then(result => {
        console.log(result.data)
        setDetails({
          username: '',
          password: '',
        })
        setCurrentUser(result.data.user)
        localStorage.setItem('token',result.data.auth_token)
        localStorage.setItem('user',JSON.stringify(result.data.user))
        toast(result.data.message)
        history.push(`/users/${result.data.user.id}`)
    })
    .catch(error => {
      console.log('ERROR: ', error.response.data)
      toast.error(error.response.data.error)
    })
  }

  const handleInput = (e) =>{
    const {name, value} = e.target
    setDetails({
      ...details,
      [name]:value
    })
  }

  return (
    <>  
      <Card className={classes.root} >
        <h4 className={classes.formTitle}>Sign In</h4>
        <form onSubmit={handleSignIn}className={classes.formStyles} noValidate autoComplete="off">
          <CardContent>
            <Grid container spacing={1} alignItems="flex-end" className={classes.inputContainer}>
              <Grid item>
                <AccountCircle />
              </Grid>
              <Grid item style={{width:'75%'}}>
                <TextField onChange={handleInput} name='username' className={classes.inputStyle} label="Username" required/>
              </Grid>
            </Grid>
            <Grid container spacing={1} alignItems="flex-end" className={classes.inputContainer}>
              <Grid item>
                <LockRounded />
              </Grid>
              <Grid item style={{width:'75%'}}>
                <TextField onChange={handleInput} name='password' className={classes.inputStyle} label="Password" type="password" required />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button size="small" variant="contained" type='submit' color='secondary' className={classes.signup}>Submit</Button>
            <Button size="small" variant="contained" onClick={()=>history.push('/signup')} color='secondary' className={classes.signup}>Sign Up Now!</Button>
          </CardActions>
        </form>
      </Card>
      
    </>
    )
}
export default SignInPage;