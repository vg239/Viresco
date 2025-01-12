import time
import random
import json
from typing import Dict
from phi.agent import Agent, RunResponse
from phi.model.google import Gemini
import os
from dotenv import load_dotenv
import re
import concurrent.futures
from google.api_core.exceptions import InternalServerError

load_dotenv()

class CourseBuilder:

    def __init__(self):
        self.agent = Agent(
            model=Gemini(id="gemini-2.0-flash-exp", api_key=os.getenv("GEMINI_API_KEY"))
        )
        self.chapters = {}

    def set_query(self, query):
        self.query = query

    def PlanSyllabus(self):
        prompt = (
            "You are an expert course syllabus planner tasked with creating a detailed and well-structured course plan. "
            f"The client has provided the following requirement: {self.query}. "
            "Your job is to design a comprehensive course outline that is thoroughly organized and progresses logically from basic to advanced concepts. "
            "The course should be broken down into chapters, with each chapter representing a small, manageable section of content that can fit on approximately one page. "
            "Ensure the following guidelines are adhered to when creating the course plan:" 
            "\n1. The total number of chapters must be 5." 
            "\n2. Each chapter should focus on a specific topic, and the topics should collectively cover the entire scope of the course in a systematic and cohesive manner." 
            "\n3. Begin with foundational topics to build a strong base and gradually move toward more complex or advanced material." 
            "\n4. Use clear and concise phrasing for chapter titles to ensure their purpose is immediately understood." 
            "\n5. Ensure there is no overlap or redundancy between chapters, maintaining a logical flow throughout the course." 
            "\n\nThe course outline should be presented in the following format:" 
            "\n\nChapter 1: Title of the first chapter." 
            "\nChapter 2: Title of the second chapter." 
            "\n...\nChapter n: Title of the nth chapter." 
            "\n\nRemember, the objective is to create a course outline that is well-balanced, informative, and easy to follow while ensuring each chapter is appropriately scoped for a single-page content limit."
        )

        run: RunResponse = self.agent.run(prompt)
        output = run.content

        chapter_dict = {}
        chapter_pattern = r"Chapter\s*(\d+):\s*(.+)"
        matches = re.finditer(chapter_pattern, output)

        for match in matches:
            chapter_number = f"chapter{match.group(1).strip()}"
            chapter_title = match.group(2).strip()
            chapter_dict[chapter_number] = chapter_title
                
        self.chapters = chapter_dict

        with open("course.json", "w") as file:
            json.dump({"syllabus": chapter_dict}, file, indent=4)

        return chapter_dict

    def BuildChapters(self):
        if not self.chapters:
            raise ValueError("Chapters have not been created. Run PlanSyllabus() first.")

        chapters_list = list(self.chapters.items())
        total_chapters = len(chapters_list)
        workers = 3

        chunk_size = (total_chapters + workers - 1) // workers
        chunks = [chapters_list[i:i + chunk_size] for i in range(0, total_chapters, chunk_size)]

        chapter_content = {}

        with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
            futures = []

            for i, chunk in enumerate(chunks):
                futures.append(executor.submit(self._process_chunk_content, chunk, i))

            for future in concurrent.futures.as_completed(futures):
                result = future.result()
                chapter_content.update(result)

        with open("course.json", "r") as file:
            course_data = json.load(file)

        course_data["chapters"] = chapter_content

        with open("course.json", "w") as file:
            json.dump(course_data, file, indent=4)

        return chapter_content

    def _process_chunk_content(self, chunk, worker_id):
        chunk_result = {}

        for chapter_no, chapter_name in chunk:
            print(f"Worker {worker_id} processing content for {chapter_name}...")
            chunk_result.update(self.build_chapter_content(chapter_no, chapter_name))
            time.sleep(random.uniform(2, 5))

        return chunk_result

    def build_chapter_content(self, chapter_no, chapter_name):
        prompt = (
            f"You are an expert educational content developer tasked with creating a detailed and well-structured chapter. "
            f"The chapter should be written for the course titled '{self.query}', and the specific chapter is '{chapter_name}'. "
            "Ensure the following requirements are met when writing the content:" 
            "\n1. The content should start with the chapter title at the top." 
            "\n2. Provide a detailed explanation of the chapter topic in a clear and concise manner." 
            "\n3. Include examples, where applicable, to enhance understanding of the topic." 
            "\n4. Maintain a logical flow that aligns with the course syllabus, ensuring continuity with preceding and following chapters." 
            "\n5. Use accessible language and avoid overly technical jargon unless absolutely necessary, providing definitions or explanations when using advanced terminology." 
            "\n6. The content should be engaging, informative, and tailored to the level of someone starting from basics but progressing toward advanced understanding by the end of the course." 
            "\n\nThe chapter should be formatted as follows:" 
            f"\n\nChapter Name: {chapter_name}" 
            "\n\nChapter Content: A detailed explanation of the chapter topic, including all necessary details to cover the topic comprehensively."
        )

        retries = 3
        backoff_time = 5

        for attempt in range(retries):
            try:
                run: RunResponse = self.agent.run(prompt)
                return {chapter_no: run.content.strip()}
            except InternalServerError as e:
                print(f"Attempt {attempt+1} failed for {chapter_name}. Retrying in {backoff_time} seconds...")
                time.sleep(backoff_time)
                backoff_time *= 2
            except Exception as e:
                print(f"Unexpected error occurred: {e}")
                break

        return {chapter_no: "Failed to generate content after multiple retries."}

    def GenerateQuestions(self):
        if not self.chapters:
            raise ValueError("Chapters have not been created. Run PlanSyllabus() first.")

        chapters_list = list(self.chapters.items())
        total_chapters = len(chapters_list)
        workers = 3

        chunk_size = (total_chapters + workers - 1) // workers
        chunks = [chapters_list[i:i + chunk_size] for i in range(0, total_chapters, chunk_size)]

        questions_content = {}

        with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
            futures = []

            for i, chunk in enumerate(chunks):
                futures.append(executor.submit(self._process_chunk_questions, chunk, i))

            for future in concurrent.futures.as_completed(futures):
                result = future.result()
                questions_content.update(result)

        with open("course.json", "r") as file:
            course_data = json.load(file)

        course_data["questions"] = questions_content

        with open("course.json", "w") as file:
            json.dump(course_data, file, indent=4)

        return questions_content

    def _process_chunk_questions(self, chunk, worker_id):
        chunk_result = {}

        for chapter_no, chapter_name in chunk:
            print(f"Worker {worker_id} generating questions for {chapter_name}...")
            chunk_result.update(self.generate_questions(chapter_no, chapter_name))
            time.sleep(random.uniform(2, 5))

        return chunk_result

    def generate_questions(self, chapter_no, chapter_name):
        prompt = (
            f"You are an expert question generator tasked with creating 10 well-structured questions for a chapter. "
            f"The chapter is titled '{chapter_name}' from the course '{self.query}'. "
            "The questions should test understanding of the chapter content, covering both fundamental and advanced topics. "
            "Ensure the following guidelines are met:" 
            "\n1. Generate exactly 10 questions." 
            "\n2. Questions should vary in type, including conceptual, application-based, and analytical questions." 
            "\n3. Use clear and concise language." 
            f"\n\nThe format should be as follows:\nChapter {chapter_no}:\nQuestion 1\nQuestion 2\n...\nQuestion 10"
        )

        retries = 3
        backoff_time = 5

        for attempt in range(retries):
            try:
                run: RunResponse = self.agent.run(prompt)
                return {chapter_no: run.content.strip()}
            except InternalServerError as e:
                print(f"Attempt {attempt+1} failed for {chapter_name}. Retrying in {backoff_time} seconds...")
                time.sleep(backoff_time)
                backoff_time *= 2
            except Exception as e:
                print(f"Unexpected error occurred: {e}")
                break

        return {chapter_no: "Failed to generate questions after multiple retries."}
    
    def get_scores(self, set: dict, chapter: str) -> Dict[str, int]:
        """
        Generates scores for each question in a given answer set for a chapter.
        
        Args:
            set (dict): A dictionary containing questions as keys and answers as values.
            chapter (str): The chapter name or index for reference.
        
        Returns:
            Dict[str, int]: A dictionary mapping each question to its corresponding score.
        """
        with open("course.json", "r") as file:
            course_data = json.load(file)
        
        prompt = (
            "You are an experienced exam evaluator."
            f" The question paper is based on the chapter: {course_data["chapters"]}."
            " You are provided with an answer sheet in JSON format with questions as keys and answers as values."
            f" The answer sheet is: {set}."
            " Your task is to evaluate each answer based on the chapter content and assign a percentage score."
            " The output must be an array containing scores for each question in the order they appear, e.g., [80, 90, 70, ...]."
            " Provide only the array as output with no extra text."
        )
        
        run: RunResponse = self.agent.run(prompt)
        response = run.content.strip()
        
        match = re.search(r"\[(.*?)\]", response)
        if not match:
            raise ValueError("The response does not contain a valid array of scores.")
        
        scores = [int(score.strip()) for score in match.group(1).split(",")]
        
        question_scores = {f"question{i+1}": scores[i] for i in range(len(scores))}
        
        return question_scores
    
    def get_eval(self, set: dict, chapter: str) -> str:
        """
        Generates a performance evaluation for the provided answer sheet based on the chapter's content.

        Args:
            set (dict): A dictionary with questions as keys and student's answers as values.
            chapter (str): The chapter name or index for reference.

        Returns:
            str: A comprehensive evaluation of the student's performance.
        """
        
        with open("course.json", "r") as file:
            course_data = json.load(file)
        
        prompt = (
            "You are an experienced and meticulous exam evaluator."
            f" The question paper evaluates knowledge from the chapter titled: '{course_data["chapters"]}'."
            " You are provided with a JSON-format answer sheet where questions are keys and the student's answers are the values."
            f" The answer sheet is as follows: {set}."
            " Based on this answer sheet, your task is to provide an overall evaluation of the student's performance."
            " The evaluation should include the following:"
            " 1. A concise summary of the student's overall performance, highlighting their general understanding of the chapter."
            " 2. Specific concepts or areas from the chapter where the student demonstrates weakness or incomplete understanding."
            " 3. Detailed, actionable suggestions for improvement to help the student perform better."
            " Avoid giving numerical scores or percentages in your evaluation."
            " Structure your response with the following sections: 'Overall Summary', 'Weak Areas', and 'Suggestions for Improvement'."
            " Ensure your response is clear, constructive, and tailored to the content of the chapter."
        )
        
        run: RunResponse = self.agent.run(prompt)
        return run.content

# Example usage of how it works so that it becomes easier to interate with backen later.
# if __name__ == "__main__":
#     vatsal = CourseBuilder("I want a course to help me learn about stock trading.")
#     syllabus = vatsal.PlanSyllabus()
#     chapters = vatsal.BuildChapters()
#     questions = vatsal.GenerateQuestions()