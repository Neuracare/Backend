import { Client, AccountId, PrivateKey, Hbar, TransferTransaction } from "@hashgraph/sdk";
import { createServer } from "http";

// Initialize Hedera Client (adjust as needed for your environment)
const client = Client.forTestnet();

// Operator account ID and private key (replace with your credentials)
const operatorAccountId = AccountId.fromString(process.env.ACCOUNT_KEY);
const operatorPrivateKey = PrivateKey.fromString(process.env.PRIVATE_KEY);

client.setOperator(operatorAccountId, operatorPrivateKey);

function requestListener(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/hedera/account-balance" && req.method === "GET") {
        const accountId = url.searchParams.get("accountId");

        // Validate accountId
        if (!accountId) {
            res.writeHead(400);
            res.end("Account ID is required");
            return;
        }

        // Create and execute the query
        const query = new AccountBalanceQuery().setAccountId(accountId);
        query.execute(client)
            .then(balance => {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    accountId: accountId,
                    balance: balance.hbars.toString() // Balance in HBAR
                }));
            })
            .catch(error => {
                console.error('Error querying Hedera:', error);
                res.writeHead(500);
                res.end("Internal Server Error");
            });
    } else if (url.pathname === "/hedera/transfer-hbar" && req.method === "POST") {
        // Read the body of the request
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { toAccountId, amount } = JSON.parse(body);

                // Perform the transfer
                new TransferTransaction()
                    .addHbarTransfer(operatorAccountId, Hbar.fromTinybars(-amount))
                    .addHbarTransfer(AccountId.fromString(toAccountId), Hbar.fromTinybars(amount))
                    .execute(client)
                    .then(transactionResponse => transactionResponse.getReceipt(client))
                    .then(receipt => {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ status: receipt.status.toString() }));
                    })
                    .catch(error => {
                        console.error('Error performing transfer:', error);
                        res.writeHead(500);
                        res.end("Internal Server Error");
                    });
            } catch (error) {
                console.error('Error parsing request:', error);
                res.writeHead(400);
                res.end("Bad Request");
            }
        });
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
}

const server = createServer(requestListener);
server.listen(8080, () => {
    console.log("Server is running on http://localhost:8080");
});
