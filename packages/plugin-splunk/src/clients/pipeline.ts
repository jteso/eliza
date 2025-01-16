import { IAgentRuntime } from "@elizaos/core";
import {
    AssessmentEvent,
    SplunkEvent,
    SupportTask,
} from "../types/splunk-types";

export class ErrorAssessmentPipeline {
    private tasks: SupportTask[] = [];
    private agentRuntime: IAgentRuntime;

    constructor(runtime: IAgentRuntime) {
        this.agentRuntime = runtime;
    }

    addTask(task: SupportTask): this {
        this.tasks.push(task);
        return this;
    }

    // Method to execute the pipeline with a given event and runtime
    async run(initialEvent: SplunkEvent): Promise<void> {
        let currentEvent: SplunkEvent | AssessmentEvent = initialEvent;

        for (const task of this.tasks) {
            const nextEvent = await task(currentEvent, this.agentRuntime);
            if (!nextEvent) {
                const taskName = task.name || "Unknown Task";
                console.log(
                    `Exiting the assessment pipeline due to task: ${taskName}`
                );
                break;
            }
            currentEvent = nextEvent;
        }
    }
}
