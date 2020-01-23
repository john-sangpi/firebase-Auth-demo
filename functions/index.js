const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


//this context object contains information about the user that is logged in when this request 
//to this function is made. so we can tell if that currrent user is actually an admin
// when they're making this request.
exports.addAdminRole = functions.https.onCall((data,context)=>{
    // check request is made by an admin 
    if (context.auth.token.admin !== true){
        return {error:'only admins can add other admins, sucker'}
    }

    // get user and add custom claim (admin)
    return admin.auth().getUserByEmail(data.email).then(user =>{
        return admin.auth().setCustomUserClaims(user.uid,{
            admin:true
        });
    }).then(()=>{
        return {
            message : `Success! ${data.email} has been made an admin` 
        }
    }).catch(err =>{
        return err;
    });
});
