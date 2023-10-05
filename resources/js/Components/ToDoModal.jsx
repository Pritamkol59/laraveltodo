import React, { useState } from 'react';
import axios from 'axios';
const ToDoModal = ({ isOpen, onClose, onSave,ft }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  

  const handleSubmit = async () => {
    if (title.trim() === '' || description.trim() === '') {
      alert('Title and Description are mandatory fields.');
      return;
    }

    try {
        // Send a POST request to your Laravel API route named 'todo.store'
        const response = await axios.post(route('todo.store'), {
          title,
          description,
          
        });
    
        // Handle the response if needed
        console.log('New To-Do created:', response.data);
    
        // Close the modal
        setTitle('');
        setDescription('');
        
        onClose();
        onSave(response.data);
        window.location.reload();
      } catch (error) {
      // Handle any errors that occur during the API request
      console.error('Error creating To-Do:', error);
    }
  };


  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? 'visible' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-md relative w-96"> {/* Increase card width */}
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <i className="fa fa-times" />
        </button>
        <h2 className="text-lg font-semibold mb-4">Add New To-Do</h2>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToDoModal;
