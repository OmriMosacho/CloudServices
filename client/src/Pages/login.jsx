import React, { useState } from 'react';





const SigninSignup = ({value}) => {

    const { action, setAction,authenticationCheck,authenticatedError,addUser,addingError } = value;
    const [email,setEmailValue] = useState('');
    const [password,setPasswordValue] = useState('');
    const [name,setNameValue] = useState('');

    const handleEmailChange = (e) => {
        setEmailValue(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPasswordValue(e.target.value);
    };

    const handleNameChange = (e) => {
        setNameValue(e.target.value);
    };


    const handleSubmit = () => {
        if (action==='Sign In') authenticationCheck(email,password);
        else addUser(name,email,password,0);

        setNameValue('');
        setEmailValue('');
        setPasswordValue('');


    };


    return (
        <div>
            <h2 className='card1'>{action}</h2>
                {action==='Sign In'?<div></div>:
                    <div className='card'>
                        <input type="text" placeholder="Name" value={name} onChange={handleNameChange} required/>
                    </div> 
                }
            <div className='card1'>
                
                <div className='card'>
                    <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} required/>
                </div>
                <div className='card'>
                    <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} required />
                </div>

            </div>
            
            {
                addingError===false?<div></div>:
                <div className='card'>
                    <a style={{'color':'red','textAlign': 'center'}} className='link' href=''>User already exist!</a>
                </div>
            }

            {action==='Sign In'?<div></div>:
                <div className='card'>
                    <a className='link' href=''>Forgot Password?</a>
                </div>
            }

            
            {action==='Sign In'?<div className='card'><a className='link' onClick={() => {
                                                                            setAction('Sign Up');
                                                                            console.log(action);
                                                                        }}>Click here to create a new user</a></div>:
                <div></div>
            }
            {action!=='Sign In'?<div className='card'><a className='link' onClick={() => {
                                                                            setAction('Sign In');
                                                                            console.log(action);
                                                                        }}>Click here if you already have a user</a></div>:
                <div></div>
            }

            {authenticatedError===false || action !== 'Sign In'?<div></div>:
                <div style={{'color':'red','textAlign': 'center'}}>User is not exist, at least one of the credentials is wrong</div>
            }


            <div className='card'>
                <button type="submit" onClick={() => handleSubmit()}>{action}</button>
            </div>

        </div>
    )
};

export default SigninSignup;