import { Client, IAgentRuntime, ServiceType } from "@elizaos/core";
import { ISplunkService, SplunkEvent } from "../types/splunk-types";
import { ErrorAssessmentPipeline } from "./pipeline";

// Tasks
import errorNormalizerTask from "./tasks/errorNormalizerTask";
import updateMemoryTask from "./tasks/updateMemoryTask";
import ignoreEvaluatorTask from "./tasks/ignoreEvaluatorTask";
import incidentResponderTask from "./tasks/incidentResponderTask";

export class BasementClient {
    interval: NodeJS.Timeout;
    runtime: IAgentRuntime;
    errorAssessmentPipeline: ErrorAssessmentPipeline;
    constructor(runtime: IAgentRuntime, intervalMinutes: number) {
        this.runtime = runtime;

        // Start a loop that runs every x minutes
        this.interval = setInterval(
            async () => {
                await this.performAnalysis();
            },
            10 * 1000 // Convert minutes to milliseconds
        );

        this.errorAssessmentPipeline = new ErrorAssessmentPipeline(this.runtime)
            .addTask(errorNormalizerTask) // convert the Splunk error event to a common format
            .addTask(updateMemoryTask) // update the memory with the error
            .addTask(ignoreEvaluatorTask) // check if the error should be ignored
            .addTask(incidentResponderTask); // check if the error should trigger an incident

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

        for (const query of supportQueries) {
            const splunkErrors: SplunkEvent[] =
                await splunkService.query(query);

            for (const splunkError of splunkErrors) {
                this.errorAssessmentPipeline.run(splunkError);
            }
        }
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
