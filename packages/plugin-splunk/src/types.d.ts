declare global {
    export interface SendContextMetadata {
        host?: string | undefined;
        index?: string | undefined;
        source?: string | undefined;
        sourcetype?: string | undefined;
        time?: number | undefined; // Milliseconds since epoch, e.g. with Date.now()
    }

    export interface SendContext {
        message: any;
        severity?: string | undefined;
        metadata?: SendContextMetadata | undefined;
    }

    export interface ISplunkService extends Service {
        async query(sql: string): Promise<SendContext[]>;
    }
}

export {};
