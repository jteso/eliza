import {
    IAgentRuntime,
    Memory,
    Provider,
    Service,
    ServiceType,
    State,
} from "@elizaos/core";

import { ISplunkService, SplunkEvent } from "../types/splunk-types";

const SPLUNK_MOCK_REPONSE: SplunkEvent[] = [
    {
        message: {
            type: "error",
            data: {
                name: "Function failed",
                message:
                    "Function failed: Asset identified by account id: 001Mn00000RyRc6IAF does not exist in salesforce.",
                source: {
                    id: "7538c914.bff838",
                    type: "Function",
                    name: "Check Asset Exist",
                    count: 1,
                },
                stack: `Function node:7538c914.bff838 [Check Asset Exist]:3
    throw new Error(\`Asset identified by account id: \${msg.resident.AccountId} does not exist in salesforce.\`);
    ^

Error: Asset identified by account id: 001Mn00000RyRc6IAF does not exist in salesforce.
    at Function node:7538c914.bff838 [Check Asset Exist]:3:11
    at Function node:7538c914.bff838 [Check Asset Exist]:10:3
    at Script.runInContext (node:vm:141:12)
    at FunctionNode.<anonymous> (/var/task/node_modules/@kumologica/runtime/src/nodes/core/transformation/function.js:285:25)
    at FunctionNode.emit (node:events:513:28)
    at FunctionNode.emit (node:domain:489:12)
    at FunctionNode.Node.receive (/var/task/node_modules/@kumologica/runtime/src/runtime/lib/nodes/Node.js:367:10)`,
            },
            message:
                "Function failed: Asset identified by account id: 001Mn00000RyRc6IAF does not exist in salesforce.",
            meta: {
                protocol: "http",
                requestId: "38e749ff-5789-485d-b478-2b8c6203d550",
                action: "POST",
                resource: "/assetmanagement/subscribe/btr",
                username: "e56fa12f-dac3-42a7-8f6c-d33314f78ed9",
                sourceIp: "1.152.28.129",
                queryParameters: null,
                pathParameters: {
                    proxy: "subscribe/btr",
                },
                body: {
                    asset: "liv-aston",
                    role: "resident",
                },
            },
        },
        severity: "error",
        metadata: {
            host: "prod",
            index: "main",
            source: "integration-mca-digitalaccess-service",
            time: Date.now(),
        },
    },
];

export class SplunkService extends Service implements ISplunkService {
    static serviceType: ServiceType = ServiceType.SPLUNK;

    private runtime: IAgentRuntime | null = null;

    async initialize(runtime: IAgentRuntime): Promise<void> {
        console.log("Initializing SplunkService");
        this.runtime = runtime;
    }

    async query(sql: string): Promise<SplunkEvent[]> {
        if (!this.runtime) {
            throw new Error("Runtime not initialized.");
        }

        // Simulate a query to Splunk
        console.log(`Executing query on Splunk: ${sql}`);

        // Here you would typically make an API call to Splunk and process the response
        // For the sake of this example, we'll return a mock response
        const mockResponse: SplunkEvent[] = [SPLUNK_MOCK_REPONSE[0]];

        return Promise.resolve(mockResponse);
    }
}

export default SplunkService;
