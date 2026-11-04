PurchaseInvoices


POST
/api/purchaseinvoices


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "supplierId": 1,
  "invoiceNumber": "INV-000001",
  "invoiceDate": "2026-11-04T08:11:59.054Z",
  "notes": "start of the month items",
  "items": [
    {
      "inventoryItemId": 1,
      "quantity": 10,
      "unitCost": 15
    }
  ]
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/purchaseinvoices' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijg2M2Y2YzhlLTJjMGMtNDk5Ny04N2E1LTRlNWNiMjg2NDRlYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzk5NTYsImV4cCI6MTc5Mzc4MDg1NiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.lJyINscUs8Z_YsQ_PzINACghsrcvJklufikNz41a9NQ' \
  -H 'Content-Type: application/json' \
  -d '{
  "supplierId": 1,
  "invoiceNumber": "INV-000001",
  "invoiceDate": "2026-11-04T08:11:59.054Z",
  "notes": "start of the month items",
  "items": [
    {
      "inventoryItemId": 1,
      "quantity": 10,
      "unitCost": 15
    }
  ]
}'
Request URL
https://swimming1academy.runasp.net/api/purchaseinvoices
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Purchase invoice created successfully.",
  "data": {
    "id": 1,
    "supplierId": 1,
    "supplierName": "ddd",
    "invoiceNumber": "INV-000001",
    "invoiceDate": "2026-11-04T08:11:59.054",
    "totalAmount": 150,
    "paidAmount": 0,
    "remainingAmount": 150,
    "notes": "start of the month items",
    "createdAt": "2026-11-04T08:14:42.0855189",
    "items": [
      {
        "id": 1,
        "inventoryItemId": 1,
        "inventoryItemName": "سكر تحليه",
        "quantity": 10,
        "unitCost": 15,
        "totalPrice": 150
      }
    ]
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 08:14:41 GMT 
 location: https://swimming1academy.runasp.net/api/purchaseinvoices/1 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "message": "string",
  "data": {
    "id": 0,
    "supplierId": 0,
    "supplierName": "string",
    "invoiceNumber": "string",
    "invoiceDate": "2026-11-04T08:15:44.213Z",
    "totalAmount": 0,
    "paidAmount": 0,
    "remainingAmount": 0,
    "notes": "string",
    "createdAt": "2026-11-04T08:15:44.213Z",
    "items": [
      {
        "id": 0,
        "inventoryItemId": 0,
        "inventoryItemName": "string",
        "quantity": 0,
        "unitCost": 0,
        "totalPrice": 0
      }
    ]
  }
}
No links

GET
/api/purchaseinvoices


Parameters
Cancel
Name	Description
Page
integer($int32)
(query)
Page
PageSize
integer($int32)
(query)
PageSize
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/purchaseinvoices' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijg2M2Y2YzhlLTJjMGMtNDk5Ny04N2E1LTRlNWNiMjg2NDRlYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzk5NTYsImV4cCI6MTc5Mzc4MDg1NiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.lJyINscUs8Z_YsQ_PzINACghsrcvJklufikNz41a9NQ'
Request URL
https://swimming1academy.runasp.net/api/purchaseinvoices
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 1,
      "supplierId": 1,
      "supplierName": "ddd",
      "invoiceNumber": "INV-000001",
      "invoiceDate": "2026-11-04T08:11:59.054",
      "totalAmount": 150,
      "paidAmount": 0,
      "remainingAmount": 150,
      "notes": "start of the month items",
      "createdAt": "2026-11-04T08:14:42.0855189"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 1,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 08:14:50 GMT 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "items": [
    {
      "id": 0,
      "supplierId": 0,
      "supplierName": "string",
      "invoiceNumber": "string",
      "invoiceDate": "2026-11-04T08:15:44.216Z",
      "totalAmount": 0,
      "paidAmount": 0,
      "remainingAmount": 0,
      "notes": "string",
      "createdAt": "2026-11-04T08:15:44.216Z"
    }
  ],
  "page": 0,
  "pageSize": 0,
  "totalCount": 0,
  "totalPages": 0
}
No links

GET
/api/purchaseinvoices/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
1
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/purchaseinvoices/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijg2M2Y2YzhlLTJjMGMtNDk5Ny04N2E1LTRlNWNiMjg2NDRlYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzk5NTYsImV4cCI6MTc5Mzc4MDg1NiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.lJyINscUs8Z_YsQ_PzINACghsrcvJklufikNz41a9NQ'
Request URL
https://swimming1academy.runasp.net/api/purchaseinvoices/1
Server response
Code	Details
200	
Response body
Download
{
  "id": 1,
  "supplierId": 1,
  "supplierName": "ddd",
  "invoiceNumber": "INV-000001",
  "invoiceDate": "2026-11-04T08:11:59.054",
  "totalAmount": 150,
  "paidAmount": 0,
  "remainingAmount": 150,
  "notes": "start of the month items",
  "createdAt": "2026-11-04T08:14:42.0855189",
  "items": [
    {
      "id": 1,
      "inventoryItemId": 1,
      "inventoryItemName": "سكر تحليه",
      "quantity": 10,
      "unitCost": 15,
      "totalPrice": 150
    }
  ]
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 08:14:55 GMT 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "id": 0,
  "supplierId": 0,
  "supplierName": "string",
  "invoiceNumber": "string",
  "invoiceDate": "2026-11-04T08:15:44.219Z",
  "totalAmount": 0,
  "paidAmount": 0,
  "remainingAmount": 0,
  "notes": "string",
  "createdAt": "2026-11-04T08:15:44.219Z",
  "items": [
    {
      "id": 0,
      "inventoryItemId": 0,
      "inventoryItemName": "string",
      "quantity": 0,
      "unitCost": 0,
      "totalPrice": 0
    }
  ]
}
No links

PUT
/api/purchaseinvoices/{id}


Parameters
Try it out
Name	Description
id *
integer($int32)
(path)
id
Request body

application/json
Example Value
Schema
{
  "supplierId": 0,
  "invoiceNumber": "string",
  "invoiceDate": "2026-11-04T08:15:44.221Z",
  "notes": "string",
  "items": [
    {
      "inventoryItemId": 0,
      "quantity": 0,
      "unitCost": 0
    }
  ]
}
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "message": "string",
  "data": {
    "id": 0,
    "supplierId": 0,
    "supplierName": "string",
    "invoiceNumber": "string",
    "invoiceDate": "2026-11-04T08:15:44.222Z",
    "totalAmount": 0,
    "paidAmount": 0,
    "remainingAmount": 0,
    "notes": "string",
    "createdAt": "2026-11-04T08:15:44.222Z",
    "items": [
      {
        "id": 0,
        "inventoryItemId": 0,
        "inventoryItemName": "string",
        "quantity": 0,
        "unitCost": 0,
        "totalPrice": 0
      }
    ]
  }
}
No links

DELETE
/api/purchaseinvoices/{id}


Parameters
Try it out
Name	Description
id *
integer($int32)
(path)
id
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "message": "string",
  "data": "string"
}
PurchaseInvoicePayments


POST
/api/purchaseinvoicepayments


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "purchaseInvoiceId": 1,
  "amountPaid": 25,
  "paymentDate": "2026-11-04T08:17:57.324Z"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/purchaseinvoicepayments' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijg2M2Y2YzhlLTJjMGMtNDk5Ny04N2E1LTRlNWNiMjg2NDRlYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzk5NTYsImV4cCI6MTc5Mzc4MDg1NiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.lJyINscUs8Z_YsQ_PzINACghsrcvJklufikNz41a9NQ' \
  -H 'Content-Type: application/json' \
  -d '{
  "purchaseInvoiceId": 1,
  "amountPaid": 25,
  "paymentDate": "2026-11-04T08:17:57.324Z"
}'
Request URL
https://swimming1academy.runasp.net/api/purchaseinvoicepayments
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Purchase invoice payment created successfully.",
  "data": {
    "id": 1,
    "purchaseInvoiceId": 1,
    "invoiceNumber": "INV-000001",
    "supplierName": "ddd",
    "amountPaid": 25,
    "paymentDate": "2026-11-04T08:17:57.324",
    "cashboxType": "POS"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 08:17:56 GMT 
 location: https://swimming1academy.runasp.net/api/purchaseinvoicepayments/1 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "message": "string",
  "data": {
    "id": 0,
    "purchaseInvoiceId": 0,
    "invoiceNumber": "string",
    "supplierName": "string",
    "amountPaid": 0,
    "paymentDate": "2026-11-04T08:19:51.628Z",
    "cashboxType": "POS"
  }
}
No links

GET
/api/purchaseinvoicepayments


Parameters
Cancel
Name	Description
Page
integer($int32)
(query)
Page
PageSize
integer($int32)
(query)
PageSize
PurchaseInvoiceId
integer($int32)
(query)
PurchaseInvoiceId
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/purchaseinvoicepayments' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijg2M2Y2YzhlLTJjMGMtNDk5Ny04N2E1LTRlNWNiMjg2NDRlYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzk5NTYsImV4cCI6MTc5Mzc4MDg1NiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.lJyINscUs8Z_YsQ_PzINACghsrcvJklufikNz41a9NQ'
Request URL
https://swimming1academy.runasp.net/api/purchaseinvoicepayments
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 1,
      "purchaseInvoiceId": 1,
      "invoiceNumber": "INV-000001",
      "supplierName": "ddd",
      "amountPaid": 25,
      "paymentDate": "2026-11-04T08:17:57.324",
      "cashboxType": "POS"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 1,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 08:18:05 GMT 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "items": [
    {
      "id": 0,
      "purchaseInvoiceId": 0,
      "invoiceNumber": "string",
      "supplierName": "string",
      "amountPaid": 0,
      "paymentDate": "2026-11-04T08:19:51.630Z",
      "cashboxType": "POS"
    }
  ],
  "page": 0,
  "pageSize": 0,
  "totalCount": 0,
  "totalPages": 0
}
No links

GET
/api/purchaseinvoicepayments/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
1
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/purchaseinvoicepayments/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijg2M2Y2YzhlLTJjMGMtNDk5Ny04N2E1LTRlNWNiMjg2NDRlYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzk5NTYsImV4cCI6MTc5Mzc4MDg1NiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.lJyINscUs8Z_YsQ_PzINACghsrcvJklufikNz41a9NQ'
Request URL
https://swimming1academy.runasp.net/api/purchaseinvoicepayments/1
Server response
Code	Details
200	
Response body
Download
{
  "id": 1,
  "purchaseInvoiceId": 1,
  "invoiceNumber": "INV-000001",
  "supplierName": "ddd",
  "amountPaid": 25,
  "paymentDate": "2026-11-04T08:17:57.324",
  "cashboxType": "POS"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 08:18:22 GMT 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "id": 0,
  "purchaseInvoiceId": 0,
  "invoiceNumber": "string",
  "supplierName": "string",
  "amountPaid": 0,
  "paymentDate": "2026-11-04T08:19:51.632Z",
  "cashboxType": "POS"
}
No links

PUT
/api/purchaseinvoicepayments/{id}


Parameters
Try it out
Name	Description
id *
integer($int32)
(path)
id
Request body

application/json
Example Value
Schema
{
  "purchaseInvoiceId": 0,
  "amountPaid": 0,
  "paymentDate": "2026-11-04T08:19:51.633Z"
}
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "message": "string",
  "data": {
    "id": 0,
    "purchaseInvoiceId": 0,
    "invoiceNumber": "string",
    "supplierName": "string",
    "amountPaid": 0,
    "paymentDate": "2026-11-04T08:19:51.634Z",
    "cashboxType": "POS"
  }
}
No links

DELETE
/api/purchaseinvoicepayments/{id}


Parameters
Try it out
Name	Description
id *
integer($int32)
(path)
id
Responses
Code	Description	Links
200	
OK

Media type

text/plain
Controls Accept header.
Example Value
Schema
{
  "message": "string",
  "data": "string"
}