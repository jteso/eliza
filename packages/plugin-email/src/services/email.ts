import { Service, ServiceType } from "@elizaos/core";

export class EmailService extends Service implements IEmailService {
    readonly serviceType = ServiceType.TEXT_GENERATION;
}
