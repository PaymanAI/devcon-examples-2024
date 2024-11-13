import { Database } from "bun:sqlite";
import { Currency, MetricsRow, type DatabaseMetrics } from "./StorageClient";

// Define the type for database row
interface DBMetricsRow {
  id: number;
  totalDrinks: number;
  totalSoberingDrinks: number;
  maxDrunkLevel: number;
  totalEarned: bigint;
  currency: string;
  decimals: number;
}

export class SqliteService implements DatabaseMetrics {
  private db = new Database("drillbit.sqlite");

  constructor() {
    this.db.run(
      `CREATE TABLE IF NOT EXISTS metrics (
			  id INTEGER PRIMARY KEY AUTOINCREMENT,
			  totalDrinks INTEGER,
			  totalSoberingDrinks INTEGER,
			  maxDrunkLevel INTEGER,
			  totalEarned BIGINT,
			  currency TEXT NOT NULL,
			  decimals INTEGER NOT NULL,
			  UNIQUE(currency)
		  )`
    );
  }

  async getMetricsByCurrency(
    currency: string
  ): Promise<MetricsRow | undefined> {
    try {
      const row = (await this.db
        .prepare("SELECT * FROM metrics WHERE currency = ?", [currency])
        .get(currency)) as DBMetricsRow;

      if (!row) return undefined;

      // Convert the database row back to MetricsRow instance
      return new MetricsRow(
        row.totalDrinks,
        row.totalSoberingDrinks,
        row.maxDrunkLevel,
        row.totalEarned, // Convert back to decimal number
        row.currency as Currency,
        row.id
      );
    } catch (error) {
      console.error("Error retrieving metrics:", error);
      throw error;
    }
  }

  async upsertMetrics(metrics: MetricsRow): Promise<boolean> {
    try {
      // Validate maxDrunkLevel
      const maxDrunkLevel = Number(metrics.maxDrunkLevel);
      if (!Number.isInteger(maxDrunkLevel)) {
        throw new Error(`Invalid maxDrunkLevel: ${metrics.maxDrunkLevel}`);
      }

      console.log("upserting metrics with validated maxDrunkLevel:", maxDrunkLevel);
      
      const result = await this.db.run(
        `INSERT INTO metrics (
          totalDrinks,
          totalSoberingDrinks,
          maxDrunkLevel,
          totalEarned,
          currency,
          decimals
        ) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(currency) 
        DO UPDATE SET
          totalDrinks = excluded.totalDrinks,
          totalSoberingDrinks = excluded.totalSoberingDrinks,
          maxDrunkLevel = ?,  -- Separate bind parameter for update
          totalEarned = excluded.totalEarned,
          decimals = excluded.decimals
        WHERE currency = ?;`,
        [
          metrics.totalDrinks,
          metrics.totalSoberingDrinks,
          maxDrunkLevel,
          metrics.totalEarned,
          metrics.currency,
          metrics.decimals,
          maxDrunkLevel,  // Additional parameter for the UPDATE
          metrics.currency
        ]
      );

      return result.changes > 0;
    } catch (error) {
      console.error("Error upserting metrics:", {
        error,
        maxDrunkLevel: metrics.maxDrunkLevel,
        type: typeof metrics.maxDrunkLevel
      });
      throw error;
    }
  }
}
