from requirementExtractingAgent import RequirementExtractingAgent
from locationSuggestingAgent import LocationSuggestingAgent
from itineraryGeneratingAgent import ItineraryGeneratingAgent


class EventPlanningAgent:
    """Master Event Planning Agent"""

    def __init__(self):
        """Initialise karega"""

        self.requirement_set = {
            "company_name": None,
            "event_title": None,
            "event_mood": None,
            "number_of_days": None,
            "date_range": None,
            "number_of_people": None,
            "age_group_of_people": None,
            "budget": None,
            "hotel_quality": None,
            "is_accomodation_required": None,
            "is_food_required": None,
            "is_wifi_required": None,
            "is_auditorium_required": None,
            "auditorium_capacity": None,
            "dietary_restrictions": None,
            "hotel_characteristics": [],
            "itinerary_requirements": [],
            "country": None,
            "state": None,
            "city": None,
        }

        self.itinerary_agent = ItineraryGeneratingAgent()
        self.location_agent = LocationSuggestingAgent()
        self.requirement_agent = RequirementExtractingAgent()

    def fill_requirement_set(self, extracted_requirements):
        """Extracted requirements ko fill karega"""

        for key, value in extracted_requirements.items():
            if value not in [None, "None", []]:
                if key in ["hotel_characteristics", "itinerary_requirements"]:
                    for v in value:
                        self.requirement_set[key].append(v)
                else:
                    self.requirement_set[key] = extracted_requirements[key]

        return self.requirement_set

    def extract_requirements(self, user_natural_language_text):
        """Natural language text se requirements extract karega"""

        extracted_requirements = self.requirement_agent.extract_requirements(
            user_natural_language_text
        )

        self.fill_requirement_set(extracted_requirements)

        return self.requirement_set

    def get_unfilled_keys(self):
        """Unfilled keys dega"""

        unfilled_keys = []
        for key, value in self.requirement_set.items():
            if value in [None, "None", []]:
                unfilled_keys.append(key)

        return unfilled_keys

    def location_suggester(self):
        """Location suggest karega"""

        suggested_locations = self.location_agent.suggest_locations(
            self.requirement_set
        )
        return suggested_locations

    def prepare_itinerary(self):
        """Itinerary prepare karega"""

        itinerary = self.itinerary_agent.generate_itinerary(self.requirement_set)
        return itinerary


if __name__ == "__main__":
    event_planning_agent = EventPlanningAgent()

    # 1. USER - Natural Language Text
    user_natural_language_text = "We are planning a 3-day event. We need a hotel with 4-star quality, accommodation, and food provided. We require WiFi and an auditorium with a capacity of 100 people. The event is for a company of 50 people in the age group of 25-40. The budget is $5000. The event title is 'Annual Conference'."

    # 2. LLM - Extract Requirements
    # 3. MACH - Fill features
    event_planning_agent.extract_requirements(user_natural_language_text)
    print("\n---\n", event_planning_agent.requirement_set, "\n---\n")

    # 4. MACH - Iteratively ask for unfilled features
    # 5. USER - Provide values for unfilled features
    # 6. MACH - Fill unfilled features
    unfilled_keys = event_planning_agent.get_unfilled_keys()
    print("\n---\n", unfilled_keys, "\n---\n")

    for key in unfilled_keys:
        if key not in ["city", "state", "country"]:
            print(f"Please provide the value for '{key}'")
            value = input()
            event_planning_agent.fill_requirement_set({key: value})

    print("\n---\n", event_planning_agent.requirement_set, "\n---\n")

    # 7. MACH - Asks about location
    if "city" in unfilled_keys:
        print("Is location decided? (y/n)")
        is_location_decided = input()

        # 7Y1. MACH - If location is decided
        if is_location_decided.lower() == "y":
            # 7Y2. USER - Provide location
            print("Please provide the country")
            country = input()
            print("Please provide the state")
            state = input()
            print("Please provide the city")
            city = input()

            # 7Y3. MACH - Fill city, country and state
            event_planning_agent.fill_requirement_set({"city": city})
            event_planning_agent.fill_requirement_set(
                {
                    "city": city,
                    "state": state,
                    "country": country,
                }
            )
            print("\n---\n", event_planning_agent.requirement_set, "\n---\n")
        # 7N1. MACH - If location is not decided
        else:
            # 7N6. MACH - Suggest locations
            suggested_locations = event_planning_agent.location_suggester()
            print("\n---\n", suggested_locations, "\n---\n")

            # 7N7. USER - Select location
            print("Please select a location index")
            selected_location_index = int(input())

            # 7N8. MACH - Fill city, country and state
            event_planning_agent.fill_requirement_set(
                {
                    "city": suggested_locations[selected_location_index]["city"],
                    "state": suggested_locations[selected_location_index]["state"],
                    "country": suggested_locations[selected_location_index]["country"],
                }
            )

            print("\n---\n", event_planning_agent.requirement_set, "\n---\n")

    # 8. MACH - Prepare Itinerary
    itinerary = event_planning_agent.prepare_itinerary()
    print("\n---\n", itinerary, "\n---\n")
