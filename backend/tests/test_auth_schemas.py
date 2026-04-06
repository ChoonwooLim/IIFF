import pytest
from schemas.auth import LocalRegisterRequest

def test_valid_registration():
    data = LocalRegisterRequest(
        username="testuser",
        password="Test1234!",
        email="test@example.com",
        name="홍길동",
        nickname="길동이",
        phone="010-1234-5678",
    )
    assert data.username == "testuser"

def test_username_too_short():
    with pytest.raises(ValueError, match="4~20자"):
        LocalRegisterRequest(
            username="ab",
            password="Test1234!",
            email="test@example.com",
            name="홍길동",
            nickname="길동이",
            phone="010-1234-5678",
        )

def test_password_no_special_char():
    with pytest.raises(ValueError, match="특수문자"):
        LocalRegisterRequest(
            username="testuser",
            password="Test12345",
            email="test@example.com",
            name="홍길동",
            nickname="길동이",
            phone="010-1234-5678",
        )

def test_nickname_too_short():
    with pytest.raises(ValueError, match="2~20자"):
        LocalRegisterRequest(
            username="testuser",
            password="Test1234!",
            email="test@example.com",
            name="홍길동",
            nickname="길",
            phone="010-1234-5678",
        )
