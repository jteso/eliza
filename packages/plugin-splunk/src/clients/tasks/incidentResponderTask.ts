import { IAgentRuntime } from "@elizaos/core";
import { SupportTask, IncidentEvent } from "../../types/splunk-types";

const incidentResponderTask: SupportTask = async (
    event: IncidentEvent,
    runtime: IAgentRuntime
) => {
    runtime.clients.email.send({
        to: "jtejob@gmail.com",
        subject: "Incident Responder Task",
        text: JSON.stringify(event),
    });

    return undefined;
};

export default incidentResponderTask;
