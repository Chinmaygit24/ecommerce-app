# Ecommerce Backend (Spring Boot)

REST API powering a full-featured ecommerce platform: JWT authentication, product catalog with search/pagination,
cart, checkout, and order management with an admin role.

## Tech Stack
- Java 17, Spring Boot 3.3
- Spring Security + JWT (jjwt)
- Spring Data JPA + PostgreSQL
- Maven

## Local Setup
1. Create a PostgreSQL database named `ecommerce_db`
2. Set environment variables (or edit `application.properties` directly for local dev):
   - `DB_URL=jdbc:postgresql://localhost:5432/ecommerce_db`
   - `DB_USERNAME=postgres`
   - `DB_PASSWORD=yourpassword`
   - `JWT_SECRET=any-long-random-string`
3. Run: `mvn spring-boot:run`
4. API available at `http://localhost:8080`

## Key Endpoints
| Method | Endpoint | Auth |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/products?name=&categoryId=&page=&size= | Public |
| GET | /api/products/{id} | Public |
| POST/PUT/DELETE | /api/admin/products | Admin |
| GET/POST | /api/cart | User |
| PUT/DELETE | /api/cart/{id} | User |
| POST | /api/orders/checkout | User |
| GET | /api/orders | User |
| GET | /api/admin/orders | Admin |
| PUT | /api/admin/orders/{id}/status | Admin |

## Deployment (Render)
1. Push this repo to GitHub
2. Render → New → Web Service → connect repo
3. Build command: `mvn clean package -DskipTests`
4. Start command: `java -jar target/ecommerce-backend-1.0.0.jar`
5. Add a Render PostgreSQL instance, then set the environment variables above using its connection details
6. Set `CORS_ALLOWED_ORIGINS` to your deployed Netlify frontend URL
