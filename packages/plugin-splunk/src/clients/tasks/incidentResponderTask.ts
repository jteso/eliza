import { IAgentRuntime } from "@elizaos/core";
import { SupportTask, AssessmentEvent } from "../../types/splunk-types";

const incidentResponderTask: SupportTask = async (
    event: AssessmentEvent,
    runtime: IAgentRuntime
) => {
    console.log("Reporter Task: ", event);
    return undefined;
};

export default incidentResponderTask;
