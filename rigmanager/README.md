# Point of Sale (POS) System

This is a Laravel-based Point of Sale (POS) system application. It allows for managing products, categories, transactions, and user roles. The system includes a builder for creating custom product bundles and a POS interface for processing sales.

## Getting Started

To run this project locally, ensure you have PHP, Composer, and Node.js installed on your machine.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/pos-system-laravel.git
    cd pos-system-laravel/rigmanager
    ```
2.  **Install PHP dependencies:**
    ```bash
    composer install
    ```
3.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```
4.  **Create a .env file:**
    Copy the `.env.example` file to `.env` and configure your database settings.
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```
5.  **Run the application:**
    Open two terminals in the `rigmanager` directory and run the following commands:
    
    Terminal 1 (Serve):
    ```bash
    php artisan serve
    ```
    
    Terminal 2 (Assets):
    ```bash
    npm run dev
    ```
6.  **Access the application:**
    The application should now be accessible in your web browser at `http://127.0.0.1:8000`.
