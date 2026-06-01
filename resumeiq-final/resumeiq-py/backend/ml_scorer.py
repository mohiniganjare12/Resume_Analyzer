import re
from typing import Optional

TECH_KEYWORDS = [
    "python", "javascript", "java", "react", "node", "sql", "aws", "docker",
    "kubernetes", "git", "typescript", "mongodb", "postgresql", "redis",
    "graphql", "rest", "api", "agile", "scrum", "ci/cd", "machine learning",
    "data analysis", "cloud", "microservices", "linux", "css", "html",
    "figma", "jira", "tensorflow", "pytorch", "fastapi", "django", "flask",
    "spring", "angular", "vue", "devops", "azure", "gcp",
]

SOFT_KEYWORDS = [
    "leadership", "communication", "teamwork", "problem-solving", "analytical",
    "collaboration", "management", "strategic", "innovative", "detail-oriented",
    "mentoring", "cross-functional", "organized", "proactive",
]

SECTION_PATTERNS = {
    "experience": re.compile(r"work\s*experience|employment|professional\s*experience|career", re.I),
    "education":  re.compile(r"education|academic|degree|university|college|bachelor|master|phd", re.I),
    "skills":     re.compile(r"skills|technologies|technical|competencies|expertise|proficiencies", re.I),
    "summary":    re.compile(r"summary|objective|profile|about\s*me|overview|professional\s*summary", re.I),
    "projects":   re.compile(r"projects|portfolio|work\s*samples|personal\s*projects", re.I),
    "certifications": re.compile(r"certifications?|licenses?|credentials|awards", re.I),
}

QUANTIFIED_PATTERN = re.compile(
    r"\d+%|\d+\+|\$[\d,]+|\d+x|increased|reduced|improved|led\s+\d+|managed\s+\d+|saved|grew|boosted", re.I
)
ACTION_VERBS = re.compile(
    r"\b(developed|built|designed|implemented|led|managed|created|optimized|improved|"
    r"delivered|launched|architected|engineered|automated|reduced|increased|deployed|"
    r"collaborated|mentored|streamlined|spearheaded|coordinated)\b", re.I
)
EMAIL_PATTERN = re.compile(r"[\w.\-]+@[\w.\-]+\.\w+")
PHONE_PATTERN = re.compile(r"\b\d{3}[\-.\s]?\d{3}[\-.\s]?\d{4}\b")


def compute_ml_scores(resume_text: str, jd_text: Optional[str] = None) -> dict:
    text_lower = resume_text.lower()
    words = resume_text.split()
    word_count = len(words)

    # Keywords found
    tech_found = [k for k in TECH_KEYWORDS if k in text_lower]
    soft_found = [k for k in SOFT_KEYWORDS if k in text_lower]
    has_quantified = bool(QUANTIFIED_PATTERN.search(resume_text))
    has_action_verbs = bool(ACTION_VERBS.search(resume_text))
    sections_found = [name for name, pat in SECTION_PATTERNS.items() if pat.search(resume_text)]
    has_email = bool(EMAIL_PATTERN.search(resume_text))
    has_phone = bool(PHONE_PATTERN.search(resume_text))

    # JD matching
    match_score = None
    jd_keywords = []
    matched_jd = []
    if jd_text and len(jd_text) > 20:
        jd_lower = jd_text.lower()
        jd_keywords = [k for k in TECH_KEYWORDS if k in jd_lower]
        matched_jd = [k for k in jd_keywords if k in text_lower]
        match_score = min(100, round((len(matched_jd) / len(jd_keywords)) * 100)) if jd_keywords else None

    # Missing keywords
    if jd_keywords:
        missing = [k for k in jd_keywords if k not in text_lower][:8]
    else:
        missing = [k for k in TECH_KEYWORDS if k not in text_lower][:6]

    # ATS checks
    ats_checks_raw = [
        (len(resume_text) > 200,            "Sufficient content length"),
        (not re.search(r"\t{3,}", resume_text), "No excessive whitespace/tables"),
        ("experience" in sections_found,    "Work experience section found"),
        ("skills" in sections_found,        "Skills section found"),
        ("education" in sections_found,     "Education section found"),
        (has_email,                         "Email address present"),
        (has_phone or "linkedin" in text_lower, "Contact info (phone/LinkedIn)"),
        (200 < word_count < 1500,           "Optimal resume length"),
    ]
    ats_checks = [{"pass": p, "text": t} for p, t in ats_checks_raw]
    ats_score = round(sum(1 for p, _ in ats_checks_raw if p) / len(ats_checks_raw) * 100)

    # Section scores
    tech_score   = min(100, round(len(tech_found) / 8 * 100))
    soft_score   = min(100, round(len(soft_found) / 5 * 100))
    section_score = min(100, round(len(sections_found) / 5 * 100))
    length_score  = 90 if 300 < word_count < 1200 else (40 if word_count < 150 else 70)
    quant_score   = 80 if has_quantified else 30
    action_score  = 85 if has_action_verbs else 45

    skills_score     = round(tech_score * 0.6 + soft_score * 0.4)
    experience_score = round(quant_score * 0.5 + action_score * 0.5)
    education_score  = 85 if "education" in sections_found else 30
    formatting_score = round(length_score * 0.5 + section_score * 0.5)
    summary_score    = 80 if "summary" in sections_found else 35
    impact_score     = round(quant_score * 0.7 + action_score * 0.3)
    overall_score    = round(
        skills_score     * 0.25 +
        experience_score * 0.30 +
        formatting_score * 0.20 +
        impact_score     * 0.15 +
        education_score  * 0.10
    )

    matched_keywords = list(dict.fromkeys(tech_found[:8] + soft_found[:4]))

    return {
        "overallScore":    overall_score,
        "atsScore":        ats_score,
        "matchScore":      match_score,
        "impactScore":     impact_score,
        "skillsScore":     skills_score,
        "experienceScore": experience_score,
        "educationScore":  education_score,
        "formattingScore": formatting_score,
        "summaryScore":    summary_score,
        "matchedKeywords": matched_keywords,
        "missingKeywords": missing,
        "atsChecks":       ats_checks,
        "sections": [
            {"name": "Work Experience", "score": experience_score, "color": "#2563eb"},
            {"name": "Skills",          "score": skills_score,     "color": "#7c3aed"},
            {"name": "Education",       "score": education_score,  "color": "#059669"},
            {"name": "Summary",         "score": summary_score,    "color": "#d97706"},
            {"name": "Formatting",      "score": formatting_score, "color": "#dc2626"},
        ],
    }
