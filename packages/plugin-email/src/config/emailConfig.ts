import { IAgentRuntime } from "@elizaos/core";
import { EmailProvider, EmailServiceConfig } from "../types/config";
import { z } from "zod";

// Define the schema for other providers
const GmailConfigSchema = z.object({
    provider: z.literal(EmailProvider.GMAIL), // Assuming GMAIL is another provider
    from: z.string(),
    user: z.string().min(1, "User is required"),
    pass: z.string().min(1, "Password is required"),
});

// Define the schema for SMTP provider
const SmtpConfigSchema = z.object({
    provider: z.literal(EmailProvider.SMTP),
    from: z.string(),
    host: z.string(),
    port: z.string(),
    secure: z.boolean(),
    user: z.string().min(1, "User is required"),
    pass: z.string().min(1, "Password is required"),
});

const AwsSesConfigSchema = z.object({
    provider: z.literal(EmailProvider.AWS_SES),
    from: z.string(),
    awsRegion: z.string(),
    awsAccessKeyId: z.string().min(1, "AWS Access Key ID is required"),
    awsSecretAccessKey: z.string().min(1, "AWS Secret Access Key is required"),
});

// Function to validate EmailConfig
export async function validateEmailConfig(
    runtime: IAgentRuntime
): Promise<EmailServiceConfig> {
    try {
        let config = {
            provider:
                runtime.getSetting("EMAIL_PROVIDER") ||
                process.env.EMAIL_PROVIDER,
            from: runtime.getSetting("EMAIL_FROM"),
            user: runtime.getSetting("EMAIL_USER") || process.env.EMAIL_USER,
            pass: runtime.getSetting("EMAIL_PASS") || process.env.EMAIL_PASS,
            host: runtime.getSetting("EMAIL_HOST") || process.env.EMAIL_HOST,
            port: runtime.getSetting("EMAIL_PORT"),
            secure: runtime.getSetting("EMAIL_SECURE") === "true" || false,
            awsAccessKeyId:
                runtime.getSetting("AWS_ACCESS_KEY_ID") ||
                process.env.AWS_ACCESS_KEY_ID,
            awsSecretAccessKey:
                runtime.getSetting("AWS_SECRET_ACCESS_KEY") ||
                process.env.AWS_SECRET_ACCESS_KEY,
            awsRegion:
                runtime.getSetting("AWS_REGION") || process.env.AWS_REGION,
        };

        // Validate the config against the appropriate schema based on the provider
        switch (config.provider) {
            case EmailProvider.GMAIL: // Assuming GMAIL is another provider
                return GmailConfigSchema.parse(config);
            case EmailProvider.SMTP:
                return SmtpConfigSchema.parse(config);
            case EmailProvider.AWS_SES:
                return AwsSesConfigSchema.parse(config);

            default:
                throw new Error("Unsupported email provider");
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Email configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
