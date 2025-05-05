# 1. Authentication
## 1.1. Register
POST /api/auth/register

Request:

```json
{
    "username" : "minhhuy",
    "fullname": "Le Minh Huy",
    "password": "123456789",
    "email": "minhhuy.97@gmail.com"
}
```

Response:

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