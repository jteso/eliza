import { Database } from "better-sqlite3";
import { IncidentEvent } from "../types/splunk-types";
import { IAgentRuntime } from "@elizaos/core";
import { IDatabaseAdapter } from "@elizaos/core";
import { PostgresDatabaseAdapter } from "@elizaos/adapter-postgres";

export interface IntegrationDBError {
    id: number; // Assuming ID is the primary key
    error_timestamp: Date; // or string, depending on how you handle timestamps
    error_type: string;
    error_description: string;
    integration_affected: string;
    integration_details: string; // or an object if you parse it
    hash: string;
}

export class IntegrationErrorsDatabase {
    private db: PostgresDatabaseAdapter;
    IDatabaseAdapter;
    constructor(databaseAdapter: IDatabaseAdapter) {
        this.db = databaseAdapter as PostgresDatabaseAdapter;
    }
    async initialize() {
        // Create integration_errors table
        const result = await this.db.query(
            `SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'integration_errors';`
        );
        // Initialize schema if table does not exist yet
        if (result.rowCount === 0) {
            await this.db.query(`
            CREATE TABLE IF NOT EXISTS integration_errors (
                id SERIAL PRIMARY KEY,
                error_timestamp TIMESTAMP NOT NULL,
                error_type TEXT NOT NULL,
                error_description TEXT NOT NULL,
                integration_affected TEXT NOT NULL,
                integration_details TEXT,
                hash TEXT NOT NULL
            );
        `);
        }
    }

    async addError(incidentEvent: IncidentEvent): Promise<number | bigint> {
        const result = this.db.query(
            `INSERT INTO integration_errors (
                error_timestamp,
                error_type,
                error_description,
                integration_affected,
                integration_details,
                hash
            ) VALUES (
                $1,$2,$3,$4,$5,$6
            )`,
            [
                incidentEvent.timestamp,
                incidentEvent.errorType,
                incidentEvent.errorDescription,
                incidentEvent.integrationAffected,
                JSON.stringify(incidentEvent.integrationDetails),
                incidentEvent.hash,
            ]
        );

        return (await result).rowCount;
    }

    async getAllErrors(): Promise<IntegrationDBError[]> {
        const result = await this.db.query("SELECT * FROM integration_errors");
        return result.rows as IntegrationDBError[];
    }
}
