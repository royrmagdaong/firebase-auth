

// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    // get data from firestore
    db.collection('guides').onSnapshot(snapshot => {
      setupGuides(snapshot.docs);
      setupUI(user);
    }, err => {
      console.log(err.message);
    });
  } else {
    setupUI();
    setupGuides([]);
  }
});

// create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
  e.preventDefault();

  db.collection('guides').add({
    title: createForm['title'].value,
    content: createForm['content'].value
  }).then(() => {
    // closing the modal and clearing the form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
  }).catch(err => {
    console.log(err.message);
  });
});


// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  // prevent submit to automatically refresh the page
  e.preventDefault();

  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      bio: signupForm['signup-bio'].value
    });
  }).then(() => {
    // closing the modal and clearing the form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
}); 


// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  auth.signInWithEmailAndPassword(email, password).then(cred => {
    // close the login modal and reset the form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  })
});