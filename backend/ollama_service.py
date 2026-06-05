# import json
# import re
# import httpx
# from config import settings
 
 
# async def call_ollama(resume_text: str, jd_text: str, scores: dict) -> dict:
#     """Call Ollama llama3 for AI-powered improvement suggestions."""
#     has_jd = bool(jd_text and len(jd_text) > 20)
 
#     # Keep prompt short for speed — only first 1500 chars of resume
#     prompt = f"""You are a resume coach. Analyze this resume and return ONLY a JSON object.
 
# RESUME (excerpt):
# {resume_text[:1500]}
 
# {"JOB DESCRIPTION: " + jd_text[:800] if has_jd else ""}
 
# Return ONLY this JSON, no extra text, no markdown:
# {{
#   "improvements": [
#     {{"level": "critical", "title": "title max 6 words", "detail": "one actionable sentence"}},
#     {{"level": "warn", "title": "title max 6 words", "detail": "one actionable sentence"}},
#     {{"level": "warn", "title": "title max 6 words", "detail": "one actionable sentence"}},
#     {{"level": "good", "title": "title max 6 words", "detail": "one actionable sentence"}},
#     {{"level": "critical", "title": "title max 6 words", "detail": "one actionable sentence"}},
#     {{"level": "good", "title": "title max 6 words", "detail": "one actionable sentence"}}
#   ],
#   "summary": "2 sentences max about strengths and top priority.",
#   "jobTitle": "target job title"
# }}"""
 
#     try:
#         async with httpx.AsyncClient(timeout=60.0) as client:
#             resp = await client.post(
#                 f"{settings.OLLAMA_BASE_URL}/api/generate",
#                 json={
#                     "model": settings.OLLAMA_MODEL,
#                     "prompt": prompt,
#                     "stream": False,
#                     "options": {
#                         "temperature": 0.1,
#                         "num_predict": 400,
#                         "num_ctx": 2048,
#                     },
#                 },
#             )
#             resp.raise_for_status()
#             raw = resp.json().get("response", "")
 
#         raw = re.sub(r"```json|```", "", raw).strip()
#         start = raw.find("{")
#         end   = raw.rfind("}")
#         if start == -1 or end == -1:
#             raise ValueError("No JSON in response")
 
#         data = json.loads(raw[start : end + 1])
#         improvements = data.get("improvements", [])
 
#         return {
#             "improvements": improvements,
#             "summary":  data.get("summary", "Analysis complete."),
#             "jobTitle": data.get("jobTitle", "Professional"),
#         }
 
#     except (httpx.ConnectError, httpx.TimeoutException) as e:
#         print(f"Ollama connection error: {e}")
#         return _ml_only_result(scores)
#     except Exception as e:
#         print(f"Ollama error: {e}")
#         return _ml_only_result(scores)
 
 
# def _ml_only_result(scores: dict) -> dict:
#     """Return ML-based suggestions when Ollama is unavailable."""
#     improvements = []
 
#     if scores.get("impactScore", 0) < 60:
#         improvements.append({"level": "critical", "title": "Quantify your achievements", "detail": "Add numbers and percentages to every bullet point (e.g. 'Improved performance by 35%')."})
#     else:
#         improvements.append({"level": "good", "title": "Good use of metrics", "detail": "Your resume uses measurable achievements effectively."})
 
#     if scores.get("skillsScore", 0) < 60:
#         improvements.append({"level": "critical", "title": "Expand your skills section", "detail": "List more relevant technical and soft skills matching your target role."})
#     else:
#         improvements.append({"level": "good", "title": "Strong skills section", "detail": "Good keyword coverage detected in your skills section."})
 
#     if scores.get("summaryScore", 0) < 60:
#         improvements.append({"level": "warn", "title": "Add a professional summary", "detail": "Write 2-3 lines at the top describing your role, years of experience, and top strength."})
#     else:
#         improvements.append({"level": "good", "title": "Summary present", "detail": "Your professional summary helps recruiters quickly understand your profile."})
 
#     if scores.get("experienceScore", 0) < 60:
#         improvements.append({"level": "warn", "title": "Strengthen work experience", "detail": "Use strong action verbs like 'Led', 'Built', 'Delivered' to start each bullet."})
#     else:
#         improvements.append({"level": "good", "title": "Good experience section", "detail": "Work experience uses clear action-oriented language."})
 
#     if scores.get("formattingScore", 0) < 60:
#         improvements.append({"level": "warn", "title": "Improve resume formatting", "detail": "Ensure consistent fonts, spacing, and clear section headings throughout."})
#     else:
#         improvements.append({"level": "good", "title": "Clean formatting", "detail": "Resume structure and length are well-optimised for ATS systems."})
 
#     if scores.get("educationScore", 0) < 60:
#         improvements.append({"level": "warn", "title": "Add education details", "detail": "Include your degree, institution name, and graduation year clearly."})
#     else:
#         improvements.append({"level": "good", "title": "Education clearly listed", "detail": "Education section is well-structured and complete."})
 
#     return {
#         "improvements": improvements[:6],
#         "summary": f"Resume scored {scores.get('overallScore', 0)}/100 overall with an ATS score of {scores.get('atsScore', 0)}/100. Focus on quantifying achievements and expanding your skills section for best results.",
#         "jobTitle": "Professional",
#     }


import json
import re
import httpx
from config import settings

async def call_ollama(resume_text: str, jd_text: str, scores: dict) -> dict:
    has_jd = bool(jd_text and len(jd_text) > 20)

    prompt = f"""You are a resume coach. Analyze this resume and return ONLY a JSON object.

RESUME (excerpt):
{resume_text[:1500]}

{"JOB DESCRIPTION: " + jd_text[:800] if has_jd else ""}

Return ONLY this JSON, no extra text, no markdown:
{{
  "improvements": [
    {{"level": "critical", "title": "title max 6 words", "detail": "one actionable sentence"}},
    {{"level": "warn", "title": "title max 6 words", "detail": "one actionable sentence"}},
    {{"level": "warn", "title": "title max 6 words", "detail": "one actionable sentence"}},
    {{"level": "good", "title": "title max 6 words", "detail": "one actionable sentence"}},
    {{"level": "critical", "title": "title max 6 words", "detail": "one actionable sentence"}},
    {{"level": "good", "title": "title max 6 words", "detail": "one actionable sentence"}}
  ],
  "summary": "2 sentences max about strengths and top priority.",
  "jobTitle": "target job title"
}}"""

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3-8b-8192",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3,
                "max_tokens": 1000
            }
        )
        resp.raise_for_status()
        data = resp.json()

    text = data["choices"][0]["message"]["content"]
    text = re.sub(r"```json|```", "", text).strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {
            "improvements": [],
            "summary": "Analysis completed.",
            "jobTitle": "Professional"
        }