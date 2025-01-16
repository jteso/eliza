import {
    composeContext,
    elizaLogger,
    generateText,
    IAgentRuntime,
    ModelClass,
    State,
} from "@elizaos/core";

import { createHash } from "crypto";

import { NORMALIZE_EVENT_TEMPLATE } from "../../templates";

import {
    AssessmentEvent,
    SplunkEvent,
    SupportTask,
} from "../../types/splunk-types";

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

        return nextEvent;
    }
};

export default errorNormalizerTask;
