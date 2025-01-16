import { IAgentRuntime } from "@elizaos/core";
import {
    SupportTask,
    SplunkEvent,
    IncidentEvent,
} from "../../types/splunk-types";

const ignoreEvaluatorTask: SupportTask = async (
    event: IncidentEvent,
    runtime: IAgentRuntime
) => {
    return event;
};

export default ignoreEvaluatorTask;
