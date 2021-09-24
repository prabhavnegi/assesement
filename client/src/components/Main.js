import React, {useContext, useEffect, useState,useRef} from 'react';
import {userContext} from '../UserProvider';
import axios from 'axios';
import {Grid, AppBar, Typography, Button, Toolbar, makeStyles,Table, TableHead, TableRow, TableCell, TableBody, Modal} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

export const Main = () => {

    const useStyles = makeStyles(()=> ({
        title : {
            flexGrow: 1,
        },
        main : {
            margin: '20px 0',
        },
        nav : {
            backgroundColor : '#112d4e',
        },
        modal : {
            display : 'flex',
            flexDirection : 'row',
            justifyContent : 'center',
            alignItems : 'center',
        }
    }))
    const classes = useStyles()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const {user,setLogState} = useContext(userContext)
    const [open,setOpen] = useState(false)
    const [userData, setUserData] = useState({})
    const [userUsername, setUserUsername] = useState('')
    const [userAddress, setUserAddress] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [success, setSuccess] = useState('')
    const [updateError,setUpdateError] = useState('')
    const [flag, setFlag] = useState(false)
    const [file, setFile] = useState(null)
    const [fileName, setFileName] = useState("")
    const [openUpload,setUploadOpen] = useState(false)
    const [preview, setPreview] = useState("")
    const [userFiles, setUserFiles] = useState([])
    const uploadRef = useRef()


    const getTable = async () => {
        var token = localStorage.getItem('biscuit')
        token = JSON.parse(token)
            let config = {
                headers: {
                  'Authorization': 'Bearer ' + token.token
                }
              }
        try {
            const response = await axios.get('/data',config)
            console.log(response.data)
            setData([response.data.userData])
            setUserData(response.data.userData)
            setUserFiles(response.data.files)
        }
        catch (err) {
            setError(err.response.data)
        }
        setLoading(false)
    } 

    const handleClose = () => {
        setOpen(false)
        setUploadOpen(false)
    }

    const handleUploadClose = () => {
        setFile(null)
        setPreview("")
        setFileName("")
        setUploadOpen(false)
    }

    const setDetails = (e) => {
        if (e.target.name === 'username')
            setUserUsername(e.target.value)
        else if(e.target.name === 'address')
            setUserAddress(e.target.value)
        else
            setUserPassword(e.target.value)
    }

    const changeDetails = async () => {
        if(userAddress === '' && userPassword === '' && userUsername === '') {
            setUpdateError("No changes made")
            return 
        }
        setFlag(true)
        setUpdateError('')
        setSuccess('')
        var token = localStorage.getItem('biscuit')
        token = JSON.parse(token)
            let config = {
                headers: {
                  'Authorization': 'Bearer ' + token.token,
                }
              }
        try {
            await axios.post('/changeDetails', {userAddress, userPassword, userUsername},config)
            setSuccess('Update Successful')
            getTable()
        }   
        catch (error) {
            setUpdateError(error.response.data)
        }
        setFlag(false)
    }

     // Upload functions

     const uploadHandler = (e) => {
        setFile(e.target.files[0])
        setFileName(e.target.files[0].name)
        setPreview(URL.createObjectURL(e.target.files[0]))
        // if()
    }
    
    const uploadToServer = async () => {
        var token = localStorage.getItem('biscuit')
        token = JSON.parse(token)
        let config = {
            headers: {
            'Authorization': 'Bearer ' + token.token,
            'Content-Type': 'multipart/form-data',
            }
        }
        let formData = new FormData();
        formData.append('file', file);
        formData.append('filename', fileName)
        setFlag(true)
        setUpdateError('')
        setSuccess('')
        try {
            const res = await axios.post('/upload',formData,config)
            setSuccess('Upload Successful')
            getTable()
            console.log(res)
        }
        catch (error) {
            setUpdateError(error.response.data)
        }
        setFlag(false)
    }

    const editUser = (
        <div style={{borderRadius:'20px',position:'relative',width:'40vw',height:'40vh',padding:'40px 20px',backgroundColor:'white',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <h1>Edit your details</h1>
            {updateError && <Alert severity="error" >{updateError}</Alert>}
            {success && <Alert>{success}</Alert>}
            <input name='username' style={{fontSize:'1.3em',width:'80%',margin:'10px',padding:'20px 30px'}} type="text" onChange={setDetails} placeholder={userData.username} value={userUsername}/>
            <input  name='address' style={{fontSize:'1.3em',width:'80%',margin:'10px',padding:'22px 30px'}} type="text" onChange={setDetails} placeholder={userData.address} value={userAddress}/>
            <input name='password' style={{fontSize:'1.3em',width:'80%',margin:'10px',padding:'22px 30px'}} type="text" onChange={setDetails} placeholder="enter your new password" value={userPassword}/>
            <Button  style={{margin:'20px 0'}} variant="contained" color="primary" onClick={changeDetails} >Change</Button>
        </div>
    )

    const uploadFile = (
        <div style={{borderRadius:'20px',position:'relative',width:'40vw',height:'40vh',padding:'40px 20px',backgroundColor:'white',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <h1>Upload your file</h1>
        <img style={{width:"40%",margin:"10px"}} src={preview} alt=""/>
        {updateError && <Alert severity="error" >{updateError}</Alert>}
        {success && <Alert>{success}</Alert>}
        <Button  style={{margin:'20px 0'}} variant="contained" color="primary" onClick={uploadToServer} >{flag?"Uploading":"Upload"}</Button>
    </div>
    )

    const logout = () => {
        localStorage.removeItem("biscuit");
        setLogState(false)
    }

    const deleteMe = async () => {
        var token = localStorage.getItem('biscuit')
            token = JSON.parse(token)
            let config = {
                headers: {
                  'Authorization': 'Bearer ' + token.token
                }
              }
        try {
            await axios.get('/delete',config)
            setLogState(false)
        }
        catch (error) {
            console.log(error.response?error.response.data:error.message)
        }
    }

    const deleteFile = async (filename,url) => {
        var token = localStorage.getItem('biscuit')
        token = JSON.parse(token)
        let config = {
            headers: {
              'Authorization': 'Bearer ' + token.token
            }
          }
    try {
        await axios.post('/deletefile',{filename,url},config)
        getTable()
    }
    catch (error) {
        console.log(error.response?error.response.data:error.message)
    }
    }

    useEffect(()=>{
        getTable()
    },[])

    useEffect( () => {
        if(file != null) 
            setUploadOpen(true)
    },[file,fileName])

    return (
        loading?"":error?<div><h1>{error}</h1></div>:
        <div>
             <AppBar position="static" className={classes.nav} >
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Welcome {user}
                    </Typography>
                    <input type="file" name="file" ref={uploadRef} onChange={uploadHandler} style={{display:"none"}} />
                    <Button color="secondary" onClick={() =>{uploadRef.current.click()}} >Upload</Button>
                    <Button color="secondary" onClick={()=>{setOpen(true)}} >Edit</Button>
                    <Button color="secondary" onClick={deleteMe} >Delete</Button>
                    <Button color="secondary" onClick={logout} >LogOut</Button>
                </Toolbar>
             </AppBar>
            <Grid container justify="center" direction="row" alignItems="center" className={classes.main}>
               <Grid item sm={10}>
                    <Table>
                        <TableHead >
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Address</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { data && data.map((row)=> (
                                <TableRow key={row.email}>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.username}</TableCell>
                                    <TableCell>{row.address}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {userData && <Modal className={classes.modal} disableBackdropClick={flag} disableEscapeKeyDown={flag} open={open} onClose={handleClose}>{editUser}</Modal>}
                    {file && <Modal className={classes.modal} disableBackdropClick={flag} disableEscapeKeyDown={flag} open={openUpload} onClose={handleUploadClose}>{uploadFile}</Modal>}
               </Grid>
               <Grid item sm={10}>
                <Typography style={{margin:"60px 0 20px",paddingLeft:"12px"}} variant="h6" className={classes.title}>
                            Your files :
                        </Typography>
               </Grid>
               <Grid item sm={10}>
                    <Table>
                        <TableHead >
                            <TableRow>
                                <TableCell>File Name</TableCell>
                                <TableCell>Link</TableCell>
                                <TableCell>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { userFiles && userFiles.map((row)=> (
                                <TableRow key={row.name}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell><a href={row.url} >Link</a></TableCell>
                                    <TableCell><button type="button" onClick={()=>{deleteFile(row.name,row.url)}}>Delete</button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {userData && <Modal className={classes.modal} disableBackdropClick={flag} disableEscapeKeyDown={flag} open={open} onClose={handleClose}>{editUser}</Modal>}
                    {file && <Modal className={classes.modal} disableBackdropClick={flag} disableEscapeKeyDown={flag} open={openUpload} onClose={handleUploadClose}>{uploadFile}</Modal>}
               </Grid>
            </Grid>
        </div>
    )
}
