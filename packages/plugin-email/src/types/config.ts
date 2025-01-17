export enum EmailProvider {
    GMAIL = "gmail",
    AWS_SES = "aws_ses",
    SMTP = "smtp",
}
interface BaseConfig {
    provider: EmailProvider;
    from: string;
}
interface GmailConfig extends BaseConfig {
    provider: EmailProvider.GMAIL;
    user: string;
    pass: string;
}

interface SmtpConfig extends BaseConfig {
    provider: EmailProvider.SMTP;
    host: string;
    port: string;
    secure: boolean;
    user: string;
    pass: string;
}

interface AwsSesConfig extends BaseConfig {
    provider: EmailProvider.AWS_SES;
    awsRegion: string;
    awsAccessKeyId: string;
    awsSecretAccessKey: string;
}

export type EmailServiceConfig = GmailConfig | SmtpConfig | AwsSesConfig;
