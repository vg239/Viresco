from fastapi import FastAPI
from .api.learn_routes.routes import router as learn_router
from .api.news_routes.routes import router as news_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(learn_router, prefix="/api",tags=["learn"])
app.include_router(news_router, prefix="/news",tags=["news"])

