import io
import logging
from openai import OpenAI
from config import settings

logger = logging.getLogger(__name__)


def get_openai_client() -> OpenAI:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY가 설정되지 않았습니다")
    return OpenAI(api_key=settings.openai_api_key)


def transcribe_audio(audio_bytes: bytes, filename: str = "recording.webm") -> str:
    """Whisper API로 오디오를 텍스트로 변환"""
    client = get_openai_client()
    audio_file = io.BytesIO(audio_bytes)
    audio_file.name = filename

    response = client.audio.transcriptions.create(
        model=settings.whisper_model,
        file=audio_file,
        language="ko",
        response_format="verbose_json",
        timestamp_granularities=["segment"],
    )

    # Build timestamped transcript
    lines = []
    if hasattr(response, "segments") and response.segments:
        for seg in response.segments:
            mins = int(seg["start"] // 60)
            secs = int(seg["start"] % 60)
            lines.append(f"[{mins:02d}:{secs:02d}] {seg['text'].strip()}")
    else:
        lines.append(response.text)

    return "\n".join(lines)


def generate_minutes_from_transcript(
    transcript: str,
    meeting_name: str,
    participants: list[str],
    started_at: str,
    ended_at: str,
) -> tuple[str, str]:
    """GPT로 회의록 생성. Returns (title, content) in markdown."""
    client = get_openai_client()

    prompt = f"""다음은 '{meeting_name}' 회의의 음성 녹음 전사본입니다.
이 전사본을 기반으로 전문적인 회의록을 한국어로 작성해주세요.

**회의 정보:**
- 회의명: {meeting_name}
- 참여자: {', '.join(participants)}
- 시작: {started_at}
- 종료: {ended_at}

**전사본:**
{transcript}

**회의록 형식 (마크다운):**
1. # 제목
2. 회의 기본 정보 (유형, 참여자, 시간)
3. ## 주요 안건 — 논의된 주제별로 정리
4. ## 결정 사항 — 합의된 내용
5. ## 액션 아이템 — 후속 조치가 필요한 항목
6. ## 요약 — 전체 회의 요약 (3~5줄)

중요: 전사본의 내용을 충실히 반영하되, 불필요한 추임새나 반복은 정리해주세요."""

    response = client.chat.completions.create(
        model=settings.openai_model,
        messages=[
            {"role": "system", "content": "당신은 전문 회의록 작성자입니다. 음성 전사본을 구조화된 회의록으로 변환합니다."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
        max_tokens=4000,
    )

    content = response.choices[0].message.content or ""
    title = f"{meeting_name} — 회의록 ({started_at})"

    return title, content
