import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react'
import PostItem from './PostItem';
import { useDebounce } from '@uidotdev/usehooks';

export interface IPost {
    id: number;
    title: string;
    body: string;
}

const PostsList = () => {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch= useDebounce(search, 300);

  const fetchPages = (page = 1, search = '') => {
    if (!search) {
      return fetch(`http://localhost:3001/posts?_page=${page}`).then((res) => res.json())
    } else {
      return fetch(`http://localhost:3001/posts?q=${search}`).then((res) => res.json())
    } 
  }

  const {isPending, isError, data, error, isPlaceholderData} =
   useQuery({
    queryKey: ['posts', page, debouncedSearch], 
    queryFn: () => fetchPages(page, debouncedSearch),
    placeholderData: keepPreviousData,
   });

   const searchPosts = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

   }

   const mutation = useMutation({
    mutationFn: (newPost: Omit<IPost, 'id'>) => 
        fetch('http://localhost:3001/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(newPost)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['posts']})
        }
   });

   const deleteMutation = useMutation({
    mutationFn: (id: number) =>
        fetch(`http://localhost:3001/posts/${id}`, {
            method: 'DELETE',
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['posts']})
        }
   });

   const updateMutation = useMutation({
    mutationFn: (post: IPost) =>
        fetch(`http://localhost:3001/posts/${post.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(post)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['posts']})
        }
   })

   const handleUpdate = (post: IPost) => {
    updateMutation.mutate(post)
   }

   const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
   } 

   const handleAddPost = () => {
    if (title.trim() && body.trim()) {
        mutation.mutate({title: title, body: body})
        setTitle('');
        setBody('');
    }
   }

  if (isPending) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>Error: {error.message}</p>
  }

  return (
    <>
    {mutation.isPending ? (
        'Adding post...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}
          {mutation.isSuccess ? <div>Post added!</div> : null}

          <input value={title} onChange={(e) => setTitle(e.target.value)}/>
          <input value={body} onChange={(e) => setBody(e.target.value)}/>
          <button onClick={handleAddPost}>add post</button>
        </>
      )}
        <p></p>
        <span>current page: {page}</span>
        <button 
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))} 
          disabled={page === 1}
        >
          previous page
        </button>
        <button 
          onClick={() => {
            // if (!isPlaceholderData && data.hasMore) {
            //   setPage((prev) => prev + 1)
            // } 
            if (!isPlaceholderData) {
              setPage((prev) => prev + 1)
            } 
          }}
          // disabled={isPlaceholderData || !data?.hasMore}
          disabled={page === 11}
        >
          next page
        </button>
        <p></p>
        <span>search data </span>
        <input value={search} onChange={searchPosts}/>
        <ul>
            {data.map((post: IPost) => 
                <li key={post.id}>
                  <PostItem post={post} handleDelete={handleDelete} handleUpdate={handleUpdate}/>
                </li>
            )}
        </ul>
    </>
  )
}

export default PostsList
