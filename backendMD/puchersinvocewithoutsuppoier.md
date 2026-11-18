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
  "supplierId": null,
  "invoiceNumber": "test123",
  "invoiceDate": "2026-11-18T21:13:16.683Z",
  "notes": "test",
  "items": [
    {
      "inventoryItemId": 1,
      "quantity": 10,
      "unitCost": 100
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
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjNiOTMwYTYxLTA1NDctNGVjZC05MTJiLWY0YzZjN2RiYjlkOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTUwMzYwODIsImV4cCI6MTc5NTAzOTY4MSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.AEQHeAJKsd1zDiGYh987xBYiK54xh1skU5KjRXRDXhg' \
  -H 'Content-Type: application/json' \
  -d '{
  "supplierId": null,
  "invoiceNumber": "test123",
  "invoiceDate": "2026-11-18T21:13:16.683Z",
  "notes": "test",
  "items": [
    {
      "inventoryItemId": 1,
      "quantity": 10,
      "unitCost": 100
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
    "id": 18,
    "supplierId": null,
    "supplierName": "",
    "invoiceNumber": "test123",
    "invoiceDate": "2026-11-18T21:13:16.683",
    "totalAmount": 1000,
    "paidAmount": 0,
    "remainingAmount": 1000,
    "notes": "test",
    "createdAt": "2026-11-18T21:13:35.5536512",
    "items": [
      {
        "id": 14,
        "inventoryItemId": 1,
        "inventoryItemName": "سكر تحليه",
        "quantity": 10,
        "unitCost": 100,
        "totalPrice": 1000
      }
    ]
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,18 Nov 2026 21:13:35 GMT 
 location: https://swimming1academy.runasp.net/api/purchaseinvoices/18 
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
    "invoiceDate": "2026-11-18T21:13:55.106Z",
    "totalAmount": 0,
    "paidAmount": 0,
    "remainingAmount": 0,
    "notes": "string",
    "createdAt": "2026-11-18T21:13:55.106Z",
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



GET
/api/purchaseinvoices/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
18
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/purchaseinvoices/18' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjNiOTMwYTYxLTA1NDctNGVjZC05MTJiLWY0YzZjN2RiYjlkOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTUwMzYwODIsImV4cCI6MTc5NTAzOTY4MSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.AEQHeAJKsd1zDiGYh987xBYiK54xh1skU5KjRXRDXhg'
Request URL
https://swimming1academy.runasp.net/api/purchaseinvoices/18
Server response
Code	Details
200	
Response body
Download
{
  "id": 18,
  "supplierId": null,
  "supplierName": "",
  "invoiceNumber": "test123",
  "invoiceDate": "2026-11-18T21:13:16.683",
  "totalAmount": 1000,
  "paidAmount": 0,
  "remainingAmount": 1000,
  "notes": "test",
  "createdAt": "2026-11-18T21:13:35.5536512",
  "items": [
    {
      "id": 14,
      "inventoryItemId": 1,
      "inventoryItemName": "سكر تحليه",
      "quantity": 10,
      "unitCost": 100,
      "totalPrice": 1000
    }
  ]
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,18 Nov 2026 21:13:52 GMT 
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
  "invoiceDate": "2026-11-18T21:13:55.108Z",
  "totalAmount": 0,
  "paidAmount": 0,
  "remainingAmount": 0,
  "notes": "string",
  "createdAt": "2026-11-18T21:13:55.108Z",
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