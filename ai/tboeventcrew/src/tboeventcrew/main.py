#!/usr/bin/env python
import sys
import warnings

from datetime import datetime

from tboeventcrew.crew import Tboeventcrew

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information


def run():
    """
    Run the crew.
    """
    inputs = {
        "requirement_set": {
            "company_name": "Tech Corp",
            "event_title": "Annual Meetup",
            "event_mood": "Professional",
            "number_of_days": "3",
            "date_range": "2025-11-01 to 2025-11-03",
            "number_of_people": "100",
            "age_group_of_people": "25-45",
            "budget": "Medium",
            "hotel_quality": "4 Star",
            "is_accomodation_required": "Yes",
            "is_food_required": "Yes",
            "is_wifi_required": "Yes",
            "is_auditorium_required": "Yes",
            "auditorium_capacity": "150",
            "hotel_characteristics": ["Modern", "Business-friendly"],
            "dietary_restrictions": "Vegetarian",
            "itinerary_requirements": ["Workshops", "Networking Sessions"],
        },
    }
    try:
        Tboeventcrew().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {"topic": "AI LLMs"}
    try:
        Tboeventcrew().crew().train(
            n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs
        )

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")


def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        Tboeventcrew().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")


def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {"topic": "AI LLMs"}
    try:
        Tboeventcrew().crew().test(
            n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs
        )

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")
