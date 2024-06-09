import { formatISO9075 } from 'date-fns';
import { Link } from 'react-router-dom';
import './App.css';
export default function Post({_id,title,summary,cover,createdAt,author}){

    return (
        <div className='post'>
        <div className="image">
          <Link to={`/post/${_id}`}>
          <img src={'http://127.0.0.1:8080/'+cover} alt="" />
          </Link>
          </div>
        
        <div className="text">
          <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
          </Link>          
          <p className="info">
            <span className="author">{author.username}</span>&nbsp;
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
           <p className='summary'>{summary}</p>
        </div>
      </div>   
    );
}