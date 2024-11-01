import Paymanai from "paymanai";
import { recordPayment } from "./storage";

const payman = new Paymanai({
	xPaymanAPISecret: Bun.env.PAYMAN_API_SECRET,
	baseURL: Bun.env.PAYMAN_API_BASE,
});

export const getRemainingBalance = async () => {
	try {
		if (Bun.env.PAYMAN_WALLET_ID) {
			const wallet = await payman.wallets.getWallet(Bun.env.PAYMAN_WALLET_ID);
			return Number(wallet.spendableBalance);
		}

		const balance = await payman.balances.getSpendableBalance("USDCBASE");
		return Number(balance);
	} catch (e) {
		console.error("Balance error", e);
		return 0;
	}
};

export const sendPayment = async (
	email: string,
	amount: number,
	thread_id: string,
) => {
	try {
		const response = await fetch(
			`${Bun.env.PAYMAN_API_BASE}/payments/send-payment`,
			{
				method: "POST",
				body: JSON.stringify({
					amountDecimal: amount.toFixed(2),
					currencyCode: "USDCBASE",
					email: email,
					walletId: Bun.env.PAYMAN_WALLET_ID,
				}),
				headers: {
					"x-payman-api-secret": Bun.env.PAYMAN_API_SECRET ?? "",
					"Content-Type": "application/json",
				},
			},
		);

		if (response.status === 200) {
			await recordPayment(thread_id, amount);
		}
	} catch (e) {
		console.error("Payment send error", e);
	}
};
