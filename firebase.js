var firebase = require("firebase/app");
require("firebase/firestore");
require("firebase/storage");

const firebaseConfig = {
    apiKey: "AIzaSyDu-wtgk5ra2Q28y-nGp3LPQ2OvMKmf0kM",
    authDomain: "nemesis-319c7.firebaseapp.com",
    projectId: "nemesis-319c7",
    storageBucket: "nemesis-319c7.appspot.com",
    messagingSenderId: "166673450619",
    appId: "1:166673450619:web:292e5544c6501ab36344de",
    measurementId: "G-468KQ4XHQN"
  };
 firebase.initializeApp(firebaseConfig);

 const firestore = firebase.firestore();
 var storage = firebase.storage();

const upload = async (file,user) => {
    const storageRef = storage.ref()
    try {
        const ob  = await storageRef.child(`${user}/${file.originalname}`).put(file.buffer, {contentType: file.mimetype})
        const url = await ob.ref.getDownloadURL()
        let data = {
            'name' : file.originalname,
            'url' : url 
        }
        const doc = await firestore.collection('users').doc(user)
        await doc.update({
            files: firebase.firestore.FieldValue.arrayUnion(data)
        });
        return url
    }
    catch(err) {
        throw err
    }

}

const createUser = async (data) => {
    try {
        var doc = await firestore.collection('users').doc(data.email).get()
        if(doc.exists){
            throw new Error('User Already Exist', 'User Already Exist')
        }
        else {
            await firestore.collection('users').doc(data.email).set({
                                    email : data.email,
                                    password : data.password,
                                    username : data.username,
                                    address : data.address
                                })
            return data.email
        }
    }
    catch (err) {
        throw err
    } 
}

const getData = async (user) => {
    // const collection = await firestore.collection('users').get()
    // table = []
    // collection.docs.forEach(doc => {
    //     table = [...table,doc.data()]            
    // })
    const doc = await firestore.collection('users').doc(user).get()
    var {email,address,username,files} = doc.data()
    var userData = {email,address,username}
    // console.log(table)
    // return {table, userData}
    return {userData,files}
}

const verifyUser = async (id) => {
    const doc = await firestore.collection('users').doc(id).get()
    if(doc.exists) {
        return true
    }
    else
        throw new Error('No user')
}

const loginUser = async (cred) => {
    try {
        const doc = await firestore.collection('users').doc(cred.email).get()
        if(doc.exists) {
            if(doc.data().password === cred.pass)
                return true
            else
                throw new Error("Mismatch", "Email or password didn't match")
        }
        else
                throw new Error("Mismatch", "Email or password didn't match")
    }
    catch (err) {
        throw new Error("Email or password didn't match")
    }
    
}

const deleteFile = async (filename,url,user) => {
    const storageRef = storage.ref()
    try {
        console.log(user,filename)
        var doc = firestore.collection("users").doc(user);
        const data = await firestore.collection('users').doc(user).get()
        var {files} = data.data()
        console.log(files)
        files = files.filter(file=>{ file.name != filename})
        console.log(files)
        await doc.update({ files });
        var desertRef = storageRef.child(`${user}/${filename}`);
        await desertRef.delete()
    }
    catch(err) {
        throw err
    }
}

const changeDetails  = async (user,username=null,password=null,address=null) => {
    const doc = await firestore.collection('users').doc(user)
    try {
       if(username)
           await doc.update({
               username
           })
       if(password)
           await doc.update({
               password
           })
        if(address)
            await doc.update({
                address
            })
        return 'done'
    }
    catch (error) {
        throw error
    }
}

const deleteUser = async(user) => {
    try {
        await firestore.collection('users').doc(user).delete()
        return 'done'
    }
    catch (error) {
        throw error
    }
}
module.exports = {
    createUser,
    getData,
    loginUser,
    verifyUser,
    changeDetails,
    deleteUser,
    upload,
    deleteFile,
}