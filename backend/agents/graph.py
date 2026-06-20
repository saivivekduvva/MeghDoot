from langgraph.graph import StateGraph, END
from .state import AgentState
from .nodes import (
    run_weather_agent,
    run_flood_agent,
    run_infrastructure_agent,
    run_verification_agent,
    run_mayor_agent
)

# Initialize the graph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("weather", run_weather_agent)
workflow.add_node("flood", run_flood_agent)
workflow.add_node("infrastructure", run_infrastructure_agent)
workflow.add_node("verification", run_verification_agent)
workflow.add_node("mayor", run_mayor_agent)

# Define edges
# Weather -> Flood -> Infrastructure -> Verification -> Mayor -> END
workflow.add_edge("weather", "flood")
workflow.add_edge("flood", "infrastructure")
workflow.add_edge("infrastructure", "verification")
workflow.add_edge("verification", "mayor")
workflow.add_edge("mayor", END)

# Set entry point
workflow.set_entry_point("weather")

# Compile the graph
agent_executor = workflow.compile()
