# Mobile EMI Shop

A full-stack smartphone shopping application that lets users compare product variants, review EMI plans, and submit an order for a selected plan.

## Setup and Run

### Prerequisites

- Node.js 18 or later
- npm
- MongoDB Atlas account or a reachable MongoDB instance

### 1. Install dependencies

From the project root:

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure the server

Create `server/.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
PORT=4000
```

`MONGODB_URI` is required. `PORT` is optional and defaults to `4000`.

### 3. Seed the database

The seed command clears existing products and inserts the sample smartphone catalog.

```bash
cd server
npm run seed
```

### 4. Start the API

```bash
cd server
npm run dev
```

The API runs at `http://localhost:4000`.

### 5. Start the client

In a second terminal:

```bash
cd client
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

The client uses `http://localhost:4000/api` by default. To use another API URL, create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## API

Base URL: `http://localhost:4000/api`

### GET `/health`

Checks whether the API is running.

Response `200 OK`:

```json
{
	"status": "ok"
}
```

### GET `/products`

Returns a summary of all products for the product listing page.

Response `200 OK`:

```json
{
	"products": [
		{
			"id": "665f1a2b3c4d5e6f78901234",
			"slug": "apple-iphone-17-pro",
			"name": "Apple iPhone 17 Pro",
			"brand": "Apple",
			"category": "smartphone",
			"description": "Apple's flagship Pro smartphone with A19 Pro chip, titanium frame and pro-grade camera system.",
			"variantCount": 3,
			"startingPrice": 127400,
			"imageUrl": "https://example.com/iphone-17-pro.jpg"
		}
	]
}
```

### GET `/products/:slug`

Returns one product, including all variants and their EMI plans.

Response `200 OK`:

```json
{
	"id": "665f1a2b3c4d5e6f78901234",
	"slug": "apple-iphone-17-pro",
	"name": "Apple iPhone 17 Pro",
	"brand": "Apple",
	"category": "smartphone",
	"description": "Apple's flagship Pro smartphone with A19 Pro chip, titanium frame and pro-grade camera system.",
	"variants": [
		{
			"id": "665f1a2b3c4d5e6f78905678",
			"label": "256GB / Cosmic Orange",
			"storage": "256GB",
			"color": "Cosmic Orange",
			"colorHex": "#c9612c",
			"mrp": 134900,
			"price": 127400,
			"imageUrl": "https://example.com/iphone-17-pro.jpg",
			"isDefault": true,
			"emiPlans": [
				{
					"id": "665f1a2b3c4d5e6f78909999",
					"tenureMonths": 12,
					"monthlyAmount": 10617,
					"interestRate": 0,
					"cashbackAmount": 7500,
					"backedBy": "Mutual Fund SIP",
					"isRecommended": true
				}
			]
		}
	]
}
```

Response `404 Not Found`:

```json
{
	"error": "Product not found"
}
```

### POST `/orders`

Creates an order confirmation for a variant and its EMI plan. Orders are currently returned in the response and are not stored in a separate order collection.

Request body:

```json
{
	"variantId": "665f1a2b3c4d5e6f78905678",
	"emiPlanId": "665f1a2b3c4d5e6f78909999"
}
```

Response `201 Created`:

```json
{
	"orderId": "ORD-1717000000000",
	"variant": {
		"id": "665f1a2b3c4d5e6f78905678",
		"label": "256GB / Cosmic Orange",
		"price": 127400
	},
	"emiPlan": {
		"tenureMonths": 12,
		"monthlyAmount": 10617,
		"interestRate": 0,
		"cashbackAmount": 7500
	},
	"totalPayable": 127404,
	"status": "CONFIRMED",
	"createdAt": "2026-09-03T12:00:00.000Z"
}
```

Possible errors:

```json
{ "error": "variantId and emiPlanId are required" }
```

```json
{ "error": "Variant not found" }
```

```json
{ "error": "EMI plan not found for this variant" }
```

## Tech Stack

- **Frontend:** React 19, React Router, Vite
- **Backend:** Node.js, Express 5
- **Database:** MongoDB Atlas with Mongoose
- **Configuration:** dotenv
- **Middleware:** CORS, Express JSON parser

## Database Schema

The application uses one `Product` MongoDB collection. Variants and EMI plans are embedded subdocuments.

### Product

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `slug` | String | Yes | Unique URL identifier; indexed |
| `name` | String | Yes | Product name |
| `brand` | String | Yes | Manufacturer or brand |
| `category` | String | Yes | Defaults to `smartphone` |
| `description` | String | No | Product description; defaults to an empty string |
| `variants` | Array | No | Embedded product variants; defaults to an empty array |
| `createdAt` | Date | Automatic | Added by Mongoose timestamps |
| `updatedAt` | Date | Automatic | Added by Mongoose timestamps |

### Variant

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `label` | String | Yes | Display label such as `256GB / Cosmic Orange` |
| `storage` | String | Yes | Storage capacity |
| `color` | String | Yes | Color name |
| `colorHex` | String | Yes | Hex color used for the UI swatch |
| `mrp` | Number | Yes | Maximum retail price |
| `price` | Number | Yes | Current selling price |
| `imageUrl` | String | Yes | Product image URL |
| `isDefault` | Boolean | No | Whether this is the default variant; defaults to `false` |
| `emiPlans` | Array | No | Embedded EMI plan options |

### EMI Plan

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `tenureMonths` | Number | Yes | Repayment duration in months |
| `monthlyAmount` | Number | Yes | Monthly installment amount |
| `interestRate` | Number | Yes | Interest rate percentage; defaults to `0` |
| `cashbackAmount` | Number | Yes | Cashback amount; defaults to `0` |
| `backedBy` | String | Yes | Funding description; defaults to `Mutual Fund SIP` |
| `isRecommended` | Boolean | No | Whether the plan is highlighted; defaults to `false` |

Product, variant, and EMI plan documents each use a Mongoose-generated `_id` internally. The API exposes these values as `id`.
