import React, { useState, useContext } from 'react';
import {Grid, Typography, Button,makeStyles, TextField} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useHistory} from 'react-router';
import axios from 'axios';
import {userContext} from '../UserProvider';
export const SignUp = () => {

    const {setLogState} = useContext(userContext)

    const useStyles = makeStyles(() =>({
        main : {
            height : '100vh',
            backgroundColor :'#a7bbc7',
        },
        grid : {
            border: '20px',
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
            margin: '5px 0'
        }

    }))
    const [email, setEmail] = useState('')
    const [pwd, setpwd] = useState('')
    const [Cpwd, setCpwd] = useState('')
    const [address, setAddress] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const classes = useStyles()
    const history = useHistory()
    const setForm = (e) => {
        if (e.target.name === 'email')
            setEmail(e.target.value)
        else if (e.target.name === 'pwd')
            setpwd(e.target.value)
        else if (e.target.name === 'Cpwd')
            setCpwd(e.target.value)    
        else if (e.target.name === 'username')
            setUsername(e.target.value)
        else if (e.target.name === 'address')
            setAddress(e.target.value)
    }    
    const formHandler = async (e) => {
        e.preventDefault();
        try {
            if(email === '' || pwd === '' || Cpwd === '' || address === '' || username === '') {
                setError('Form is incomplete','Form is in incomplete')
                return
            }
            if(pwd !== Cpwd) {
                setError("Passwords didn't match")
                return
            }
            const log = await axios.post('/signUp',{email, pwd, address, username})
            localStorage.setItem('biscuit',JSON.stringify(log.data))
            setLogState(true)
        }
        catch(err) {
            setError(err.response.data)
        }
    }

    return (
        <Grid container justify="center" direction="row" alignItems="center" className={classes.main}>
            <Grid className={classes.grid} item lg={4} sm={8} md={6} xs={12}>
            <form className="Signupbox" onSubmit={formHandler}> 
                    <Typography className={classes.title} variant="h2">SignUp</Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField name="email" className={classes.input} type="email" placeholder="email" onChange={setForm} value={email} />
                    <TextField name="username" className={classes.input} type="username" placeholder="username" onChange={setForm} value={username} />
                    <TextField name="address" className={classes.input} type="address" placeholder="address" onChange={setForm} value={address} />
                    <TextField name="pwd" className={classes.input} type="password" placeholder="password" onChange={setForm} value={pwd} />
                    <TextField name="Cpwd" className={classes.input} type="password" placeholder="confirm password" onChange={setForm} value={Cpwd} />
                    <div className="buttonDiv">
                        <Button className={classes.button} color="secondary" variant="contained" type="button" onClick={()=>{history.push('/')}}>Log In</Button>
                        <Button className={classes.button} color="primary" variant="contained" type="submit" onSubmit={formHandler} >SignUp</Button>
                    </div>
            </form>
            </Grid>
        </Grid>
    )
}