import pytest
from datetime import timedelta

def test_password_hashing():
    from services.auth_service import hash_password, verify_password
    password = "TestPass123!"
    hashed = hash_password(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_password", hashed) is False

def test_create_access_token():
    from services.auth_service import create_access_token, decode_token
    token = create_access_token(data={"sub": "1", "role": "user"})
    payload = decode_token(token)
    assert payload is not None
    assert payload["sub"] == "1"
    assert payload["role"] == "user"
    assert "exp" in payload

def test_create_refresh_token():
    from services.auth_service import create_refresh_token, decode_token
    token = create_refresh_token(data={"sub": "1"})
    payload = decode_token(token)
    assert payload is not None
    assert payload["sub"] == "1"
    assert payload["type"] == "refresh"

def test_expired_token():
    from services.auth_service import create_access_token, decode_token
    token = create_access_token(data={"sub": "1", "role": "user"}, expires_delta=timedelta(seconds=-1))
    payload = decode_token(token)
    assert payload is None

def test_invalid_token():
    from services.auth_service import decode_token
    payload = decode_token("invalid.token.here")
    assert payload is None
