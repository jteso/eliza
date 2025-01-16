import { IAgentRuntime } from "@elizaos/core";
import { IncidentEvent, SplunkEvent, SupportTask } from "../types/splunk-types";

export class ErrorTriagePipeline {
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
        let currentEvent: SplunkEvent | IncidentEvent = initialEvent;

        for (const task of this.tasks) {
            const nextEvent = await task(currentEvent, this.agentRuntime);
            if (!nextEvent) {
                const taskName = task.name || "Unknown Task";
                console.log(
                    `Exiting the triage pipeline due to task: ${taskName}`
                );
                break;
            }
            currentEvent = nextEvent;
        }
    }
}
