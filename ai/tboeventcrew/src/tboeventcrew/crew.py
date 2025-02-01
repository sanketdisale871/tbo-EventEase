from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task, llm
from crewai.tools import tool
import datetime
from pydantic import BaseModel
from typing import List, Optional
import random

# from langchain_google_genai import ChatGoogleGenerativeAI


class Location(BaseModel):
    country: str
    state: str
    city: str
    explanation: str


class LocationsResponse(BaseModel):
    locations: List[Location]


@CrewBase
class Tboeventcrew:
    """Tboeventcrew crew"""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @tool("currentdatetimetool")
    def currentdatetimetool() -> str:
        "Returns current date and time with timezone"

        return datetime.datetime.utcnow()

    @tool("weather_tool")
    def weather_tool(cities: List[str]) -> List[dict]:
        """
        Outputs weather conditions for a list of cities.

        Args:
            cities (List[str]): A list of city names.

        Returns:
            List[dict]: A list of dictionaries, each containing the city name and its corresponding weather condition.
        """
        weather_data = []
        for city in cities:
            weather_conditions = ["sunny", "rainy", "cloudy", "stormy", "snowy"]
            weather_data.append(
                {"city_name": city, "weather": random.choice(weather_conditions)}
            )
        return weather_data

    @agent
    def location_suggesting_agent(self) -> Agent:
        return Agent(
            config=self.agents_config["location_suggesting_agent"],
            verbose=True,
            tools=[self.currentdatetimetool, self.weather_tool],
            allow_delegation=True,
        )

    # To learn more about structured task outputs,
    # task dependencies, and task callbacks, check out the documentation:
    # https://docs.crewai.com/concepts/tasks#overview-of-a-task
    @task
    def location_suggesting_task(self) -> Task:
        return Task(
            config=self.tasks_config["location_suggesting_task"],
            output_json=LocationsResponse,
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Tboeventcrew crew"""
        # To learn how to add knowledge sources to your crew, check out the documentation:
        # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,  # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
            # manager_llm=ChatGoogleGenerativeAI(model="gemini-flash-1.5"),
            # planning=True,
            # manager_agent=self.agents[0],
            # manager_llm=LLM(model="gemini/gemini-1.5-pro-latest", temperature=0.7),
            # memory=True,
            # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
        )
