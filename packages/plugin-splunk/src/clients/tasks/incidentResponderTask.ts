import { IAgentRuntime } from "@elizaos/core";
import { SupportTask, IncidentEvent } from "../../types/splunk-types";

const incidentResponderTask: SupportTask = async (
    event: IncidentEvent,
    runtime: IAgentRuntime
) => {
    console.log("[=== Triage completed ===]");
    console.log(event);
    console.log("[========================]");
    return undefined;
};

export default incidentResponderTask;
