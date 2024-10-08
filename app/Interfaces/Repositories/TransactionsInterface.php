<?php

namespace App\Interfaces\Repositories;

interface TransactionsInterface
{
    public function getTransactionRecord(int $perPage, $search): mixed;

    public function storeTransactionRecord(array $data): bool;
}
