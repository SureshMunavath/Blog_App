import { useEffect, useState } from "react";
import Post from "../Post";
export default function IndexPage()
{
    const [posts,setPosts]=useState([]);
    useEffect(()=>
    {
        fetch('http://127.0.0.1:8080/post').then(response=>{
            response.json().then(posts=>{
                setPosts(posts);
            })
            
        })
    },[]);
    return(
        
        <div>
        {posts.length>0 && posts.map((post,key)=>(
            <Post {...post}/> //passing all the properties of post!!
        ))}
         {/* <Post/>
         <Post/>
         <Post/> */}
        </div>
        
    )
}