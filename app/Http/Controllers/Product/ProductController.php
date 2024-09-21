<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\ProductRequest;
use App\Models\Product;
use App\Models\ProductFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    protected $req;
    protected $product_model;
    protected $productFile_model;

    public function __construct(Request $request, Product $product, ProductFile $productFile)
    {
        $this->req = $request;
        $this->product_model = $product;
        $this->productFile_model = $productFile;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Product index view
        return Inertia::render('Product/Main', [
            'products' => $this->product_model
                ->latest()
                ->with(['category', 'product_files'])
                ->get(),
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
            // Validation
            $validatedData = $request->validated();

            // Create product
            $product = new Product();
            $product->category_id = $validatedData['category'];
            $product->code = $validatedData['code'];
            $product->name = $validatedData['name'];
            $product->location = $validatedData['location'];
            $product->initial_stock = $validatedData['initial_stock'];
            $product->unit = $validatedData['unit'];
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
                'message' => 'Product created successfully.'
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
        try {
            $product = $this->product_model
                ->with(['category', 'product_files'])
                ->where('id', $id)
                ->first();

            return response()->json(['product' => $product]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, string $id)
    {
        try {
            // Validate the request data
            $validatedData = $request->validated();

            // Find the product by its ID
            $product = Product::findOrFail($id);

            // Update the product attributes
            $product->category_id = $validatedData['category'];
            $product->code = $validatedData['code'];
            $product->name = $validatedData['name'];
            $product->location = $validatedData['location'];
            $product->unit = $validatedData['unit'];
            $product->initial_stock = $validatedData['initial_stock'];

            // Process the files if they exist
            $files = $request->file('files');

            if ($files) {
                foreach ($files as $file) {
                    $originalName = $file->getClientOriginalName();
                    $path = $file->store('products', 'public');
                    $fileSize = $file->getSize();
                    $extension = $file->getClientOriginalExtension();

                    // Check if a file already exists
                    $existingFile = $product->product_files()->first();

                    if ($existingFile && ($existingFile->original_name != $originalName || $existingFile->file_size !== $fileSize || $existingFile->ext !== $extension)) {
                        // Delete the old file
                        Storage::disk('public')->delete($existingFile->path);

                        // Update the existing file record
                        $existingFile->file_name = basename($path);
                        $existingFile->original_name = $originalName;
                        $existingFile->file_size = $fileSize;
                        $existingFile->ext = $extension;
                        $existingFile->path = $path;
                        $existingFile->save();
                    } else {
                        // Create a new product file record if none exists with the same name
                        $productFile = new ProductFile();
                        $productFile->product_id = $product->id;
                        $productFile->file_name = basename($path);
                        $productFile->original_name = $originalName;
                        $productFile->file_size = $fileSize;
                        $productFile->ext = $extension;
                        $productFile->path = $path;
                        $productFile->save();
                    }
                }
            }

            // Save changes to the product
            $product->save();

            return redirect()->route('product.index')->with([
                'success' => 'Updated!',
                'message' => 'Product updated successfully.'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Throwable $th) {
            return back()->withErrors(['error' => $th->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            // Temukan produk berdasarkan ID
            $product = $this->product_model->find($id);

            // Temukan file produk berdasarkan ID produk
            $file = $this->productFile_model->where('product_id', $product->id)->first();

            // Hapus file dari storage jika file ada
            if ($file && Storage::exists('public/' . $file->path)) {
                Storage::delete('public/' . $file->path);
            }

            // Hapus produk dari database
            $product->delete();

            // Redirect kembali dengan pesan sukses
            return back()->with([
                'success' => 'Deleted!',
                'message' => 'Product deleted successfully.'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Throwable $th) {
            return back()->withErrors($th->getMessage());
        }
    }
}
