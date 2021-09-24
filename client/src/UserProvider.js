import React, {createContext, useState, useEffect} from "react";
import axios from 'axios';

export const userContext = createContext()

export const UserProvider =  (props) => {

    const [user, setUser] = useState('')
    const [logState, setLogState] = useState(false)
    const [loading, setLoading] = useState(true)

    const autoLog = (time) => {
        if(time)
            setTimeout(()=>{
                checkState()
            },time*1000)
        }

    const checkState = async () => {
        try {
            var token = localStorage.getItem('biscuit')
            token = JSON.parse(token)
            if(!token)
                throw new Error('Please Login')
            let config = {
                headers: {
                'Authorization': 'Bearer ' + token.token
                }
            }
            const currentUser = await axios.get('/currState',config)
            setUser(currentUser.data)
            setLogState(true)
            autoLog(token.expires-Math.floor(Date.now()/1000))
        }
        catch (err) {
            setLogState(false)
        }
        setLoading(false)
    }

    useEffect(() => {
        checkState()
    },[logState])

    return (
        <userContext.Provider value={{user,logState,loading,setLogState}}>
            {props.children}
        </userContext.Provider>
    )
}