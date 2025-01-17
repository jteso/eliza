import type { Plugin } from "@elizaos/core";
// import type { WebhookConfig } from './types/webhook.js';
// import type { WebhookHandler } from './types/webhook.js';
// import { webhookService } from './services/webhook.js';
// import { twilioService } from './services/twilio.js';
// import { webhookConfig } from './config/webhookConfig.js';
// import { webhookHandler } from './services/webhookHandler.js';
// import { SafeLogger } from './utils/logger.js';
// import { actions } from './actions/index.js';

export const plugin: Plugin = {
    name: "email",
    description: "Email plugin for Eliza",
    version: "0.1.0",
    services: [emailService],
    actions: [],
};
