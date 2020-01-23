  

// add admin cloud functions 
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const adminEmail = document.querySelector('#admin-email').value;
    const adminRole = functions.httpsCallable('addAdminRole');
    adminRole({email:adminEmail}).then(result=>{
        console.log(result);
    })
})
// listen for auth status changes
auth.onAuthStateChanged(user => {
    //console.log(user);
    if (user) {   
        user.getIdTokenResult().then(idTokenResult => {
            user.admin = idTokenResult.claims.admin;
            setupUI(user);
        })
      db.collection('guides').onSnapshot(snapshot => {
        setupGuides(snapshot.docs);        
      }, err =>
         console.log(err.message)
        );
    } else {
      console.log('user logged out');
      setupGuides([]);
      setupUI();
    }
  })

// create new guides

const guideForm = document.querySelector('#create-form');
guideForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let title = guideForm['title'].value;
    let content = guideForm['content'].value;
    db.collection('guides').add({
        content:content,
        title :title
    }).then(()=>{
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        guideForm.reset();
    }).catch(err => {
        console.log(err);
      });
})

//signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    
    auth.createUserWithEmailAndPassword(email,password).then(cred =>{
        return db.collection('users').doc(cred.user.uid).set({
            bio:signupForm['signup-bio'].value
        });
        
    }).then(()=>{
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
        signupForm.querySelector('.error').innerHTML = '';
    }).catch(err =>{
        signupForm.querySelector('.error').innerHTML = err.message;
    });

});

//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click',(e)=>{
    e.preventDefault();
    auth.signOut();
})


//log in
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let email = loginForm['login-email'].value;
    let password = loginForm['login-password'].value;
    auth.signInWithEmailAndPassword(email, password).then(cred =>{
        console.log(cred.user);
        //close the login modal and reset the form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
        loginForm.querySelector('.error').innerHTML = '';
    }).catch(err =>{
        loginForm.querySelector('.error').innerHTML = err.message;
    })

})