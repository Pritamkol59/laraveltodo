<?php

namespace App\Http\Controllers;

use App\Models\todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = 5; // Number of items per page

        // Retrieve the 'page' query parameter from the request (default to 1 if not provided)
        $page = $request->query('page', 1);

        // Fetch the specified page of To-Do items
        // $todos = Todo::paginate($perPage, ['*'], 'page', $page);
        $todos = Todo::orderBy('created_at', 'desc')
        ->paginate($perPage, ['*'], 'page', $page);

        // Return the paginated data as JSON
        return response()->json($todos, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }


    public function search(Request $request)
{
    $query = $request->input('q');

    // Perform the search query based on title or description
    $results = ToDo::where('title', 'like', "%$query%")
        ->orWhere('description', 'like', "%$query%")
        ->get();

    return response()->json($results);
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|max:255',
            'description' => 'required',
            
        ]);

        // Create a new To-Do using the validated data
        $todo = Todo::create($validatedData);

        // Return a response indicating success and the created To-Do
        return response()->json(['message' => 'To-Do created successfully', 'todo' => $todo], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(todo $todo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(todo $todo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $id = $request->input('id');
        $validatedData = $request->validate([
            'title' => 'required|max:255',
            'description' => 'required',
            'status'=>'max:255',
        ]);
    
        // Find the Todo item by ID
        $todo = Todo::find($id);
    
        if (!$todo) {
            return response()->json(['message' => 'To-Do not found'], 404);
        }
    
        // Update the attributes of the Todo item
        $todo->update($validatedData);
    
        // Return a response indicating success and the updated To-Do
        return response()->json(['message' => 'To-Do updated successfully', 'todo' => $todo]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        
        $id = $request->input('id');

        $todo = Todo::find($id);

    if (!$todo) {
        return response()->json(['message' => 'Todo not found'], 404);
    }

    $todo->delete();

    return response()->json(['message' => 'Todo deleted successfully']);
    }
}
