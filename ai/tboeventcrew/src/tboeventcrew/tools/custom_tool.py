from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
import datetime
from crewai.tools import tool


@tool("currentdatetimetool")
def currentdatetimetool() -> str:
    "Returns current date and time with timezone"

    return datetime.datetime.utcnow()


# class DateTimeToolInput(BaseModel):
#     """Input schema for DateTimeTool."""

#     argument: str = Field(..., description="Description of the argument.")


# class DateTimeTool(BaseTool):
#     name: str = "Current Datetime"
#     description: str = (
#         "Clear description for what this tool is useful for, your agent will need this information to use it."
#     )
#     args_schema: Type[BaseModel] = MyCustomToolInput

#     def _run(self, argument: str) -> str:
#         # Implementation goes here
#         return str(datetime.datetime.utcnow())
