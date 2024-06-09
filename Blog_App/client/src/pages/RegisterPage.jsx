import { useState } from "react";
export default function RegisterPage()
{
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    async function register(ev)
    {
          ev.preventDefault();
           const response=await fetch('http://127.0.0.1:8080/register',{
            method:'POST',
            body:JSON.stringify({username,password}),
            headers:{'Content-Type':'application/json'}

          });
          if(response.status===200)
          {
            alert("registered successfully");
          }
          else
          {
            alert("registration failed");
          }
           // const data = await response.json()
    }
    return(
        
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
        <input type="text"
             placeholder="User name" 
             value={username} 
             onChange={ev=>setUsername(ev.target.value)}/>
        <input type="password" 
            placeholder="Password" 
            value={password} 
            onChange={ev=>setPassword(ev.target.value)}/>
        <button>Register</button>
        </form>
    )
}
