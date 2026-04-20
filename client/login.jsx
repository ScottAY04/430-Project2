const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if(!username || !pass){
        helper.handleError('Username and password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass});
    return false;
}

//handles the signup for the app
const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target. querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if(!username || !pass || !pass2){
        helper.handleError('All fields are required!');
        return false;
    }

    if(pass !== pass2){
        helper.handleError('Passwords do not match');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2}, true);

    return false;
}

const handleChangePass = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target. querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if(!username || !pass || !pass2){
        helper.handleError('All fields are required!');
        return false;
    }

    if(pass !== pass2){
        helper.handleError('Passwords do not match');
        return false;
    }

    console.log(username, pass, pass2);
    helper.sendPost(e.target.action, {username, pass, pass2});
    return false;
}

//login window
const LoginWindow = (props) => {
    return(
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <input className="formSubmit" id="signIn" type="submit" value="Sign In" />
            
            <div class="navlink"><a id="changePass" onClick={() => {
            const root = createRoot(document.getElementById('content'));
            root.render(<ChangePassWindow />)
            }}>Forgot Password</a></div>
        </form>
    );
}

const ChangePassWindow = (props) => {
    return(
        <form id="changePassword"
            name="changePassword"
            onSubmit={handleChangePass}
            action="/changePass"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">New Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass">Retype New Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Sign In" />
        </form>
    );
}

const SignupWindow = (props) => {
    return(
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Sign In" />
        </form>
    );
}


const PremiumWindow = (props) => {
    
}

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e)=>{
        e.preventDefault();
        root.render(<LoginWindow />);
        return false;
    });

    signupButton.addEventListener('click', (e)=>{
        e.preventDefault();
        root.render(<SignupWindow />);
        return false;
    });


    root.render(<LoginWindow />);
};

window.onload = init;