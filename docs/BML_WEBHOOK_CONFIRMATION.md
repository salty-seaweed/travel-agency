# BML Webhook Configuration – Response to Bank of Maldives

Use this information when replying to BML regarding webhook and compliance questions.

---

## Webhook as Primary Method for Transaction Responses

**Yes, we use webhook as the primary method for capturing transaction responses from BML.**

### Implementation Summary

- **Webhook URL:** `https://<your-domain>/api/payments/webhook/`
  - For local/dev: `http://localhost:8001/api/payments/webhook/` (for ngrok or similar)

- **HTTP Method:** POST  
- **Content-Type:** application/json

### How We Use the Webhook

1. When BML sends a payment status update to our webhook, we update the `Payment` record in our database (status: completed, failed, pending).
2. The webhook is the **authoritative source** for final transaction status. We do not rely solely on redirect URL parameters for completion.
3. We support signature verification via `X-BML-Signature` or `X-Signature` header when `BML_WEBHOOK_SECRET` is configured.
4. Our frontend polls our own API when status is pending (e.g. after redirect), but the underlying status is updated by the webhook.

### Webhook Configuration in BML Merchant Dashboard

Please configure the webhook URL in your BML Merchant Portal:

- **Production:** `https://<production-domain>/api/payments/webhook/`
- **UAT/Sandbox:** `https://<uat-domain>/api/payments/webhook/` (or ngrok URL for local testing)

### Environment Variable

- `BML_WEBHOOK_SECRET` – Used to verify webhook signatures (HMAC SHA256) when BML provides a signing secret.

---

## Compliance Items Implemented

1. **Card brand marks** – Visa and Mastercard logos displayed in full color with equal prominence on the payment checkout page.
2. **Transaction records statement** – We advise cardholders to retain a copy of transaction records and our Policies and Rules (Terms, Privacy, Refund policies). This appears on both the checkout page and the payment success page.
3. **Webhook** – Used as the primary method to capture and process transaction responses from BML.
