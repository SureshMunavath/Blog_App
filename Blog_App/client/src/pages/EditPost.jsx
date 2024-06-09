import { useEffect, useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
export default function EditPost()
{
    const {id}=useParams();
    const [title,setTitle]=useState('');
    const [summary,setSummary]=useState('');
    const [content,setContent]=useState('');
    const [files,setFiles]=useState('');
    const [redirect,setRedirect]=useState(false);
   useEffect(()=>
   {
     fetch('http://127.0.0.1:8080/post/'+id)
     .then(response=>{
        response.json().then(postInfo=>{setTitle(postInfo.title);
            setContent(postInfo.content);
            setSummary(postInfo.summary);
            setFiles(postInfo.files);
        });
     });
},[]);
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];
    
    async function UpdatePost(ev)
    {
        ev.preventDefault();
       
       const data=new FormData;
       data.set('title',title);
       data.set('summary',summary);
       data.set('content',content);
       data.set('id',id);
       if(files?.[0])
       {
        data.set('file',files?.[0]);
       }
       
       const response=await fetch("http://127.0.0.1:8080/post",{
           method:'PUT',
           body:data,
           credentials:'include',
       })
       if(response.ok)
       {
           setRedirect(true);
       }
    }
    if(redirect)
    {
       return<Navigate to={'/post/'}/>
    }
       return (
           <form onSubmit={UpdatePost}>
               <input type="title" 
                   placeholder={'Title'} 
                   value={title} 
                   onChange={ev=>setTitle(ev.target.value)}/>
               <input type="summary" 
                   placeholder={'Summary'} 
                   value={summary} 
                   onChange={ev=>setSummary(ev.target.value)}/>
               <input type="file" 
                   onChange={ev=>{setFiles(ev.target.files)}}/>
               <Editor onChange={setContent} value={content}/>
   
               <button style={{marginTop:'5px'}}>Update Post</button>
           </form>
       )
   }
    