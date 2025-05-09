# 1. Authentication
## 1.1. Register
### POST /api/auth/register

### Request:

```json
{
    "username" : "minhhuy",
    "fullname": "Le Minh Huy",
    "password": "123456789",
    "email": "minhhuy.97@gmail.com"
}
```

### Response:

```json
{
    "message": "New user created",
    "user": {
        "id": "68186b9e0adabaddf0bf4b09",
        "fullname": "Le Minh Huy",
        "username": "minhhuy",
        "email": "minhhuy.97@gmail.com"
    }
}
```

## 1.2. Local login
### POST /api/auth/login/local

### Request: 

```json
{
    "username": "minhhuy",
    "password": "123456789"
}
```

### Response Cookie:
- refreshToken
- accessToken

## 1.3. Logout
### GET /api/auth/logout

## 1.4. Refresh Token
### GET /api/auth/refresh-token

# 2. Voice
## 2.1. Get list of sample voices
### GET /api/voices/sample

### Query Parameters

- **page**: Page number to retrieve (default: 1) 
- **per_page**: Number of items per page (default: 5)

### Response

```json
{
    "page": 1,
    "total_pages": 4,
    "per_page": 3,
    "voices": [
        {
            "_id": "681e25c33d7be1d6da1c25f0",
            "name": "Arista-PlayAI",
            "url": "http://res.cloudinary.com/dvar3w9dm/video/upload/v1746806282/yl0rpkpoi8tfq7k4w9gv.mp3"
        },
        {
            "_id": "681e26633d7be1d6da1c25f1",
            "name": "Atlas-PlayAI",
            "url": "http://res.cloudinary.com/dvar3w9dm/video/upload/v1746806368/fddkoxgoxrkodm5rqtdr.mp3"
        },
        {
            "_id": "681e26813d7be1d6da1c25f2",
            "name": "Basil-PlayAI",
            "url": "http://res.cloudinary.com/dvar3w9dm/video/upload/v1746806430/bgrmawea6qn4d56akzk5.mp3"
        }
    ]
}
```