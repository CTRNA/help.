const admin = require('https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js');

const serviceAccount = require('key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get('/', (req, res) => {
    res.render("view/index.ejs", {name: req.user.name})
})

app.get('/terminal', (req, res) => {
    res.render("view/terminal.ejs", {name: req.user.name})
})

app.get('/register', (req, res) => {
    res.render("/?modal=2")
})
app.get('/login', (req, res) => {
    res.render("/?modal=1")
})


app.post("/register", async (req, res) => {
  try {
    const {name, surname, email, password} = req.body;
    const userRecord = await admin.auth().createUser({
      name,
      surname
      email,
      password,
      displayName: name
    });

    // Optionally, save additional user information in Firestore
    const userDoc = db.collection('users').doc(userRecord.uid);
    await userDoc.set({name, surname});

    console.log('User created with ID:', userRecord.uid);
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.redirect("/register");
  }
});

app.delete("/logout", async (req, res) => {
  try {
    // Clear the session cookie
    res.clearCookie('session');
    // Sign out the user
    res.redirect('/login');
  } catch (error) {
    console.error('Logout error:', error);
    res.redirect('/');
  }
});
