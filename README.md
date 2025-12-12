# Movie Recommendation Web Application

A full-stack application built with Spring Boot and React that allows users to register, login, search for movies via OMDb API, and save favorites.

## Tech Stack
- **Backend:** Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA, H2 Database.
- **Frontend:** React 18, Vite, Bootstrap 5, Axios, React Router.
- **CI/CD:** GitHub Actions.

## Prerequisites
- Java 17+
- Node.js 18+
- Maven

## Setup & Running

### Backend
1. Navigate to `backend/`.
2. Open `src/main/resources/application.properties` and replace `REPLACE_WITH_YOUR_KEY` with your actual OMDb API key.
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   Server runs on `http://localhost:8080`.

### Frontend
1. Navigate to `frontend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Client runs on `http://localhost:3000` (or `http://localhost:5173` depending on Vite config).

## API Endpoints
- `POST /api/auth/signup` - Register a new user.
- `POST /api/auth/signin` - Login and get JWT.
- `GET /api/movies/search?title={title}` - Search for movies.
- `GET /api/movies/favorites` - Get user favorites.
- `POST /api/movies/favorites` - Add a favorite.

## CI/CD
The `.github/workflows/deploy.yml` pipeline automatically builds the backend and frontend on push to `main`.
