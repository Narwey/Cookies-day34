const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
app.use(express.json());
app.use(cookieParser());// we invoke it as a middle
app.use(session ({ secret: 'your-secret-key' , resave: false , saveUninitialized: true}));

const users = [
    {
      username: 'Anouar',
      HashedPassword: bcrypt.hashSync('mdp' , 10),
    }
];

const isAuthenticated = (req , res , next) => {
    if(req.session.userId){
      res.send('Welcome back');
      next();
    }else{
      res.send('You Need To Be Authenticated');
    }
}

app.get('/login', (req, res) => {
    res.send(`
      <h1>Login</h1>
      <form action="/login" method="POST">
        <input type="text" name="username" placeholder="Username" required><br>
        <input type="password" name="password" placeholder="Password" required><br>
        <button type="submit">Login</button>
      </form>
    `);
  });

app.post('/Register' , (req , res ) => {
    const { username , password} = req.body ;
    const HashedPassword = bcrypt.hashSync(password , 10);
    users.push({username , HashedPassword});
    res.send('Register successfully');
})

app.get('/get' , (req , res) => {
  res.send(users)
})

app.post('/login' , (req , res) => {
        const { username , password } = req.body ;
        const user = users.find((x) => x.username === username);
    if(user && bcrypt.compareSync(password , user.HashedPassword)){  
        req.session.userId = user.username ;     
        res.send('Authenticated successfully');
    }else{
        console.log('invalid password or username' , username , password);
        res.send('invalid password or username');
    }
});

app.get('/Protected' , isAuthenticated , (req , res ) => { 
      res.send(' Welcome you are authenticated');
});

app.post('/logout', (req , res) => {
  req.session.destroy(()=> {
    res.clearCookie('session');
    res.send('Log out successfully');
  });
});

app.listen(3000, () => console.log('🍪 server on port 3000'));
