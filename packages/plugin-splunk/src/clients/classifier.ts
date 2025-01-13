import {
    composeContext,
    elizaLogger,
    generateText,
    IAgentRuntime,
    ModelClass,
    State,
} from "@elizaos/core";

const classifyEventTemplate = `
Given the following JSON representing a Splunk event:

{{ splunkEvent }}

analyze the event to determine the following properties:

* **ERROR TYPE:**
    * Classify the error based on the event data (e.g., "Function Execution Error", "Salesforce Integration Error", "Data Validation Error").
    * Consider using the data.name, data.source, and message fields for classification.

* **ERROR DESCRIPTION:**
    * Provide a concise and human-readable description of the error, including relevant details for troubleshooting.
    * Extract the core error message from the event data.
    * Provide key elements of the error message that can help identify the issue, including mobile numbers, account IDs, or other unique identifiers or properties.

* **TIMESTAMP: **
    Extract the timestamp of this event.

* **INTEGRATION AFFECTED:**
    Include the name of the service or api affected, normally prefixed with "integration-" name. Respond with unknown if you cannot determine it based on the event data.

* **DETAILS:**
    * Node Name: - Node Name (optional)
    * Node ID: - Node ID (optional)

Present the results in the following format without any other explanation:

**TIMESTAMP:**
**ERROR TYPE:** {{ classification the error }}
**ERROR DESCRIPTION:** {{ a succint error message of the event }}
**INTEGRATION AFFECTED:**
**DETAILS:**


For example:
**TIMESTAMP:** 2021-10-01T12:00:00Z
**ERROR TYPE:** Salesforce Integration Error
**ERROR DESCRIPTION:** Account with ID "001Mn00000RyRc6IAF" not found in Salesforce.
**INTEGRATION AFFECTED:** integration-mca-assetmanagement-service
**DETAILS:**
    * Node ID: 7538c914.bff838
    * Node Name: Check Asset Exist

The goal is to provide a clear and concise summary of the error for easier analysis and troubleshooting, including the specific type of asset involved."
`;

// generate a class that takes the runtime in the constructor, the class should have a method called classifyEvent that takes a splunk event as input and returns the classification
// this classify event should construct a context message using the composeState and composeMessage from the runtime @see post.ts file for an example

export class Classifier {
    runtime: IAgentRuntime;

    constructor(runtime: IAgentRuntime) {
        this.runtime = runtime;
    }

    async classifyEvent(splunkEvent: any): Promise<string> {
        const classifyState = {
            splunkEvent: JSON.stringify(splunkEvent, null, 2),
        };

        const context = composeContext({
            template: classifyEventTemplate,
            state: classifyState as unknown as State,
        });

        const response = await generateText({
            runtime: this.runtime,
            context,
            modelClass: ModelClass.SMALL,
        });

        return response;
    }
}
