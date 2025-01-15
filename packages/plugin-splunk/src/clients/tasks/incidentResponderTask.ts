import { IAgentRuntime } from "@elizaos/core";
import { SupportTask, AssessmentEvent } from "../../types/splunk-types";

const incidentResponderTask: SupportTask = async (
    event: AssessmentEvent,
    runtime: IAgentRuntime
) => {
    // TODO

    let nextEvent: AssessmentEvent = {
        timestamp: Date.now(),
        errorType: "Unknown",
        errorDescription: "Unknown",
        integrationAffected: "Unknown",
        integrationDetails: {},
    };

    // TODO: check that response contains all expected fields
    return { nextEvent };
};

export default incidentResponderTask;
