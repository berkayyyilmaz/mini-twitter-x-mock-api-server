# Sample API Responses & Request Data Objects:

## Profile

**Register**

- **Endpoint**: `${URL}/profile/register`
- **Method**: POST

**Request**:

```json
{
  "username": "exampleUser",
  "password": "examplePass123",
  "email": "user@example.com"
}
```

**Response**:

```json
{
  "status": "success",
  "message": "User registered successfully.",
  "data": {
    "id": 1,
    "username": "exampleUser",
    "email": "user@example.com"
  }
}
```

**Giriş Yap (Login)**

- **Endpoint**: `${URL}/profile/login`
- **Method**: POST

**Request**:

```json
{
  "username": "exampleUser",
  "password": "examplePass123"
}
```

**Response**:

```json
{
  "status": "success",
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Çıkış Yap (Logout)**

- **Endpoint**: `${URL}/profile/logout`
- **Method**: POST

**Request**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:

```json
{
  "status": "success",
  "message": "Logged out successfully."
}
```

## Tweet
