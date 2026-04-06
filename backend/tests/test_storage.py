import os
import tempfile
import pytest
from io import BytesIO
from unittest.mock import MagicMock
from services.storage import LocalStorage, get_upload_directory

@pytest.fixture()
def temp_storage():
    with tempfile.TemporaryDirectory() as tmpdir:
        storage = LocalStorage(base_path=tmpdir)
        yield storage, tmpdir

def _make_upload_file(filename: str, content: bytes) -> MagicMock:
    mock = MagicMock()
    mock.filename = filename
    mock.file = BytesIO(content)
    mock.content_type = "application/octet-stream"
    return mock

def test_upload_file(temp_storage):
    storage, tmpdir = temp_storage
    fake_file = _make_upload_file("test.pdf", b"hello world")
    stored_name, file_path, file_size = storage.upload(fake_file, "documents")
    assert stored_name.endswith(".pdf")
    assert os.path.exists(file_path)
    assert file_size == 11

def test_delete_file(temp_storage):
    storage, tmpdir = temp_storage
    fake_file = _make_upload_file("delete_me.txt", b"data")
    _, file_path, _ = storage.upload(fake_file, "documents")
    assert storage.delete(file_path) is True
    assert not os.path.exists(file_path)

def test_delete_nonexistent_file(temp_storage):
    storage, _ = temp_storage
    assert storage.delete("/nonexistent/file.txt") is False

def test_get_upload_directory():
    assert get_upload_directory("image", ".jpg") == "images"
    assert get_upload_directory("archive", ".pdf") == "documents"
    assert get_upload_directory("general", ".png") == "images"
