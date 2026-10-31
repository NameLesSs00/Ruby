PosDuePayments


GET
/api/pos-due-payments/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
5
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/pos-due-payments/5' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImQwN2E4YTk4LWVkNmMtNDUwOS1iMDVjLWNlZDYwOTIxOGE5YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0NzAwNjcsImV4cCI6MTc5MzQ3MDk2NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ZaUA6x2XAHXvdZw6viEKdYUVe72cI2rI8SLzuZTrsbQ'
Request URL
https://swimming1academy.runasp.net/api/pos-due-payments/5
Server response
Code	Details
200	
Response body
Download
{
  "id": 5,
  "saleId": 3,
  "payerName": "what",
  "description": "what?",
  "totalAmount": 5,
  "paidAmount": 0,
  "remainingAmount": 5,
  "dueDate": "2026-10-31",
  "status": "Unpaid",
  "createdAt": "2026-10-31T18:01:30.3774136"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 18:08:44 GMT 
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
  "saleId": 0,
  "payerName": "string",
  "description": "string",
  "totalAmount": 0,
  "paidAmount": 0,
  "remainingAmount": 0,
  "dueDate": "2026-10-31",
  "status": "Unpaid",
  "createdAt": "2026-10-31T18:09:53.878Z"
}
No links

GET
/api/pos-due-payments


Parameters
Cancel
Name	Description
status
string
(query)

--
saleId
integer($int32)
(query)
saleId
page
integer($int32)
(query)
1
pageSize
integer($int32)
(query)
20
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/pos-due-payments?page=1&pageSize=20' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImQwN2E4YTk4LWVkNmMtNDUwOS1iMDVjLWNlZDYwOTIxOGE5YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0NzAwNjcsImV4cCI6MTc5MzQ3MDk2NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ZaUA6x2XAHXvdZw6viEKdYUVe72cI2rI8SLzuZTrsbQ'
Request URL
https://swimming1academy.runasp.net/api/pos-due-payments?page=1&pageSize=20
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 5,
      "saleId": 3,
      "payerName": "what",
      "description": "what?",
      "totalAmount": 5,
      "paidAmount": 0,
      "remainingAmount": 5,
      "dueDate": "2026-10-31",
      "status": "Unpaid",
      "createdAt": "2026-10-31T18:01:30.3774136"
    },
    {
      "id": 3,
      "saleId": 2,
      "payerName": "Ahmed",
      "description": "Remaining sale invoice amount",
      "totalAmount": 5,
      "paidAmount": 5,
      "remainingAmount": 0,
      "dueDate": "2026-10-30",
      "status": "Paid",
      "createdAt": "2026-10-30T20:04:00.3294225"
    },
    {
      "id": 2,
      "saleId": 1,
      "payerName": "احمد فتحي كامل",
      "description": "Outstanding balance for sale invoice",
      "totalAmount": 80,
      "paidAmount": 60,
      "remainingAmount": 20,
      "dueDate": null,
      "status": "PartiallyPaid",
      "createdAt": "2026-10-28T17:55:02.3701745"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 3,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 18:08:10 GMT 
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
      "saleId": 0,
      "payerName": "string",
      "description": "string",
      "totalAmount": 0,
      "paidAmount": 0,
      "remainingAmount": 0,
      "dueDate": "2026-10-31",
      "status": "Unpaid",
      "createdAt": "2026-10-31T18:09:53.881Z"
    }
  ],
  "page": 0,
  "pageSize": 0,
  "totalCount": 0,
  "totalPages": 0
}
No links

POST
/api/pos-due-payments/record-payment


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "duePaymentId": 5,
  "amountPaid": 5
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/pos-due-payments/record-payment' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImQwN2E4YTk4LWVkNmMtNDUwOS1iMDVjLWNlZDYwOTIxOGE5YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0NzAwNjcsImV4cCI6MTc5MzQ3MDk2NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ZaUA6x2XAHXvdZw6viEKdYUVe72cI2rI8SLzuZTrsbQ' \
  -H 'Content-Type: application/json' \
  -d '{
  "duePaymentId": 5,
  "amountPaid": 5
}'
Request URL
https://swimming1academy.runasp.net/api/pos-due-payments/record-payment
Server response
Code	Details
200	
Response body
Download
{
  "message": "Payment of $5.00 recorded successfully for POS due payment #5.",
  "data": {
    "id": 7,
    "duePaymentId": 5,
    "amountPaid": 5,
    "paymentDate": "2026-10-31T18:09:36.9276929Z",
    "cashboxId": 1
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 18:09:36 GMT 
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
    "duePaymentId": 0,
    "amountPaid": 0,
    "paymentDate": "2026-10-31T18:09:53.883Z",
    "cashboxId": 0
  }
}
No links

GET
/api/pos-due-payments/payment-history


Parameters
Cancel
Name	Description
duePaymentId
integer($int32)
(query)
duePaymentId
page
integer($int32)
(query)
1
pageSize
integer($int32)
(query)
20
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/pos-due-payments/payment-history?page=1&pageSize=20' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImQwN2E4YTk4LWVkNmMtNDUwOS1iMDVjLWNlZDYwOTIxOGE5YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0NzAwNjcsImV4cCI6MTc5MzQ3MDk2NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ZaUA6x2XAHXvdZw6viEKdYUVe72cI2rI8SLzuZTrsbQ'
Request URL
https://swimming1academy.runasp.net/api/pos-due-payments/payment-history?page=1&pageSize=20
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 6,
      "duePaymentId": 2,
      "saleId": 1,
      "payerName": "احمد فتحي كامل",
      "amountPaid": 30,
      "paymentDate": "2026-10-30T22:42:50.6377564",
      "cashboxId": 1,
      "cashboxName": "POS"
    },
    {
      "id": 5,
      "duePaymentId": 3,
      "saleId": 2,
      "payerName": "Ahmed",
      "amountPaid": 5,
      "paymentDate": "2026-10-30T22:15:19.5876904",
      "cashboxId": 1,
      "cashboxName": "POS"
    },
    {
      "id": 1,
      "duePaymentId": 2,
      "saleId": 1,
      "payerName": "احمد فتحي كامل",
      "amountPaid": 30,
      "paymentDate": "2026-10-29T09:47:00.0902047",
      "cashboxId": 1,
      "cashboxName": "POS"
    }
  ],
  "totalCount": 3,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 18:09:29 GMT 
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
      "duePaymentId": 0,
      "saleId": 0,
      "payerName": "string",
      "amountPaid": 0,
      "paymentDate": "2026-10-31T18:09:53.885Z",
      "cashboxId": 0,
      "cashboxName": "string"
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
Sales


POST
/api/sales


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "items": [
    {
      "productId": 1,
      "quantity": 1
    },
    {
      "productId": 2,
      "quantity": 4
    }
  ],
  "discountAmount": 0,
  "amountPaid": 50,
  "payerName": "what",
  "debtDescription": "what?",
  "dueDate": "2026-10-31",
  "notes": "adsfasd"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/sales' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjVkMDEyYzUwLWU2OGEtNDI1ZS1iYzBkLTg1ZWMyNGI1OTk3ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0Njg2MTIsImV4cCI6MTc5MzQ2OTUxMiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.yG4er6ZdO5hW5yWDz9PUI8FAANNJ-69czCaACnrVViI' \
  -H 'Content-Type: application/json' \
  -d '{
  "items": [
    {
      "productId": 1,
      "quantity": 1
    },
    {
      "productId": 2,
      "quantity": 4
    }
  ],
  "discountAmount": 0,
  "amountPaid": 50,
  "payerName": "what",
  "debtDescription": "what?",
  "dueDate": "2026-10-31",
  "notes": "adsfasd"
}'
Request URL
https://swimming1academy.runasp.net/api/sales
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Sale created successfully.",
  "data": {
    "id": 3,
    "invoiceNumber": "INV-000003",
    "saleDate": "2026-10-31T18:01:30.3774122",
    "totalAmount": 55,
    "discountAmount": 0,
    "finalAmount": 55,
    "status": "NotReturned",
    "notes": "adsfasd",
    "items": [
      {
        "id": 4,
        "productId": 1,
        "productName": "pepsi",
        "quantity": 1,
        "unitPrice": 15,
        "totalPrice": 15
      },
      {
        "id": 5,
        "productId": 2,
        "productName": "tedasd",
        "quantity": 4,
        "unitPrice": 10,
        "totalPrice": 40
      }
    ]
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 18:01:29 GMT 
 location: https://swimming1academy.runasp.net/api/sales/3 
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
    "invoiceNumber": "string",
    "saleDate": "2026-10-31T18:11:22.927Z",
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
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjVkMDEyYzUwLWU2OGEtNDI1ZS1iYzBkLTg1ZWMyNGI1OTk3ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0Njg2MTIsImV4cCI6MTc5MzQ2OTUxMiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.yG4er6ZdO5hW5yWDz9PUI8FAANNJ-69czCaACnrVViI'
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
      "id": 3,
      "invoiceNumber": "INV-000003",
      "saleDate": "2026-10-31T18:01:30.3774122",
      "totalAmount": 55,
      "discountAmount": 0,
      "finalAmount": 55,
      "status": "NotReturned",
      "notes": "adsfasd",
      "items": [
        {
          "id": 4,
          "productId": 1,
          "productName": "pepsi",
          "quantity": 1,
          "unitPrice": 15,
          "totalPrice": 15
        },
        {
          "id": 5,
          "productId": 2,
          "productName": "tedasd",
          "quantity": 4,
          "unitPrice": 10,
          "totalPrice": 40
        }
      ]
    },
    {
      "id": 2,
      "invoiceNumber": "INV-000002",
      "saleDate": "2026-10-30T20:04:00.3294207",
      "totalAmount": 65,
      "discountAmount": 0,
      "finalAmount": 65,
      "status": "PartiallyReturned",
      "notes": "Partial payment",
      "items": [
        {
          "id": 2,
          "productId": 1,
          "productName": "pepsi",
          "quantity": 3,
          "unitPrice": 15,
          "totalPrice": 45
        },
        {
          "id": 3,
          "productId": 2,
          "productName": "tedasd",
          "quantity": 2,
          "unitPrice": 10,
          "totalPrice": 20
        }
      ]
    },
    {
      "id": 1,
      "invoiceNumber": "INV-000001",
      "saleDate": "2026-10-28T17:55:02.3701696",
      "totalAmount": 150,
      "discountAmount": 0,
      "finalAmount": 150,
      "status": "NotReturned",
      "notes": "string",
      "items": [
        {
          "id": 1,
          "productId": 1,
          "productName": "pepsi",
          "quantity": 10,
          "unitPrice": 15,
          "totalPrice": 150
        }
      ]
    }
  ],
  "totalCount": 3,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 18:01:52 GMT 
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
      "invoiceNumber": "string",
      "saleDate": "2026-10-31T18:11:22.932Z",
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
1
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/sales/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjVkMDEyYzUwLWU2OGEtNDI1ZS1iYzBkLTg1ZWMyNGI1OTk3ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0Njg2MTIsImV4cCI6MTc5MzQ2OTUxMiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.yG4er6ZdO5hW5yWDz9PUI8FAANNJ-69czCaACnrVViI'
Request URL
https://swimming1academy.runasp.net/api/sales/1
Server response
Code	Details
200	
Response body
Download
{
  "id": 1,
  "invoiceNumber": "INV-000001",
  "saleDate": "2026-10-28T17:55:02.3701696",
  "totalAmount": 150,
  "discountAmount": 0,
  "finalAmount": 150,
  "status": "NotReturned",
  "notes": "string",
  "items": [
    {
      "id": 1,
      "productId": 1,
      "productName": "pepsi",
      "quantity": 10,
      "unitPrice": 15,
      "totalPrice": 150
    }
  ]
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 18:02:34 GMT 
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
  "invoiceNumber": "string",
  "saleDate": "2026-10-31T18:11:22.934Z",
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
note the statue for the seach for the sales are NotReturned,PartiallyReturned   ,FullyReturned
and note that all of the 
  "payerName": "what",
  "debtDescription": "what?",
  "dueDate": "2026-10-31",
  "notes": "adsfasd"
  could be null and should be by defalut not showing only showing when we want to make this sale as pay later

SaleReturns


POST
/api/salereturns


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "saleId": 3,
  "items": [
    {
      "saleItemId": 5,
      "quantity": 2
    }
  ],
  "notes": "does not want them "
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/salereturns' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImQwN2E4YTk4LWVkNmMtNDUwOS1iMDVjLWNlZDYwOTIxOGE5YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0NzAwNjcsImV4cCI6MTc5MzQ3MDk2NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ZaUA6x2XAHXvdZw6viEKdYUVe72cI2rI8SLzuZTrsbQ' \
  -H 'Content-Type: application/json' \
  -d '{
  "saleId": 3,
  "items": [
    {
      "saleItemId": 5,
      "quantity": 2
    }
  ],
  "notes": "does not want them "
}'
Request URL
https://swimming1academy.runasp.net/api/salereturns
Server response
Code	Details
200	
Response body
Download
{
  "message": "Sale return processed successfully. Total refund: $20.00",
  "data": {
    "returns": [
      {
        "id": 5,
        "movementGroupId": 4,
        "saleId": 3,
        "saleInvoiceNumber": "INV-000003",
        "saleItemId": 5,
        "productId": 2,
        "productName": "tedasd",
        "quantity": 2,
        "unitPrice": 10,
        "totalPrice": 20,
        "returnDate": "2026-10-31T18:15:31.7547018",
        "notes": "does not want them "
      }
    ],
    "totalRefund": 20
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 18:15:31 GMT 
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
    "returns": [
      {
        "id": 0,
        "movementGroupId": 0,
        "saleId": 0,
        "saleInvoiceNumber": "string",
        "saleItemId": 0,
        "productId": 0,
        "productName": "string",
        "quantity": 0,
        "unitPrice": 0,
        "totalPrice": 0,
        "returnDate": "2026-10-31T18:16:15.302Z",
        "notes": "string"
      }
    ],
    "totalRefund": 0
  }
}
No links

GET
/api/salereturns


Parameters
Cancel
No parameters

Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/salereturns' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImQwN2E4YTk4LWVkNmMtNDUwOS1iMDVjLWNlZDYwOTIxOGE5YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0NzAwNjcsImV4cCI6MTc5MzQ3MDk2NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ZaUA6x2XAHXvdZw6viEKdYUVe72cI2rI8SLzuZTrsbQ'
Request URL
https://swimming1academy.runasp.net/api/salereturns
Server response
Code	Details
200	
Response body
Download
[
  {
    "movementGroupId": 4,
    "saleId": 3,
    "saleInvoiceNumber": "INV-000003",
    "returnDate": "2026-10-31T18:15:31.7547018",
    "notes": "does not want them ",
    "totalRefund": 20,
    "items": [
      {
        "id": 5,
        "movementGroupId": 4,
        "saleId": 3,
        "saleInvoiceNumber": "INV-000003",
        "saleItemId": 5,
        "productId": 2,
        "productName": "tedasd",
        "quantity": 2,
        "unitPrice": 10,
        "totalPrice": 20,
        "returnDate": "2026-10-31T18:15:31.7547018",
        "notes": "does not want them "
      }
    ]
  },
  {
    "movementGroupId": 3,
    "saleId": 2,
    "saleInvoiceNumber": "INV-000002",
    "returnDate": "2026-10-31T02:16:12.6333735",
    "notes": "string",
    "totalRefund": 15,
    "items": [
      {
        "id": 4,
        "movementGroupId": 3,
        "saleId": 2,
        "saleInvoiceNumber": "INV-000002",
        "saleItemId": 2,
        "productId": 1,
        "productName": "pepsi",
        "quantity": 1,
        "unitPrice": 15,
        "totalPrice": 15,
        "returnDate": "2026-10-31T02:16:12.6333735",
        "notes": "string"
      }
    ]
  },
  {
    "movementGroupId": 2,
    "saleId": 2,
    "saleInvoiceNumber": "INV-000002",
    "returnDate": "2026-10-31T02:12:36.0945474",
    "notes": "string",
    "totalRefund": 15,
    "items": [
      {
        "id": 3,
        "movementGroupId": 2,
        "saleId": 2,
        "saleInvoiceNumber": "INV-000002",
        "saleItemId": 2,
        "productId": 1,
        "productName": "pepsi",
        "quantity": 1,
        "unitPrice": 15,
        "totalPrice": 15,
        "returnDate": "2026-10-31T02:12:36.0945474",
        "notes": "string"
      }
    ]
  },
  {
    "movementGroupId": 1,
    "saleId": 2,
    "saleInvoiceNumber": "INV-000002",
    "returnDate": "2026-10-31T00:50:52.5996988",
    "notes": "string",
    "totalRefund": 15,
    "items": [
      {
        "id": 2,
        "movementGroupId": 1,
        "saleId": 2,
        "saleInvoiceNumber": "INV-000002",
        "saleItemId": 2,
        "productId": 1,
        "productName": "pepsi",
        "quantity": 1,
        "unitPrice": 15,
        "totalPrice": 15,
        "returnDate": "2026-10-31T00:50:52.5996988",
        "notes": "string"
      }
    ]
  }
]
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 18:15:34 GMT 
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
[
  {
    "movementGroupId": 0,
    "saleId": 0,
    "saleInvoiceNumber": "string",
    "returnDate": "2026-10-31T18:16:15.306Z",
    "notes": "string",
    "totalRefund": 0,
    "items": [
      {
        "id": 0,
        "movementGroupId": 0,
        "saleId": 0,
        "saleInvoiceNumber": "string",
        "saleItemId": 0,
        "productId": 0,
        "productName": "string",
        "quantity": 0,
        "unitPrice": 0,
        "totalPrice": 0,
        "returnDate": "2026-10-31T18:16:15.306Z",
        "notes": "string"
      }
    ]
  }
]
No links

GET
/api/salereturns/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
3
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/salereturns/3' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImQwN2E4YTk4LWVkNmMtNDUwOS1iMDVjLWNlZDYwOTIxOGE5YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0NzAwNjcsImV4cCI6MTc5MzQ3MDk2NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ZaUA6x2XAHXvdZw6viEKdYUVe72cI2rI8SLzuZTrsbQ'
Request URL
https://swimming1academy.runasp.net/api/salereturns/3
Server response
Code	Details
200	
Response body
Download
{
  "movementGroupId": 3,
  "saleId": 2,
  "saleInvoiceNumber": "INV-000002",
  "returnDate": "2026-10-31T02:16:12.6333735",
  "notes": "string",
  "totalRefund": 15,
  "items": [
    {
      "id": 4,
      "movementGroupId": 3,
      "saleId": 2,
      "saleInvoiceNumber": "INV-000002",
      "saleItemId": 2,
      "productId": 1,
      "productName": "pepsi",
      "quantity": 1,
      "unitPrice": 15,
      "totalPrice": 15,
      "returnDate": "2026-10-31T02:16:12.6333735",
      "notes": "string"
    }
  ]
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 18:15:47 GMT 
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
  "movementGroupId": 0,
  "saleId": 0,
  "saleInvoiceNumber": "string",
  "returnDate": "2026-10-31T18:16:15.308Z",
  "notes": "string",
  "totalRefund": 0,
  "items": [
    {
      "id": 0,
      "movementGroupId": 0,
      "saleId": 0,
      "saleInvoiceNumber": "string",
      "saleItemId": 0,
      "productId": 0,
      "productName": "string",
      "quantity": 0,
      "unitPrice": 0,
      "totalPrice": 0,
      "returnDate": "2026-10-31T18:16:15.308Z",
      "notes": "string"
    }
  ]
}
No links

PUT
/api/salereturns/{id}


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
  "returnDate": "2026-10-31T18:16:15.310Z",
  "items": [
    {
      "saleItemId": 0,
      "quantity": 0
    }
  ],
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
    "movementGroupId": 0,
    "saleId": 0,
    "saleInvoiceNumber": "string",
    "returnDate": "2026-10-31T18:16:15.311Z",
    "notes": "string",
    "totalRefund": 0,
    "items": [
      {
        "id": 0,
        "movementGroupId": 0,
        "saleId": 0,
        "saleInvoiceNumber": "string",
        "saleItemId": 0,
        "productId": 0,
        "productName": "string",
        "quantity": 0,
        "unitPrice": 0,
        "totalPrice": 0,
        "returnDate": "2026-10-31T18:16:15.311Z",
        "notes": "string"
      }
    ]
  }
}
No links

DELETE
/api/salereturns/{id}


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
and here is also the reutrn 

could you create a full plan so that we create the best POS so that it looks clean and also is easy for user to use ? it should be speartead from the admin dashboard to a page after you login to be POS and the sub section for it you could creata it as need could you create a full plan for it ?