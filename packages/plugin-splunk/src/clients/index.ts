import { Client, IAgentRuntime, ServiceType } from "@elizaos/core";
import { ISplunkService, SplunkEvent } from "../types/splunk-types";
import { ErrorTriagePipeline } from "./pipeline";

// Tasks
import errorNormalizerTask from "./tasks/errorNormalizerTask";
import errorRecorderTask from "./tasks/errorRecorderTask";
import ignoreEvaluatorTask from "./tasks/ignoreEvaluatorTask";
import incidentResponderTask from "./tasks/incidentResponderTask";
import rootCauseAnalysisTask from "./tasks/rootCauseAnalysisTask";

export class TriageRoomClient {
    interval: NodeJS.Timeout;
    runtime: IAgentRuntime;
    errorTriagePipeline: ErrorTriagePipeline;
    constructor(runtime: IAgentRuntime, intervalMinutes: number) {
        this.runtime = runtime;

        // Start a loop that runs every x minutes
        // TODO - revert to setInterval
        this.interval = setTimeout(
            async () => {
                await this.performAnalysis();
            },
            10 * 1000 // Convert minutes to milliseconds
        );

        this.errorTriagePipeline = new ErrorTriagePipeline(this.runtime)
            .addTask(errorNormalizerTask)
            .addTask(errorRecorderTask)
            .addTask(ignoreEvaluatorTask)
            .addTask(rootCauseAnalysisTask)
            .addTask(incidentResponderTask);

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

        for (const query of supportQueries) {
            const splunkErrors: SplunkEvent[] =
                await splunkService.query(query);

            for (const splunkError of splunkErrors) {
                await this.errorTriagePipeline.run(splunkError);
            }
        }
    }

    stop() {
        clearInterval(this.interval);
        console.log("AutoClient stopped.");
        process.exit(0); // Exit the process
    }
}

export const TriageRoomClientInterface: Client = {
    start: async (runtime: IAgentRuntime) => {
        console.log("Starting TriageRoomClient...");
        const intervalMinutes = 0.1; // Set the interval in minutes
        const client = new TriageRoomClient(runtime, intervalMinutes);
        return client;
    },
    stop: async (_runtime: IAgentRuntime) => {
        console.warn("Direct client does not support stopping yet");
    },
};

export default TriageRoomClientInterface;
