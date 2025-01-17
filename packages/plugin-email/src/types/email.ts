import { Service } from "@elizaos/core";

export enum ServiceType {
    TEXT_GENERATION = "text_generation",
    EMAIL = "email",
}

interface EmailAttachment {
    filename: string;
    path: string;
    cid?: string;
}

export interface SendEmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: EmailAttachment[];
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
}

interface EmailResponse {
    success: boolean;
    messageId?: string;
    response?: string;
    error?: string;
}

export interface IEmailService extends Service {
    send(options: SendEmailOptions): Promise<EmailResponse>;
}
``;
