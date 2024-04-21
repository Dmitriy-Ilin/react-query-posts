import React, { useState } from 'react'
import { IPost } from './PostsList'

type PostItemProps = {
    post: IPost;
    handleDelete: (id: number) => void;
    handleUpdate: (post: IPost) => void;
}

const PostItem: React.FC<PostItemProps> = ({post, handleDelete, handleUpdate}) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [title, setTitle] = useState(post.title);
    const [body, setBody] = useState(post.body);
  
    return (
    <>
      {isUpdating ? 
      (<>
        <input value={title} onChange={(e) => setTitle(e.target.value)}/>
        <input value={body} onChange={(e) => setBody(e.target.value)}/>
        <span onClick={() => {
            handleUpdate({id: post.id, title, body})
            setIsUpdating(!isUpdating)
        }}>update post</span>
      </>) 
        : 
      (<>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
        <span onClick={() => setIsUpdating(!isUpdating)}>update post</span>
      </>)}
        &nbsp;
      <span onClick={() => handleDelete(post.id)}>delete post</span>
    </>
  )
}

export default PostItem
