const guidesdata = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetail = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');

//set up nav bar
const setupUI =(user) =>{
    if(user){
        if(user.admin){
            adminItems.forEach(item => item.style.display = 'block');
        }
        // account info
        db.collection('users').doc(user.uid).get().then(doc =>{
            let text = `
                <div>log in as ${user.email} </div>
                <div>${doc.data().bio}</div>
                <div class="pink-text">${user.admin ? 'Admin':''}</div>
            `;
            accountDetail.innerHTML = text;
        })
        // toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
       
    }else{
        adminItems.forEach(item => item.style.display = 'none');
        //toggle UI element
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
        accountDetail.innerHTML = '';
    }
}

// display guides text 
const setupGuides = (data)=>{
    if(data.length){
        let html = '';
        data.forEach(doc => {
            const guide = doc.data();
            let li=`
            <li>
                <div class="collapsible-header grey lighten-4">${guide.title}</div>
                <div class="collapsible-body white"><span>${guide.content}</span></div>
            </li>
            `;
            html += li;
        });
        guidesdata.innerHTML = html;

    }else{
        guidesdata.innerHTML = '<h5 class="center-align"> log in to view guides.</h5>';
    }
   
}

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
  
  });