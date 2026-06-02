import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from database import get_db, User, Analysis
from auth_utils import get_current_user
from file_utils import extract_text
from ml_scorer import compute_ml_scores
from ollama_service import call_ollama
from schemas import AnalysisHistoryItem

router = APIRouter(prefix="/api/analyze", tags=["analyze"])

@router.post("/")
async def analyze_resume(
    resume: UploadFile = File(...),
    jobDescription: Optional[UploadFile] = File(None),
    jobDescriptionText: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    resume_text = await extract_text(resume)
    if not resume_text or len(resume_text.strip()) < 50:
        raise HTTPException(400, "Could not extract text. Try a .txt or .docx file.")

    jd_text = jobDescriptionText or ""
    if jobDescription and jobDescription.filename:
        jd_text = await extract_text(jobDescription)

    scores = compute_ml_scores(resume_text, jd_text)
    ai_data = await call_ollama(resume_text, jd_text, scores)
    full_result = {**scores, **ai_data}

    analysis = Analysis(
        user_id=current_user.id,
        resume_filename=resume.filename,
        job_title=ai_data.get("jobTitle"),
        overall_score=scores["overallScore"],
        ats_score=scores["atsScore"],
        match_score=scores.get("matchScore"),
        impact_score=scores["impactScore"],
        skills_score=scores["skillsScore"],
        experience_score=scores["experienceScore"],
        education_score=scores["educationScore"],
        formatting_score=scores["formattingScore"],
        summary_score=scores["summaryScore"],
        result_json=json.dumps(full_result),
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(analysis)
    return {"success": True, "result": full_result, "id": analysis.id}

@router.get("/history", response_model=List[AnalysisHistoryItem])
async def get_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Analysis)
        .where(Analysis.user_id == current_user.id)
        .order_by(desc(Analysis.created_at))
        .limit(20)
    )
    rows = result.scalars().all()
    return [AnalysisHistoryItem.model_validate(r) for r in rows]

@router.get("/{analysis_id}")
async def get_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Analysis).where(
            Analysis.id == analysis_id,
            Analysis.user_id == current_user.id,
        )
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(404, "Analysis not found")
    return {
        "analysis": {
            **{c.name: getattr(analysis, c.name) for c in Analysis.__table__.columns},
            "result": json.loads(analysis.result_json or "{}"),
        }
    }
