import { IAgentRuntime } from "@elizaos/core";
import {
    SupportTask,
    SplunkEvent,
    AssessmentEvent,
} from "../../types/splunk-types";

const ignoreEvaluatorTask: SupportTask = async (
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
    return nextEvent;
};

export default ignoreEvaluatorTask;
