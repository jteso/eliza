import {
    composeContext,
    elizaLogger,
    generateText,
    IAgentRuntime,
    ModelClass,
    State,
} from "@elizaos/core";

import { createHash } from "crypto";

import {
    AssessmentEvent,
    SplunkEvent,
    SupportTask,
} from "../../types/splunk-types";

const NORMALIZE_EVENT_TEMPLATE = `
# INSTRUCTIONS:
Agent is requesting an analysis of a given splunk event encoding a integration error. Your goal is to analyse the splunk event and classify it by extracting a few standard properties.

The following is the splunk event that you need to analyze:

{{splunkEvent}}

# Properties to extract:

The "errorType" is a high level classification of the error, that helps to group errors with similar categorie later on. Examples of error types are "Yardi integration error", "Salesforce Integration Error", "Data Validation Error".
The "errorDescription" Provide a concise and human-readable description of the error, including relevant details for troubleshooting, including mobile numbers, account IDs, or other unique identifiers or properties.
The "integrationAffected" is the name of the service or api affected, normally found in: "metadata.source" field. Otherwise, derive it from the message normally prefixed with "integration-" name.
The "integrationDetails" is an object with the following properties:
    * Node Name: - Node Name (optional)
    * Node ID: - Node ID (optional)

# Output:
Your response must be formatted as a valid JSON without using Markdown code block syntax (no triple backticks or other formatting). Simply present the JSON content as plain text. Here is the structure:

{
 "errorType": string
 "errorDescription": string
 "integrationAffected": string
 "integrationDetails": {
     "nodeName": string
     "nodeId": string
 }
}

## Examples of outputs:

{
 "errorType": "Salesforce Integration Error",
 "errorDescription": "Account with ID \\"001Mn00000RyRc6IAF\\" not found in Salesforce"
 "integrationAffected": "integration-mca-assetmanagement-service"
 "integrationDetails": {
     "nodeName": "7538c914.bff838"
     "nodeId": "Check Asset Exist"
 }
}

`;

const parseSafe = (response: string): AssessmentEvent => {
    // Remove markdown code block syntax if present
    let respAsString = response
        .replace(/^```json\n/, "") // Remove opening ```json
        .replace(/\n```$/, "") // Remove closing ```
        .trim(); // Remove any extra whitespace
    try {
        return JSON.parse(respAsString);
    } catch (e) {
        return undefined;
    }
};

const computeHash = (event: AssessmentEvent): string => {
    // exclude timestamp from hash
    const { timestamp, ...input } = event;
    const inputAsString = JSON.stringify(input, Object.keys(input).sort());
    const hash = createHash("sha256");
    hash.update(inputAsString);

    return hash.digest("hex");
};

const errorNormalizerTask: SupportTask = async (
    event: SplunkEvent,
    runtime: IAgentRuntime
) => {
    const contextState = {
        splunkEvent: JSON.stringify(event),
    };

    const context = composeContext({
        template: NORMALIZE_EVENT_TEMPLATE,
        state: contextState as unknown as State,
    });

    const response = await generateText({
        runtime,
        context,
        modelClass: ModelClass.SMALL,
    });

    const assessmentEvent = parseSafe(response);

    if (!assessmentEvent) {
        elizaLogger.error("Could not parse response as JSON", { response });
        return undefined;
    } else {
        let nextEvent: AssessmentEvent = {
            timestamp: event.metadata.time,
            errorType: assessmentEvent.errorType || "Unknown",
            errorDescription: assessmentEvent.errorDescription || "Unknown",
            integrationAffected:
                assessmentEvent.integrationAffected || "Unknown",
            integrationDetails: assessmentEvent.integrationDetails || {},
        };
        // compute the hash of the event
        nextEvent.hash = computeHash(nextEvent);

        return { nextEvent };
    }
};

export default errorNormalizerTask;
