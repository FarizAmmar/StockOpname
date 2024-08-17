<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:20', 'unique:products,code'],
            'name' => ['required', 'string', 'max:50'],
            'category' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'initial_stock' => ['required', 'integer', 'min:0'],
            'location' => ['required', 'string', 'max:255'],
            'files.*' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:2048'], // Validasi file upload
        ];
    }

    /**
     * Custom error messages for validation.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Product code is required.',
            'code.unique' => 'Product code is already exist.',
            'name.required' => 'Product name is required.',
            'category.required' => 'Category is required.',
            'price.required' => 'Price is required.',
            'price.numeric' => 'Price must be a number.',
            'initial_stock.required' => 'Start stock is required.',
            'initial_stock.integer' => 'Start stock must be an integer.',
            'location.required' => 'Location is required.',
            'files.*.mimes' => 'Only jpg, jpeg, and png files are allowed.',
            'files.*.max' => 'File size must not exceed 2MB.',
        ];
    }
}
