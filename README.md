<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>



# Point of Sale (POS) System

This is a Laravel-based Point of Sale (POS) system application. It allows for managing products, categories, transactions, and user roles. The system includes a builder for creating custom product bundles and a POS interface for processing sales.

## Running with Docker

To run this project using Docker, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/pos-system-laravel.git
    cd pos-system-laravel
    ```
2.  **Create a .env file:**
    Copy the `.env.example` file to `.env` in the `rigmanager` directory and update the database credentials if necessary.
    ```bash
    cp rigmanager/.env.example rigmanager/.env
    ```
3.  **Build and run Docker containers:**
    ```bash
    docker-compose up --build -d
    ```
4.  **Install Composer dependencies:**
    ```bash
    docker-compose exec app composer install
    ```
5.  **Generate application key:**
    ```bash
    docker-compose exec app php artisan key:generate
    ```
6.  **Run database migrations and seeders:**
    ```bash
    docker-compose exec app php artisan migrate --seed
    ```
7.  **Install NPM dependencies and build assets:**
    ```bash
    docker-compose exec app npm install
    docker-compose exec app npm run build
    ```
8.  **Access the application:**
    The application should now be accessible in your web browser at `http://localhost`.

