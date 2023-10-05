import ToDoCard from '@/Components/ToDoCard';
import ToDoModal from '@/Components/ToDoModal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useState, useEffect, useCallback } from 'react';

export default function Dashboard({ auth }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1); // Start from page 1
  const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveTodo = (todoData) => {
    // Handle saving the new To-Do data here (e.g., sending it to the server).
    console.log('New To-Do:', todoData);
    setPage(1); // Reset page to 1 after saving a new item
  };

  

  useEffect(() => {
    // Fetch To-Do items when the component mounts and when page changes
    fetchTodos();
  }, [page]);

  const [isLoading, setIsLoading] = useState(false);


  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return; // Don't perform empty searches
    }
  
    try {
      const response = await fetch(`/todos/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
  
      if (Array.isArray(responseData)) {
        setSearchResults(responseData);
      } else {
        console.error('Invalid search response data:', responseData);
      }
    } catch (error) {
      console.error('Error searching To-Do items:', error);
    }
  };
  







  const fetchTodos = useCallback(async () => {
    if (isLoading) {
      // A request is already in progress, so return early
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/todos?page=${page}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();

      if (Array.isArray(responseData.data)) {
        if (responseData.data.length === 0) {
          setHasMore(false);
          if (page === 1) {
            // If it's the first page and there's no data, clear the todos
            setTodos([]);
          }
        } else {
          if (page === 1) {
            // If it's the first page, replace the existing todos with new data
            setTodos([...responseData.data]);
          } else {
            // If it's not the first page, append the new data to existing todos
            setTodos([...todos, ...responseData.data]);
          }
          setPage(page + 1); // Increment the page for the next request
        }
      } else {
        console.error('Invalid response data:', responseData);
      }
    } catch (error) {
      console.error('Error fetching To-Do items:', error);
    } finally {
      setIsLoading(false); // Set isLoading back to false, so the next request can be triggered
    }
  }, [isLoading, page, todos]);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
      
        <div className="flex justify-between items-center">
      


      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mx-2 my-1 border border-gray-300 rounded-lg p-2"
      />

      <button
              onClick={handleSearch}
              className="w-12 h-10 mr-10  bg-purple-500 text-white rounded-md"
            >
              <i className="fa fa fa-search fa-sm" />
            </button>

      <button
              onClick={handleOpenModal}
              className="w-12 h-10  bg-purple-500 text-white rounded-md"
            >
              <i className="fa fa-plus fa-sm" />
            </button>
    
      </div>
    
    
    }
    >
      <Head title="Dashboard" />




{searchResults.length > 0 ? (
  <div className="my-5 mt-8">
    <h2>Search Results:</h2>
    {searchResults.map((result, index) => (
      <div className="my-5 mt-8" key={index}>
        <ToDoCard todo={result} />
      </div>
    ))}
  </div>
) :
      <InfiniteScroll
        dataLength={todos.length}
        next={fetchTodos}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollThreshold={0.9} // Adjust this value as needed
      >
        {todos.map((todo, index) => (
          <div className='my-5 mt-8' key={index}>
            <ToDoCard todo={todo} />
          </div>
        ))}
      </InfiniteScroll>}

      <ToDoModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveTodo} />
    </AuthenticatedLayout>
  );
}
