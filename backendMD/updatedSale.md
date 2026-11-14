Sales


POST
/api/sales


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "items": [
    {
      "productId": 0,
      "quantity": 0
    }
  ],
  "discountAmount": 0,
  "amountPaid": 0,
  "payments": [
    {
      "paymentMethod": "Cash",
      "amount": 0
    }
  ],
  "payerName": "string",
  "debtDescription": "string",
  "dueDate": "2026-11-14",
  "notes": "string"
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
    "invoiceNumber": "string",
    "saleDate": "2026-11-14T11:20:32.489Z",
    "saleType": "Customer",
    "employeeId": 0,
    "employeeName": "string",
    "totalAmount": 0,
    "discountAmount": 0,
    "finalAmount": 0,
    "status": "NotReturned",
    "notes": "string",
    "items": [
      {
        "id": 0,
        "productId": 0,
        "productName": "string",
        "quantity": 0,
        "unitPrice": 0,
        "totalPrice": 0
      }
    ]
  }
}
No links

GET
/api/sales


Parameters
Cancel
Name	Description
Status
string
(query)

--
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
  'https://swimming1academy.runasp.net/api/sales' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjJhYTU2MDU4LTliYmItNGViMy04ZWM0LWE0YWIwMWUxMTY5YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTUyMDQsImV4cCI6MTc5NDY1ODgwNCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.eFxjQp5HSkVrkkCQmeYEMyJq_h43lGXqqOfu5xHuQ_4'
Request URL
https://swimming1academy.runasp.net/api/sales
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 15,
      "invoiceNumber": "INV-000015",
      "saleDate": "2026-11-13T17:59:49.704424",
      "saleType": "Customer",
      "employeeId": null,
      "employeeName": null,
      "totalAmount": 90,
      "discountAmount": 0,
      "finalAmount": 90,
      "status": "PartiallyReturned",
      "notes": "string",
      "items": [
        {
          "id": 17,
          "productId": 3,
          "productName": "عصير مانجو",
          "quantity": 6,
          "unitPrice": 15,
          "totalPrice": 90
        }
      ]
    },
    {
      "id": 14,
      "invoiceNumber": "INV-000014",
      "saleDate": "2026-11-13T15:50:21.5002362",
      "saleType": "Customer",
      "employeeId": null,
      "employeeName": null,
      "totalAmount": 75,
      "discountAmount": 0,
      "finalAmount": 75,
      "status": "FullyReturned",
      "notes": "string",
      "items": [
        {
          "id": 16,
          "productId": 3,
          "productName": "عصير مانجو",
          "quantity": 5,
          "unitPrice": 15,
          "totalPrice": 75
        }
      ]
    },
    {
      "id": 13,
      "invoiceNumber": "INV-000013",
      "saleDate": "2026-11-13T15:38:04.9555347",
      "saleType": "Customer",
      "employeeId": null,
      "employeeName": null,
      "totalAmount": 675,
      "discountAmount": 0,
      "finalAmount": 675,
      "status": "FullyReturned",
      "notes": "string",
      "items": [
        {
          "id": 15,
          "productId": 3,
          "productName": "عصير مانجو",
          "quantity": 45,
          "unitPrice": 15,
          "totalPrice": 675
        }
      ]
    },
    {
      "id": 12,
      "invoiceNumber": "INV-000012",
      "saleDate": "2026-11-13T13:57:53.9107381",
      "saleType": "Customer",
      "employeeId": null,
      "employeeName": null,
      "totalAmount": 75,
      "discountAmount": 0,
      "finalAmount": 75,
      "status": "NotReturned",
      "notes": "string",
      "items": [
        {
          "id": 14,
          "productId": 3,
          "productName": "عصير مانجو",
          "quantity": 5,
          "unitPrice": 15,
          "totalPrice": 75
        }
      ]
    },
    {
      "id": 11,
      "invoiceNumber": "INV-000011",
      "saleDate": "2026-11-11T11:07:08.2933508",
      "saleType": "Customer",
      "employeeId": null,
      "employeeName": null,
      "totalAmount": 60,
      "discountAmount": 0,
      "finalAmount": 60,
      "status": "NotReturned",
      "notes": "string",
      "items": [
        {
          "id": 13,
          "productId": 4,
          "productName": "عصير جوافه",
          "quantity": 3,
          "unitPrice": 20,
          "totalPrice": 60
        }
      ]
    },
    {
      "id": 10,
      "invoiceNumber": "INV-000010",
      "saleDate": "2026-11-11T11:04:32.0926284",
      "saleType": "Customer",
      "employeeId": null,
      "employeeName": null,
      "totalAmount": 45,
      "discountAmount": 0,
      "finalAmount": 45,
      "status": "NotReturned",
      "notes": "string",
      "items": [
        {
          "id": 12,
          "productId": 3,
          "productName": "عصير مانجو",
          "quantity": 3,
          "unitPrice": 15,
          "totalPrice": 45
        }
      ]
    },
    {
      "id": 8,
      "invoiceNumber": "INV-000008",
      "saleDate": "2026-11-10T18:47:50.6252411",
      "saleType": "Customer",
      "employeeId": null,
      "employeeName": null,
      "totalAmount": 30,
      "discountAmount": 0,
      "finalAmount": 30,
      "status": "NotReturned",
      "notes": "Single payment test",
      "items": [
        {
          "id": 10,
          "productId": 1,
          "productName": "كولا",
          "quantity": 2,
          "unitPrice": 15,
          "totalPrice": 30
        }
      ]
    },
    {
      "id": 7,
      "invoiceNumber": "INV-000007",
      "saleDate": "2026-11-06T10:52:01.6193536",
      "saleType": "Customer",
      "employeeId": null,
      "employeeName": null,
      "totalAmount": 60,
      "discountAmount": 0,
      "finalAmount": 60,
      "status": "NotReturned",
      "notes": "مرجع: عميل اولي",
      "items": [
        {
          "id": 8,
          "productId": 1,
          "productName": "كولا",
          "quantity": 2,
          "unitPrice": 15,
          "totalPrice": 30
        },
        {
          "id": 9,
          "productId": 2,
          "productName": "قهوة ساده",
          "quantity": 2,
          "unitPrice": 15,
          "totalPrice": 30
        }
      ]
    },
    {
      "id": 6,
      "invoiceNumber": "INV-000006",
      "saleDate": "2026-11-05T20:39:49.8742187",
      "saleType": "Customer",
      "employeeId": null,
      "employeeName": null,
      "totalAmount": 60,
      "discountAmount": 0,
      "finalAmount": 60,
      "status": "NotReturned",
      "notes": null,
      "items": [
        {
          "id": 6,
          "productId": 1,
          "productName": "كولا",
          "quantity": 2,
          "unitPrice": 15,
          "totalPrice": 30
        },
        {
          "id": 7,
          "productId": 2,
          "productName": "قهوة ساده",
          "quantity": 2,
          "unitPrice": 15,
          "totalPrice": 30
        }
      ]
    },
    {
      "id": 5,
      "invoiceNumber": "INV-000005",
      "saleDate": "2026-11-05T20:38:17.2090276",
      "saleType": "Customer",
      "employeeId": null,
      "employeeName": null,
      "totalAmount": 30,
      "discountAmount": 0,
      "finalAmount": 30,
      "status": "PartiallyReturned",
      "notes": null,
      "items": [
        {
          "id": 5,
          "productId": 2,
          "productName": "قهوة ساده",
          "quantity": 2,
          "unitPrice": 15,
          "totalPrice": 30
        }
      ]
    },
    {
      "id": 4,
      "invoiceNumber": "INV-000004",
      "saleDate": "2026-11-04T23:05:19.4130761",
      "saleType": "Customer",
      "employeeId": null,
      "employeeName": null,
      "totalAmount": 45,
      "discountAmount": 0,
      "finalAmount": 45,
      "status": "PartiallyReturned",
      "notes": null,
      "items": [
        {
          "id": 4,
          "productId": 1,
          "productName": "كولا",
          "quantity": 3,
          "unitPrice": 15,
          "totalPrice": 45
        }
      ]
    },
    {
      "id": 3,
      "invoiceNumber": "INV-000003",
      "saleDate": "2026-11-04T22:35:36.0462125",
      "saleType": "Customer",
      "employeeId": null,
      "employeeName": null,
      "totalAmount": 60,
      "discountAmount": 0,
      "finalAmount": 60,
      "status": "NotReturned",
      "notes": "string",
      "items": [
        {
          "id": 3,
          "productId": 1,
          "productName": "كولا",
          "quantity": 4,
          "unitPrice": 15,
          "totalPrice": 60
        }
      ]
    },
    {
      "id": 2,
      "invoiceNumber": "INV-000002",
      "saleDate": "2026-11-04T22:33:17.5818258",
      "saleType": "Customer",
      "employeeId": null,
      "employeeName": null,
      "totalAmount": 45,
      "discountAmount": 0,
      "finalAmount": 45,
      "status": "NotReturned",
      "notes": "string",
      "items": [
        {
          "id": 2,
          "productId": 1,
          "productName": "كولا",
          "quantity": 3,
          "unitPrice": 15,
          "totalPrice": 45
        }
      ]
    },
    {
      "id": 1,
      "invoiceNumber": "INV-000001",
      "saleDate": "2026-11-01T21:12:08.6905375",
      "saleType": "Customer",
      "employeeId": null,
      "employeeName": null,
      "totalAmount": 75,
      "discountAmount": 0,
      "finalAmount": 75,
      "status": "FullyReturned",
      "notes": "string",
      "items": [
        {
          "id": 1,
          "productId": 1,
          "productName": "كولا",
          "quantity": 5,
          "unitPrice": 15,
          "totalPrice": 75
        }
      ]
    }
  ],
  "totalCount": 14,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 11:20:18 GMT 
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
      "invoiceNumber": "string",
      "saleDate": "2026-11-14T11:20:32.464Z",
      "saleType": "Customer",
      "employeeId": 0,
      "employeeName": "string",
      "totalAmount": 0,
      "discountAmount": 0,
      "finalAmount": 0,
      "status": "NotReturned",
      "notes": "string",
      "items": [
        {
          "id": 0,
          "productId": 0,
          "productName": "string",
          "quantity": 0,
          "unitPrice": 0,
          "totalPrice": 0
        }
      ]
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
No links

GET
/api/sales/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
8
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/sales/8' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjJhYTU2MDU4LTliYmItNGViMy04ZWM0LWE0YWIwMWUxMTY5YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTUyMDQsImV4cCI6MTc5NDY1ODgwNCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.eFxjQp5HSkVrkkCQmeYEMyJq_h43lGXqqOfu5xHuQ_4'
Request URL
https://swimming1academy.runasp.net/api/sales/8
Server response
Code	Details
200	
Response body
Download
{
  "id": 8,
  "invoiceNumber": "INV-000008",
  "saleDate": "2026-11-10T18:47:50.6252411",
  "saleType": "Customer",
  "employeeId": null,
  "employeeName": null,
  "totalAmount": 30,
  "discountAmount": 0,
  "finalAmount": 30,
  "status": "NotReturned",
  "notes": "Single payment test",
  "items": [
    {
      "id": 10,
      "productId": 1,
      "productName": "كولا",
      "quantity": 2,
      "unitPrice": 15,
      "totalPrice": 30
    }
  ]
}