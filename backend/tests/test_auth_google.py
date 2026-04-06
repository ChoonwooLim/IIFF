from unittest.mock import patch

MOCK_GOOGLE_USER = {
    "sub": "google_test_123",
    "email": "googleuser@gmail.com",
    "name": "Google 사용자",
    "picture": "https://lh3.googleusercontent.com/photo.jpg",
}


def test_google_callback_new_user(client):
    with patch("routers.auth.exchange_google_code") as mock_exchange:
        mock_exchange.return_value = MOCK_GOOGLE_USER
        response = client.post("/api/auth/google/callback", json={
            "code": "fake_auth_code",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["is_new"] is True
        assert data["needs_profile"] is True
        assert "temp_token" in data


def test_google_callback_existing_active_user(client):
    with patch("routers.auth.exchange_google_code") as mock_exchange:
        mock_exchange.return_value = MOCK_GOOGLE_USER

        # First call — creates user
        resp1 = client.post("/api/auth/google/callback", json={"code": "fake"})
        temp_token = resp1.json()["temp_token"]

        # Complete profile
        client.post(
            "/api/auth/google/complete-profile",
            json={"nickname": "구글유저", "phone": "010-1111-0000"},
            headers={"Authorization": f"Bearer {temp_token}"},
        )

        # Activate user
        from tests.conftest import override_activate_user_by_email
        override_activate_user_by_email(client, "googleuser@gmail.com")

        # Second call — existing active user, should return access_token
        resp2 = client.post("/api/auth/google/callback", json={"code": "fake"})
        assert resp2.status_code == 200
        assert "access_token" in resp2.json()
