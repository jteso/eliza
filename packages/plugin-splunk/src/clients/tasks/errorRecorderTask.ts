import { IAgentRuntime } from "@elizaos/core";
import { SupportTask, IncidentEvent } from "../../types/splunk-types";
import { IntegrationErrorsDatabase } from "../../adapters/integrationErrorsDatabase";

let integrationErrorsDatabase: IntegrationErrorsDatabase | null = null;

const errorRecorderTask: SupportTask = async (
    event: IncidentEvent,
    runtime: IAgentRuntime
) => {
    if (!integrationErrorsDatabase) {
        integrationErrorsDatabase = new IntegrationErrorsDatabase(
            runtime.databaseAdapter.db
        );
    }

    try {
        console.log("[errorRecorderTask] Adding error...");
        integrationErrorsDatabase.addError(event);
        const errorsSoFar = integrationErrorsDatabase.getAllErrors();
        console.log("[errorRecorderTask] Errors so far: ", errorsSoFar);
        return event;
    } catch (error) {
        console.error("[errorRecorderTask] Error found:", error);
        return undefined;
    }
};

export default errorRecorderTask;
