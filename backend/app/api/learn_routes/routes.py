from fastapi import APIRouter
from ...learning_module.learn import CourseBuilder
from pydantic import BaseModel
from typing import Dict
router = APIRouter()

class LearnRequest(BaseModel):
    query: str

class LearnResponse(BaseModel):
    syllabus: Dict[str, str]
    chapters: Dict[str, str]
    questions: Dict[str, str]

@router.post("/learn")
async def learn(request: LearnRequest):
    Learner = CourseBuilder(request.query)
    syllabus = Learner.PlanSyllabus()
    chapters = Learner.BuildChapters()
    questions = Learner.GenerateQuestions()
    return LearnResponse(syllabus=syllabus, chapters=chapters, questions=questions)
