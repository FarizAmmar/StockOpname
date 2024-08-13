<h1>Stock Opname</h1>

<p><strong>Stock Opname</strong> adalah aplikasi yang memungkinkan pengguna untuk mencatat dan memantau stok barang, termasuk barang masuk dan keluar. Aplikasi ini dikembangkan menggunakan Laravel sebagai backend dan React sebagai frontend.</p>

<h2>Fitur Utama</h2>
<ul>
    <li><strong>Manajemen Stok</strong>: Memungkinkan pencatatan stok barang secara akurat.</li>
    <li><strong>Barang Masuk/Keluar</strong>: Mencatat transaksi barang masuk dan keluar.</li>
    <li><strong>Laporan Mingguan</strong>: Menyediakan laporan mingguan terkait pergerakan stok.</li>
</ul>

<h2>Persyaratan Sistem</h2>
<p>Pastikan bahwa Anda telah menginstal perangkat berikut di sistem Anda:</p>
<ul>
    <li><strong>PHP</strong> >= 8.1</li>
    <li><strong>Composer</strong></li>
    <li><strong>Node.js</strong> >= 16.x</li>
    <li><strong>NPM</strong> atau <strong>Yarn</strong></li>
    <li><strong>MySQL</strong> atau <strong>MariaDB</strong> (atau database lain yang didukung Laravel)</li>
</ul>

<h2>Instalasi</h2>
<p>Ikuti langkah-langkah di bawah ini untuk menginstal aplikasi di lingkungan lokal Anda:</p>

<h3>1. Clone Repository</h3>
<pre><code>git clone https://github.com/FarizAmmar/StockOpname.git
cd stock-opname</code></pre>

<h3>2. Install Dependencies</h3>

<h4>Backend (Laravel)</h4>
<pre><code>composer install</code></pre>

<h4>Frontend (React)</h4>
<pre><code>npm install
# atau jika menggunakan yarn
yarn install</code></pre>

<h3>3. Konfigurasi Environment</h3>
<p>Salin file <code>.env.example</code> menjadi <code>.env</code> dan sesuaikan konfigurasi database serta pengaturan lainnya.</p>
<pre><code>cp .env.example .env</code></pre>

<p>Generate aplikasi key:</p>
<pre><code>php artisan key:generate</code></pre>

<h3>4. Migrasi dan Seed Database</h3>
<p>Jalankan perintah berikut untuk membuat tabel-tabel di database:</p>
<pre><code>php artisan migrate</code></pre>

<p>Jika terdapat seeder, jalankan:</p>
<pre><code>php artisan db:seed</code></pre>

<h3>5. Build Frontend</h3>
<p>Jalankan perintah berikut untuk mengompilasi aset frontend:</p>
<pre><code>npm run build
# atau jika menggunakan yarn
yarn build</code></pre>

<h3>6. Menjalankan Aplikasi</h3>
<p>Jalankan perintah berikut untuk memulai server lokal:</p>
<pre><code>php artisan serve</code></pre>

<p>Dan jalankan frontend menggunakan:</p>
<pre><code>npm run dev
# atau jika menggunakan yarn
yarn dev</code></pre>

<p>Aplikasi dapat diakses di <code>http://localhost:8000</code>.</p>

<h2>Penggunaan</h2>
<p>Setelah aplikasi berhasil diinstal, Anda dapat mulai menggunakan fitur-fitur yang tersedia untuk mengelola stok barang.</p>

<h2>Contributing</h2>
<p>Jika Anda ingin berkontribusi pada proyek ini, harap baca terlebih dahulu panduan kontribusi di <code>CONTRIBUTING.md</code>.</p>

<h2>Lisensi</h2>
<p>Proyek ini dilisensikan di bawah <a href="LICENSE">MIT License</a>.</p>
