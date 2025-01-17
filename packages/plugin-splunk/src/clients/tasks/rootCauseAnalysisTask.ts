import { IAgentRuntime } from "@elizaos/core";
import { SupportTask, IncidentEvent } from "../../types/splunk-types";

/**
 * This task will check whether there were any changes in the affected service recorded in Github for the past week
 *
 * @param event
 * @param runtime
 * @returns
 */
const rootCauseAnalysisTask: SupportTask = async (
    event: IncidentEvent,
    runtime: IAgentRuntime
) => {
    return event;
};

export default rootCauseAnalysisTask;
