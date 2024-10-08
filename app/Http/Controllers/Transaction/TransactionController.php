<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\TransactionRequest;
use App\Interfaces\Repositories\TransactionsInterface;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    protected $req;
    protected $transaction_model;
    protected $transaction_interface;

    public function __construct(Request $request, Transaction $transaction, TransactionsInterface $transactionsInterface)
    {
        $this->req = $request;
        $this->transaction_model = $transaction;
        $this->transaction_interface = $transactionsInterface;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $perPage = (int) $this->req->input('per_page', 10);

        $search = $this->req->input('search', '');

        $search = $search == null ? '' : $search;

        $transactions = $this->transaction_interface->getTransactionRecord($perPage, $search);

        // Transaction index view
        return Inertia::render('Transaction/Main', compact('transactions', 'search'));
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
    public function store(TransactionRequest $request)
    {
        try {
            $validated_data = $request->validated();

            // Pass data to repository to store the transaction
            $this->transaction_interface->storeTransactionRecord($validated_data);

            return back()->with([
                'success' => 'Created!',
                'message' => 'Transaction created successfully.'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Throwable $th) {
            return back()->withErrors($th->getMessage());
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
