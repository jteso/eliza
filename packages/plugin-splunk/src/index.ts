export * from "./types/splunk-types";

import { Plugin } from "@elizaos/core";
import { SplunkService } from "./services/SplunkService";
import { BasementClientInterface } from "./clients/index";

export const splunkPlugin: Plugin = {
    name: "splunk",
    description: "Splunk Plugin for Eliza",
    clients: [BasementClientInterface],
    actions: [],
    evaluators: [],
    services: [new SplunkService()],
};

export default splunkPlugin;
