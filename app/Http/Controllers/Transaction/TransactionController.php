<?php

namespace App\Http\Controllers\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\TransactionRequest;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    protected $req;
    protected $transaction_model;

    public function __construct(Request $request, Transaction $transaction)
    {
        $this->req = $request;
        $this->transaction_model = $transaction;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $perPage = (int) $this->req->input('per_page', 10);
        $search = $this->req->input('search', '');

        // Query with search condition
        $transactions = Transaction::with(['product'])
            ->when($search, function ($query, $search) {
                return $query->whereHas('product', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('code', 'like', '%' . $search . '%')
                        ->orWhere('initial_stock', 'like', '%' . $search . '%')
                        ->orWhere('type', 'like', '%' . $search . '%')
                        ->orWhere('quantity', 'like', '%' . $search . '%');
                });
            })
            ->latest()
            ->paginate($perPage)
            ->appends(['search' => $search]);

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

            $transaction = new Transaction();
            $transaction->product_id = $validated_data['product'];
            $transaction->transaction_date = $validated_data['transaction_date'];
            $transaction->type = $validated_data['transaction_type'] == 'Masuk' ? 'in' : 'out';
            $transaction->quantity = $validated_data['quantity'];
            $transaction->notes = $validated_data['notes'];
            $transaction->save();

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
