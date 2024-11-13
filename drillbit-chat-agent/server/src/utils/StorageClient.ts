import { SqliteService } from "./SqliteService";

// Enum for supported currencies
export enum Currency {
  USD = "USD",
  USDC = "USDC",
}

// Currency configuration
interface CurrencyConfig {
  decimals: number;
  symbol: string;
}

const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
  [Currency.USD]: { decimals: 2, symbol: "$" },
  [Currency.USDC]: { decimals: 6, symbol: "USDC" },
};

export interface DatabaseMetrics {
  getMetricsByCurrency(currency: string): Promise<MetricsRow | undefined>;
  upsertMetrics(metrics: MetricsRow): Promise<boolean>;
}

export class MetricsRow {
  totalDrinks: number;
  totalSoberingDrinks: number;
  maxDrunkLevel: number;
  totalEarned: bigint;
  currency: Currency;
  decimals: number;

  constructor(
    totalDrinks: number,
    totalSoberingDrinks: number,
    maxDrunkLevel: number,
    totalEarned: bigint,
    currency: Currency,
    id?: number
  ) {
    this.totalDrinks = totalDrinks;
    this.totalSoberingDrinks = totalSoberingDrinks;
    this.maxDrunkLevel = maxDrunkLevel;
    this.currency = currency;
    this.decimals = CURRENCY_CONFIGS[currency].decimals;
    this.totalEarned = totalEarned;
  }

  getFormattedAmount(): string {
    const multiplier = BigInt(10) ** BigInt(this.decimals);
    const amount = Number(this.totalEarned) / Number(multiplier);
    const config = CURRENCY_CONFIGS[this.currency];
    return `${config.symbol}${amount.toFixed(config.decimals)}`;
  }

  getAmount(): number {
    const multiplier = BigInt(10) ** BigInt(this.decimals);
    return Number(this.totalEarned) / Number(multiplier);
  }
}

export class StorageClient {
  private client: SqliteService;

  constructor() {
    this.client = new SqliteService();
  }

  async getMetricsByCurrency(
    currency: string
  ): Promise<MetricsRow | undefined> {
    try {
      return await this.client.getMetricsByCurrency(currency);
    } catch (error) {
      console.error("StorageClient: Error getting metrics:", error);
      throw error;
    }
  }

  async upsertMetrics(metrics: MetricsRow): Promise<boolean> {
    try {
      return await this.client.upsertMetrics(metrics);
    } catch (error) {
      console.error("StorageClient: Error upserting metrics:", error);
      throw error;
    }
  }

  // Helper methods for common operations
  async getUSDCMetrics(): Promise<MetricsRow | undefined> {
    return this.getMetricsByCurrency(Currency.USDC);
  }

  async getUSDMetrics(): Promise<MetricsRow | undefined> {
    return this.getMetricsByCurrency(Currency.USD);
  }

  // Initialize with default values if needed
  async initializeDefaultMetrics(): Promise<void> {
    const defaultUSDCMetrics = new MetricsRow(0, 0, 0, BigInt(0), Currency.USDC);
    const defaultUSDMetrics = new MetricsRow(0, 0, 0, BigInt(0), Currency.USD);

    await this.upsertMetrics(defaultUSDCMetrics);
    await this.upsertMetrics(defaultUSDMetrics);
  }
}
