<?php

namespace App\Interfaces\Eloquent;

use App\Models\Transaction;
use App\Interfaces\Repositories\TransactionsInterface;
use App\Models\FinalStock;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

use function Laravel\Prompts\table;

class TransactionsRepository implements TransactionsInterface
{
    protected $product_model;
    protected $finalstock_model;
    protected $transaction_model;

    public function __construct(Product $product, Transaction $transaction, FinalStock $finalStock)
    {
        $this->product_model = $product;
        $this->finalstock_model = $finalStock;
        $this->transaction_model = $transaction;
    }

    public function getTransactionRecord(int $perPage = 10, $search = null): mixed
    {
        $query = DB::table('transactions as t')
            ->join('products as p', 'p.id', '=', 't.product_id')
            ->when(!empty($search), function ($q) use ($search) {
                $q->where(function ($query) use ($search) {
                    $query->where('p.code', 'like', "%{$search}%")
                        ->orWhere('p.name', 'like', "%{$search}%")
                        ->orWhere('p.initial_stock', 'like', "%{$search}%")
                        ->orWhere('t.transaction_date', 'like', "%{$search}%")
                        ->orWhere(function ($query) use ($search) {
                            $query->where(DB::raw('(SELECT fs.final_stock 
                                            FROM final_stocks fs 
                                            WHERE fs.product_id = t.product_id 
                                            ORDER BY fs.updated_at DESC 
                                            LIMIT 1)'), 'like', "%{$search}%");
                        });
                });
            })
            ->select(
                't.product_id',
                'p.code',
                'p.name',
                'p.initial_stock',
                't.transaction_date',
                DB::raw('SUM(CASE WHEN t.type = "in" THEN t.quantity ELSE 0 END) as total_in'),
                DB::raw('SUM(CASE WHEN t.type = "out" THEN t.quantity ELSE 0 END) as total_out'),
                DB::raw('(SELECT fs.final_stock 
                      FROM final_stocks fs 
                      WHERE fs.product_id = t.product_id 
                      ORDER BY fs.updated_at DESC 
                      LIMIT 1) as final_stock')
            )
            ->groupBy('t.product_id', 'p.code', 'p.name', 'p.initial_stock', 't.transaction_date')
            ->paginate($perPage);

        return $query;
    }

    public function storeTransactionRecord(array $data): bool
    {
        try {
            $transaction = new $this->transaction_model();
            $transaction->product_id = $data['product'];
            $transaction->transaction_date = $data['transaction_date'];
            $transaction->type = $data['transaction_type'] === 'Masuk' ? 'in' : 'out';
            $transaction->quantity = $data['quantity'];
            $transaction->notes = $data['notes'];
            $transaction->save();

            $finalStock = $this->calculateFinalStock($data['product']);

            $this->finalstock_model::updateOrCreate(
                [
                    'product_id' => $data['product'],
                    'final_date' => Carbon::now()->format('Y-m-d'),
                ],
                [
                    'final_stock' => $finalStock,
                ]
            );

            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }

    private function calculateFinalStock(int $productId): int
    {
        $totalIn = Transaction::where('product_id', $productId)
            ->where('type', 'in')
            ->sum('quantity');

        $totalOut = Transaction::where('product_id', $productId)
            ->where('type', 'out')
            ->sum('quantity');

        $initialStock = $this->product_model::find($productId)->initial_stock;

        return $initialStock + $totalIn - $totalOut;
    }
}
