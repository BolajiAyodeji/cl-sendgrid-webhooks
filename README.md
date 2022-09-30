# cl-sendgrid-webhooks-demo

A minimal demo for sending an email to customers when they place a new order using Commerce Layer Webhooks, Zapier Code Runner, and SendGrid API. To get started, kindly read [the comprehensive tutorial]() on Commerce Layer's blog.

---

1. Add your credentials in `.env`:

```text
SENDGRID_API_KEY=""
TEMPLATE_ID=""
CL_SHARED_SECRET=""
```

2. Start the local server:

```bash
node server.js
```

3. Start a ngrok HTTP tunnel listening for HTTP/HTTPS traffic on port 9000:

```bash
ngrok http 9000
```

4. Create a new `orders.place` webhook using the CLI:

```bash
cl webhooks:create \
   -n "Order Confirmation Emails" \
   -t "orders.place" \
   -u "https://39cb-8-21-8-251.eu.ngrok.io/callback" \
   -i "customer,line_items,shipping_address,billing_address,shipments.shipping_method,payment_method,payment_source,market"
```

5. Place a new order using Commerce Layer [Demo stores](https://github.com/commercelayer/demo-store), [Hosted Microstore](https://github.com/commercelayer/commercelayer-microstore), or the [CLI checkout plugin](https://github.com/commercelayer/commercelayer-cli-plugin-checkout).

```bash
cl plugins:install checkout
```

```bash
commercelayer checkout -O <order-id>

or

cl checkout -S <sku-code-1> -S <sku-code-2> -m <market-id> -e <email-address>
```
