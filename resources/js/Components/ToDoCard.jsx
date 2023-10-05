import React, { useState, useEffect, useCallback } from 'react';
import UpdateToDoModel from './UpdateToDoModel';

const ToDoCard = ({ todo }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description);
    const [id, setID] = useState(todo.id);
    const [status, setStatus] = useState(1);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsModalOpen(false);
        
      };

      const handleOpenDeleteConfirmation = () => {
        setIsDeleteConfirmationOpen(true);
      };
    
      const handleCloseDeleteConfirmation = () => {
        setIsDeleteConfirmationOpen(false);
      };

      const handleStatus = async() => {
       

        try {
            // Send a POST request to your Laravel API route named 'todo.store'
            const response = await axios.patch(route('todo.update'), {
              title,
              description,
              status,
              id
            });
        
            // Handle the response if needed
            console.log(' To-Do updated:', response.data);
        
            // Close the modal
          
            
            window.location.reload();
            
          } catch (error) {
          // Handle any errors that occur during the API request
          console.error('Error creating To-Do:', error);
        }
      
    
        
      };


      const handleDelete = async () => {
        try {
          // Send a DELETE request to the full URL
          const response = await axios.delete(route('todo.destroy'), {
            data: { id }, // Send the ID as data
          });
      
          // Handle the response if needed
          console.log('To-Do updated:', response.data);
      
          // Close the modal
          window.location.reload();
        } catch (error) {
          // Handle any errors that occur during the API request
          console.error('Error deleting To-Do:', error);
        }
      };
      




      const formattedCreatedAt = new Date(todo.created_at).toLocaleString(); 
    return (
        <div className="bg-white rounded-lg shadow-md max-w-7xl mx-auto flex">
            <div className="w-3/4 p-4">
                <h3 className="text-lg font-semibold">{todo.title}</h3>
                <p className="text-gray-600">{todo.description}</p>
                <div className="mt-2">
                    {todo.status==1 ? (
                        <span className="text-green-500">Completed</span>
                    ) : (
                        <span className="text-red-500">Incomplete</span>
                    )}
                </div>
                <p className="text-gray-600">Created:-{formattedCreatedAt}</p>
            </div>
            <div className="w-1/4 p-4 flex flex-col justify-center items-end">
                {/* Buttons displayed as a column with Font Awesome icons */}
                <button 
                onClick={handleOpenModal}
                className="px-3 py-1 bg-blue-500 text-white rounded mb-2">
                    <i className="fa fa-pencil" /> 
                </button>
                <button 
                
                onClick={handleOpenDeleteConfirmation}
                className="px-3 py-1 bg-red-500 text-white rounded mb-2">
                    <i className="fa fa-trash" /> 
                </button>
                {todo.status==0 ? (
                <button 
                onClick={handleStatus}
                className="px-3 py-1 bg-green-500 text-white rounded">
                    <i className="fa fa-check" /> 
                </button>):null}



                     {/* Delete Confirmation Modal */}
      {isDeleteConfirmationOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <p>Are you sure you want to delete this To-Do item?</p>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-500 text-white rounded m-2"
            >
              Yes
            </button>
            <button
              onClick={handleCloseDeleteConfirmation}
              className="px-3 py-1 bg-blue-500 text-white rounded m-2"
            >
              No
            </button>
          </div>
        </div>
      )}


            </div>
            <UpdateToDoModel isOpen={isModalOpen} onClose={handleCloseModal} data={todo} />
        </div>
    );
}

export default ToDoCard;
