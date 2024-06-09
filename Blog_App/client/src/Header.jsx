import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
export default function Header()
{
  //const [username,setUsername]=useState('');

  const {setUserInfo,userInfo}=useContext(UserContext);
  useEffect(()=>
  {
    fetch('http://127.0.0.1:8080/profile',{
      credentials:'include',
    }).then(response=>{ //as this returns a json object so need to be converted using .json to extract required info from the objectss
         response.json().then(userDoc=>{
          setUserInfo(userDoc);
         });
    })
  },[]);
  function logout()
  {
    //with logout we invalidate the cookie
    fetch("http://127.0.0.1:8080/logout",{
       credentials:'include',
       method:'POST',  
    });
    setUserInfo(null)
  }
  const username=userInfo?.username;
    return(
        <header>
        <Link to="/" className="login">My Blog</Link>
        <nav>
          {username &&(
              <>
              <span>Hello {username}</span>
              <Link to="/create">Create new post</Link>
              <Link onClick={logout}>Logout</Link>
              </>
          )}
          {!username &&(
            <>
            <Link to="/login">Login</Link>
            <Link to="/register" >Register</Link>
             </>
          )}
          
        </nav>
      </header>
    )
}
