import React, { useState, useEffect, useCallback } from 'react';

const UpdateToDoModel = ({ isOpen, onClose, onSave,data}) => {
    const [title, setTitle] = useState(data.title);
    const [description, setDescription] = useState(data.description);
    const [id, setID] = useState(data.id);
   
  
    const handleSubmit = async () => {
      if (title.trim() === '' || description.trim() === '') {
        alert('Title and Description are mandatory fields.');
        return;
      }
  
      try {
          // Send a POST request to your Laravel API route named 'todo.store'
          const response = await axios.patch(route('todo.update'), {
            title,
            description,
          
            id
          });
      
          // Handle the response if needed
          console.log(' To-Do updated:', response.data);
      
          // Close the modal
        
          onClose();
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
          <h2 className="text-lg font-semibold mb-4">Edite To-Do</h2>
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

    )
}

export default UpdateToDoModel