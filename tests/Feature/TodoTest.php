<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Todo;
use App\Models\User;

class TodoTest extends TestCase
{
    use RefreshDatabase;

    public function testIndex()
{
    // Create a user and authenticate them
    $user = User::factory()->create();
    $this->actingAs($user);

    $perPage = 10; // Number of items per page 

    // Create 100 sample Todo records in the database
    Todo::factory(100)->create();

    // Fetch the specified page of To-Do items
    $page = 1; // Adjust this to test different pages
    $todos = Todo::orderBy('created_at', 'desc')
        ->paginate($perPage, ['*'], 'page', $page);

    // You can add more data to the 'meta' key as needed
    $meta = [
        'current_page' => $todos->currentPage(),
        'last_page' => $todos->lastPage(),
        'total' => $todos->total(),
        // Add other pagination info here
    ];

    // Send a GET request to the 'todo.index' route
    $response = $this->get('/todos');

    // Assert that the response has a status code of 200
    $response->assertStatus(200);

    // Assert that the response contains the expected JSON structure for paginated data
    $response->assertJsonStructure([
        'data' => [
            '*' => [
                'id',
                'title',
                'description',
                'status',
                'created_at',
                'updated_at',
            ],
        ],
        'links'
        
    ]);

    // Add additional assertions based on your expectations
}

    public function testStore()
    {
        // Create a user and authenticate them
        $user = User::factory()->create();
        $this->actingAs($user);

        $data = [
            'title' => 'Test To-Do',
            'description' => 'This is a test To-Do item.',
        ];

        // Send a PUT request to the 'todo.store' route with the sample data
        $response = $this->put('/todo', $data);

        // Assert that the response has a status code of 201 (Created)
        $response->assertStatus(201);

        // Assert that the response contains the expected JSON structure
        $response->assertJsonStructure([
            'message',
            'todo' => [
                'id',
                'title',
                'description',
                // Add other expected attributes here
            ],
        ]);
    }

    // Similar changes for testUpdate and testDestroy methods


    public function testUpdate()
{
    // Create a user and authenticate them
    $user = User::factory()->create();
    $this->actingAs($user);

    // Create a sample Todo item
    $todo = Todo::factory()->create([
        'title' => 'Original Title',
        'description' => 'Original Description',
    ]);

    // Data to update the Todo item
    $data = [
        'id' => $todo->id,
        'title' => 'Updated Title',
        'description' => 'Updated Description',
    ];

    // Send a PUT request to the 'todo.update' route with the updated data
    $response = $this->patch('/todo', $data);

    // Assert that the response has a status code of 200 (OK) instead of 201 (Created)
    $response->assertStatus(200);

    // Assert that the response contains the expected JSON structure
    $response->assertJsonStructure([
        'message',
        'todo' => [
            'id',
            'title',
            'description',
            // Add other expected attributes here
        ],
    ]);

    // Assert that the Todo item has been updated in the database
    $this->assertDatabaseHas('todos', [
        'id' => $todo->id,
        'title' => 'Updated Title',
        'description' => 'Updated Description',
    ]);
}


    public function testDestroy()
    {
        // Create a user and authenticate them
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create a sample Todo item
        $todo = Todo::factory()->create();

        // Send a DELETE request to the 'todo.destroy' route with the Todo item's ID
        $response = $this->delete('/todo', ['id' => $todo->id]);

        // Assert that the response has a status code of 200 (OK)
        $response->assertStatus(200);

        // Assert that the response contains the expected JSON structure
        $response->assertJson(['message' => 'Todo deleted successfully']);

        // Assert that the Todo item has been deleted from the database
        $this->assertDatabaseMissing('todos', ['id' => $todo->id]);
    }
}
