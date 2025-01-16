import { IAgentRuntime, Service } from "@elizaos/core";

export type SupportTask = (
    event: SplunkEvent | AssessmentEvent,
    runtime: IAgentRuntime
) => Promise<AssessmentEvent | undefined>;

export type AssessmentEvent = {
    timestamp: number;
    errorType: string;
    errorDescription: string;
    integrationAffected: string;
    integrationDetails: any;
    hash?: string | undefined;
};

export interface SplunkEventMetadata {
    host?: string | undefined;
    index?: string | undefined;
    source?: string | undefined;
    sourcetype?: string | undefined;
    time?: number | undefined; // Milliseconds since epoch, e.g. with Date.now()
}

export interface SplunkEvent {
    message: any;
    severity?: string | undefined;
    metadata?: SplunkEventMetadata | undefined;
}

export interface ISplunkService extends Service {
    query(sql: string): Promise<SplunkEvent[]>;
}
