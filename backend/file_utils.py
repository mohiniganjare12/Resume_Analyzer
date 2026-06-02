import io
from typing import Tuple
from fastapi import UploadFile, HTTPException


async def extract_text(file: UploadFile) -> str:
    """Extract plain text from PDF, DOCX, or TXT upload."""
    content = await file.read()
    filename = (file.filename or "").lower()

    if filename.endswith(".pdf") or file.content_type == "application/pdf":
        return _extract_pdf(content)

    if filename.endswith(".docx") or "wordprocessingml" in (file.content_type or ""):
        return _extract_docx(content)

    # Fallback: plain text
    try:
        return content.decode("utf-8")
    except UnicodeDecodeError:
        return content.decode("latin-1", errors="ignore")


def _extract_pdf(content: bytes) -> str:
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            text = "\n".join(
                page.extract_text() or "" for page in pdf.pages
            )
        if not text.strip():
            raise HTTPException(400, "PDF appears to be image-only. Please use a text-based PDF or DOCX.")
        return text
    except ImportError:
        raise HTTPException(500, "pdfplumber not installed. Run: pip install pdfplumber")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(400, f"Could not read PDF: {str(e)}")


def _extract_docx(content: bytes) -> str:
    try:
        from docx import Document
        doc = Document(io.BytesIO(content))
        return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    except ImportError:
        raise HTTPException(500, "python-docx not installed. Run: pip install python-docx")
    except Exception as e:
        raise HTTPException(400, f"Could not read DOCX: {str(e)}")
