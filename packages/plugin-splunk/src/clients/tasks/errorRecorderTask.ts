import { IAgentRuntime } from "@elizaos/core";
import {
    SupportTask,
    SplunkEvent,
    AssessmentEvent,
} from "../../types/splunk-types";
import { IntegrationErrorsDatabase } from "../../adapters/integrationErrorsDatabase";

let integrationErrorsDatabase: IntegrationErrorsDatabase | null = null;

const errorRecorderTask: SupportTask = async (
    event: AssessmentEvent,
    runtime: IAgentRuntime
) => {
    if (!integrationErrorsDatabase) {
        integrationErrorsDatabase = new IntegrationErrorsDatabase(
            runtime.databaseAdapter.db
        );
    }

    try {
        integrationErrorsDatabase.addError(event);
        const errorsSoFar = integrationErrorsDatabase.getAllErrors();
        console.log("[errorRecorderTask] Errors so far: ", errorsSoFar);
        return event;
    } catch (error) {
        console.error("Error recording error in database", error);
        return undefined;
    }
};

export default errorRecorderTask;
