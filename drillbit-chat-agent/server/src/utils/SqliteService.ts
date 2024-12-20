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
      
      await this.db.run(
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
				maxDrunkLevel = excluded.maxDrunkLevel,
				totalEarned = excluded.totalEarned,
				decimals = excluded.decimals`,
        [
          metrics.totalDrinks,
          metrics.totalSoberingDrinks,
          metrics.maxDrunkLevel,
          metrics.totalEarned,
          metrics.currency,
          metrics.decimals,
        ]
      );

      return true;
    } catch (error) {
      console.error("Error upserting metrics:", error);
      return true;
    }
  }
}
