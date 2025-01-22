import {
    composeContext,
    Content,
    elizaLogger,
    generateText,
    IAgentRuntime,
    ModelClass,
    State,
    stringToUuid,
} from "@elizaos/core";

import { IEmailService } from "@elizaos/plugin-email";

import { createHash } from "crypto";

import { NORMALIZE_EVENT_TEMPLATE } from "../../templates";

import {
    IncidentEvent,
    SplunkEvent,
    SupportTask,
} from "../../types/splunk-types";
import { Memory } from "@elizaos/core";
import { ServiceType } from "@elizaos/core";

const parseSafe = (response: string): IncidentEvent => {
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

const computeHash = (event: IncidentEvent): string => {
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
    // const clients = runtime.clients;
    // const emailService = runtime.getService<IEmailService>(
    //     ServiceType.TEXT_GENERATION
    // ) as IEmailService;

    // try {
    //     await emailService.send({
    //         to: "jtejob@gmail.com",
    //         subject: "email test from the agent",
    //         text: "Please tell me that you can read this message. that would make me very happy",
    //     });
    // } catch (err) {
    //     throw err;
    // }

    // see if we got any memory on the knowledge base about this issue
    const content: Content = {
        text: `service:"integration-mca-digitalaccess-service", errorDescription: "Unable to create account due to mobileNo: 123232 not present in Salesforce"`,
    };

    const errorMessage: Memory = {
        content,
        roomId: runtime.agentId,
        userId: runtime.agentId,
        agentId: runtime.agentId,
    };

    const state = await runtime.composeState(errorMessage, {
        splunkEvent: JSON.stringify(event),
    });

    const context = composeContext({
        template: NORMALIZE_EVENT_TEMPLATE,
        state: state as unknown as State,
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
        let nextEvent: IncidentEvent = {
            timestamp: new Date(event.metadata.time).toISOString(),
            errorType: assessmentEvent.errorType || "Unknown",
            errorDescription: assessmentEvent.errorDescription || "Unknown",
            integrationAffected:
                assessmentEvent.integrationAffected || "Unknown",
            integrationDetails: assessmentEvent.integrationDetails || {},
        };
        // compute the hash of the event
        nextEvent.hash = computeHash(nextEvent);

        return nextEvent;
    }
};

export default errorNormalizerTask;
function composeState() {
    throw new Error("Function not implemented.");
}
