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

class AnswerRequest(BaseModel):
    Set: Dict[str,str]
    chapter: str

class AnswerResponse(BaseModel):
    Scores: Dict[str, int]
    Evaluation: str

Learner = CourseBuilder()

@router.post("/learn")
async def learn(request: LearnRequest):
    Learner.set_query(request.query)
    syllabus = Learner.PlanSyllabus()
    chapters = Learner.BuildChapters()
    questions = Learner.GenerateQuestions()
    return LearnResponse(syllabus=syllabus, chapters=chapters, questions=questions)

@router.post("/evaluate")
async def evaluate(request: AnswerRequest):
    scores = Learner.get_scores(request.Set, request.chapter)
    summary = Learner.get_eval(request.Set, request.chapter)
    return AnswerResponse(Scores=scores, Evaluation=summary)