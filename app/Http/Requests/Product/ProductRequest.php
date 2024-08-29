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
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Set 'is_update' flag based on whether an 'id' exists in the route
        $this->merge([
            'is_update' => $this->route('id') ? true : false,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'code' => ['required', 'string', 'max:20'],
            'name' => ['required', 'string', 'max:50'],
            'category' => ['required', 'string'],
            'initial_stock' => ['required', 'integer', 'min:1'],
            'location' => ['required', 'string', 'max:255'],
            'files' => ['required', 'array', 'min:1'],
            'files.*' => ['required', 'mimes:jpg,jpeg,png', 'max:2048'],
        ];

        if ($this->input('is_update')) {
            $productId = $this->route('id');
            $rules['code'][] = 'unique:products,code,' . $productId;
        } else {
            $rules['code'][] = 'unique:products,code';
        }

        return $rules;
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
            'initial_stock.required' => 'Start stock is required.',
            'initial_stock.integer' => 'Start stock must be an integer.',
            'location.required' => 'Location is required.',
            'files.required' => 'Please upload at least one image file.',
            'files.min' => 'Please upload at least one image file.',
            'files.*.required' => 'Each image file is required.',
            'files.*.mimes' => 'Only jpg, jpeg, and png files are allowed.',
            'files.*.max' => 'File size must not exceed 2MB.',
        ];
    }
}
