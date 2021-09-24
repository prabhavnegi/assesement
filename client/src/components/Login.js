import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router';
import {Grid, Typography, Button,makeStyles, TextField} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import './Login.css'
import { userContext } from '../UserProvider';


export const Login = () => {
    const {setLogState} = useContext(userContext)
    const useStyles = makeStyles(() =>({
        mainBox : {
            height : '100vh',
            backgroundColor :'#a7bbc7',
        },
        button : {
            margin : '20px 0',
            width : '30%',
            fontSize : '1em',
            padding :'5px 20px'
        },
        title : {
            fontWeight : '400',
            margin: '0 0 10px'
        },
        input : {
            width : '80%',
            fontSize: '2em',
            margin: '5px 0 0',
        }


    }))
    const [email, setEmail] = useState('')
    const [pwd, setpwd] = useState('')
    const [error, setError] = useState('')
    const classes = useStyles()
    const history = useHistory()

    const setForm = (e) => {
        if (e.target.name === 'email')
            setEmail(e.target.value)
        else if (e.target.name === 'pwd')
            setpwd(e.target.value)
    }    
    const formHandler = async (e) => {
        e.preventDefault();
        try {
            if(email === '' || pwd === '') {
                setError('Fields are empty')
                return
            }
            const log = await axios.post('/login',{email, pwd})
            localStorage.setItem('biscuit',JSON.stringify(log.data))
            setLogState(true)
        }
        catch(err) {
            setError(err.response?err.response.data:err.message)
        }
    }

    return (
        <Grid container justify="center" direction="row" alignItems="center" className={classes.mainBox}>
            <Grid item lg={4} sm={8} md={6} xs={12}>
                <form className="box" onSubmit={formHandler}>
                    <Typography className={classes.title} variant="h2">Login</Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField name="email" className={classes.input} type="email" placeholder="email" onChange={setForm} value={email} />
                    <TextField name="pwd" className={classes.input} type="password" placeholder="password" onChange={setForm} value={pwd} />
                    <div className="buttonDiv">
                        <Button className={classes.button} color="primary" variant="contained" type="submit" onSubmit={formHandler} >Log In</Button>
                        <Button className={classes.button} color="secondary" variant="contained" type="button" onClick={()=>{history.push('/signup')}}>Sign Up</Button>
                    </div>
                </form>
            </Grid>
        </Grid>
    )
}