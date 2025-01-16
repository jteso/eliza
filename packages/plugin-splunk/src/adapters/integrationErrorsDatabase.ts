import { Database } from "better-sqlite3";
import { IncidentEvent } from "../types/splunk-types";

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
    private db: Database;
    constructor(db: Database) {
        this.db = db;
        // check if the table exists, if not create them
        const tables = this.db
            .prepare(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='integration_errors';"
            )
            .all();

        if (tables.length === 0) {
            this.initializeSchema();
        }
    }
    private initializeSchema() {
        // Create integration_errors table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS integration_errors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                error_timestamp DATETIME NOT NULL,
                error_type TEXT NOT NULL,
                error_description TEXT NOT NULL,
                integration_affected TEXT NOT NULL,
                integration_details TEXT,
                hash TEXT NOT NULL
            );
        `);
    }

    addError(incidentEvent: IncidentEvent): number | bigint | null {
        const insertSql = `
            INSERT INTO integration_errors (
                error_timestamp,
                error_type,
                error_description,
                integration_affected,
                integration_details,
                hash
            ) VALUES (
                @error_timestamp,
                @error_type,
                @error_description,
                @integration_affected,
                @integration_details,
                @hash
            );
        `;
        const mappedError = {
            error_timestamp: incidentEvent.timestamp,
            error_type: incidentEvent.errorType,
            error_description: incidentEvent.errorDescription,
            integration_affected: incidentEvent.integrationAffected,
            integration_details: JSON.stringify(
                incidentEvent.integrationDetails
            ),
            hash: incidentEvent.hash,
        };
        try {
            const result = this.db.prepare(insertSql).run(mappedError);
            return result.lastInsertRowid;
        } catch (error) {
            console.error("Error inserting error into database", error);
            return null;
        }
    }

    getAllErrors(): IntegrationDBError[] {
        const selectSql = `
            SELECT * FROM integration_errors;
        `;
        const results = this.db
            .prepare(selectSql)
            .all() as IntegrationDBError[];
        return results;
    }
}
