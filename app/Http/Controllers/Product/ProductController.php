<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\ProductRequest;
use App\Models\Product;
use App\Models\ProductFile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Product index view
        return Inertia::render('Product/Main', [
            'products' => Product::latest()->with(['category', 'product_files'])->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        try {
            $validatedData = $request->validated();

            // Create product
            $product = new Product();
            $product->category_id = $validatedData['category'];
            $product->code = $validatedData['code'];
            $product->name = $validatedData['name'];
            $product->location = $validatedData['location'];
            $product->initial_stock = $validatedData['initial_stock'];
            $product->save();

            // Handle file uploads
            $files = $request->file('files');
            if ($files) {
                foreach ($files as $file) {
                    $originalName = $file->getClientOriginalName();
                    $path = $file->store('products', 'public');
                    $fileSize = $file->getSize();
                    $extension = $file->getClientOriginalExtension();

                    // Create product file record
                    $product_file = new ProductFile();
                    $product_file->product_id = $product->id;
                    $product_file->file_name = basename($path);
                    $product_file->original_name = $originalName;
                    $product_file->file_size = $fileSize;
                    $product_file->ext = $extension;
                    $product_file->path = $path;
                    $product_file->save();
                }
            }

            return back()->with([
                'success' => 'Created!',
                'message' => 'Product created successfully'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Throwable $th) {
            return back()->withError($th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
