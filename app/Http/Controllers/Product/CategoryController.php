<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    protected $category_model;

    public function __construct(Category $category)
    {
        $this->category_model = $category;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get all category data
        try {
            // get data
            return response()->json(['category' => $this->category_model->all()], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json($th->getMessage(), 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        //
    }
}
