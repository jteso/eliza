import { Client, IAgentRuntime, ServiceType } from "@elizaos/core";
import { ISplunkService, SendContext } from "../types/splunk-types";

export class BasementClient {
    interval: NodeJS.Timeout;
    runtime: IAgentRuntime;

    constructor(runtime: IAgentRuntime, intervalMinutes: number) {
        this.runtime = runtime;

        // Start a loop that runs every x minutes
        this.interval = setInterval(
            async () => {
                await this.performAnalysis();
            },
            10 * 1000 // Convert minutes to milliseconds
        );

        // Handle SIGINT to stop the client gracefully
        process.on("SIGINT", () => {
            this.stop();
        });
    }

    async performAnalysis() {
        console.log("Performing required steps...");
        const splunkService = this.runtime.getService<ISplunkService>(
            ServiceType.SPLUNK
        ) as ISplunkService;

        // Access the queries to evaluate
        const querySetting = this.runtime.getSetting("SUPPORT_QUERIES");
        const supportQueries = querySetting
            .split(",")
            .map((query) => query.trim());
        console.log("Support query 1:", supportQueries[0]);
        console.log("Support query 2:", supportQueries[1]);

        console.log("Splunk service:", splunkService);
        const result: SendContext[] = await splunkService.query(
            supportQueries[0]
        );

        // TODO: Analyse the result with LLM

        // TODO: Record this result in the database as a memory

        // TODO: Evaluate the result. Is this an error? Has been seen before?

        // TODO: Decide if this needs to be escalated to a human and the channel to do so: JIRA, Email, etc.

        console.log("Splunk query result:", result);
        // Add your logic for the steps that need to be performed here
    }

    stop() {
        clearInterval(this.interval);
        console.log("AutoClient stopped.");
        process.exit(0); // Exit the process
    }
}

export const BasementClientInterface: Client = {
    start: async (runtime: IAgentRuntime) => {
        console.log("Starting BasementClient...");
        const intervalMinutes = 0.1; // Set the interval in minutes
        const client = new BasementClient(runtime, intervalMinutes);
        return client;
    },
    stop: async (_runtime: IAgentRuntime) => {
        console.warn("Direct client does not support stopping yet");
    },
};

export default BasementClientInterface;
