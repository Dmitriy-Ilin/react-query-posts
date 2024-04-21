import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import PostsList from './components/PostsList'

const queryClient = new QueryClient();

function App() {
  
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <PostsList />
      </QueryClientProvider>
    </>
  )
}

export default App
