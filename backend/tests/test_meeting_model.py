import pytest
from models.user import User
from models.meeting import Meeting
from models.meeting_participant import MeetingParticipant
from models.chat_message import ChatMessage


def make_user(db_session, suffix: str) -> User:
    user = User(
        auth_provider="local",
        username=f"user_{suffix}",
        password_hash="hashed",
        email=f"user_{suffix}@example.com",
        name=f"Test User {suffix}",
        nickname=f"nick_{suffix}",
        phone="010-0000-0000",
    )
    db_session.add(user)
    db_session.flush()
    return user


def test_create_video_meeting(db_session):
    user = make_user(db_session, "vm1")
    meeting = Meeting(
        name="Video Meeting",
        type="video",
        created_by=user.id,
    )
    db_session.add(meeting)
    db_session.flush()

    assert meeting.id is not None
    assert meeting.status == "active"
    assert meeting.max_participants == 10


def test_create_text_meeting(db_session):
    user = make_user(db_session, "tm1")
    meeting = Meeting(
        name="Text Meeting",
        type="text",
        created_by=user.id,
    )
    db_session.add(meeting)
    db_session.flush()

    assert meeting.jitsi_room_id is None


def test_add_participant(db_session):
    user = make_user(db_session, "p1")
    meeting = Meeting(
        name="Participant Meeting",
        type="video",
        created_by=user.id,
    )
    db_session.add(meeting)
    db_session.flush()

    participant = MeetingParticipant(
        meeting_id=meeting.id,
        user_id=user.id,
    )
    db_session.add(participant)
    db_session.flush()

    assert participant.id is not None
    assert participant.left_at is None


def test_create_chat_message(db_session):
    user = make_user(db_session, "cm1")
    meeting = Meeting(
        name="Chat Meeting",
        type="text",
        created_by=user.id,
    )
    db_session.add(meeting)
    db_session.flush()

    message = ChatMessage(
        meeting_id=meeting.id,
        user_id=user.id,
        content="Hello, world!",
    )
    db_session.add(message)
    db_session.flush()

    assert message.id is not None
    assert message.content == "Hello, world!"
