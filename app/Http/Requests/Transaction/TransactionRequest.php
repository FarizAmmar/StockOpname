<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Foundation\Http\FormRequest;

class TransactionRequest extends FormRequest
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
            'product' => 'required',
            'transaction_date' => 'required|date_format:Y/m/d',
            'transaction_type' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'product.required' => 'The product field is required.',
            'transaction_date.required' => 'The transaction date is required.',
            'transaction_date.date_format' => 'The transaction date is required.',
            'transaction_type.required' => 'The transaction type is required.',
            'quantity.required' => 'The quantity field is required.',
            'quantity.integer' => 'The quantity must be a valid number.',
            'quantity.min' => 'The minimum quantity is :min.',
        ];
    }
}
