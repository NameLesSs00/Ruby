this have been updtaed could you review it and create a plan for it ?
DuePaymentTransactions


POST
/api/due-payment-transactions


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "duePaymentId": 0,
  "payments": [
    {
      "paymentMethod": "Cash",
      "amount": 0
    }
  ],
  "idempotencyKey": "string"
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
  "id": 0,
  "duePaymentId": 0,
  "payerName": "string",
  "amountPaid": 0,
  "paymentDate": "2026-11-14T10:29:06.555Z",
  "cashboxType": "POS",
  "payments": [
    {
      "paymentMethod": "Cash",
      "amount": 0
    }
  ]
}
No links

GET
/api/due-payment-transactions


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
10
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/due-payment-transactions?page=1&pageSize=10' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjkxNTRkNDU1LWJhYjUtNDFiZi1iNDA1LWVlY2JiMDlmYzg2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTA5NDcsImV4cCI6MTc5NDY1NDU0NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.4yzaRgOK0b5-4obHhRJ0x4dcFJQVEiareG7xdQcUgk0'
Request URL
https://swimming1academy.runasp.net/api/due-payment-transactions?page=1&pageSize=10
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 18,
      "duePaymentId": 22,
      "payerName": "اسم الجهة المستأجرة",
      "amountPaid": 700,
      "paymentDate": "2026-11-13T14:25:40.5727583",
      "cashboxType": "Main",
      "payments": [
        {
          "paymentMethod": "Cash",
          "amount": 700
        }
      ]
    },
    {
      "id": 17,
      "duePaymentId": 21,
      "payerName": "حمو",
      "amountPaid": 35,
      "paymentDate": "2026-11-13T14:05:21.7679661",
      "cashboxType": "POS",
      "payments": [
        {
          "paymentMethod": "Cash",
          "amount": 35
        }
      ]
    },
    {
      "id": 16,
      "duePaymentId": 20,
      "payerName": "string",
      "amountPaid": 30,
      "paymentDate": "2026-11-11T11:17:10.5852653",
      "cashboxType": "POS",
      "payments": [
        {
          "paymentMethod": "Visa",
          "amount": 30
        }
      ]
    },
    {
      "id": 15,
      "duePaymentId": 14,
      "payerName": "احمد",
      "amountPaid": 1000,
      "paymentDate": "2026-11-10T18:51:13.7430767",
      "cashboxType": "Subscriptions",
      "payments": [
        {
          "paymentMethod": "VodafoneCash",
          "amount": 1000
        }
      ]
    },
    {
      "id": 14,
      "duePaymentId": 16,
      "payerName": "test",
      "amountPaid": 30,
      "paymentDate": "2026-11-05T20:40:06.8301447",
      "cashboxType": "POS",
      "payments": []
    },
    {
      "id": 13,
      "duePaymentId": 15,
      "payerName": "علي",
      "amountPaid": 50,
      "paymentDate": "2026-11-05T20:28:09.685134",
      "cashboxType": "Main",
      "payments": []
    },
    {
      "id": 12,
      "duePaymentId": 14,
      "payerName": "احمد",
      "amountPaid": 500,
      "paymentDate": "2026-11-05T20:14:37.5000172",
      "cashboxType": "Subscriptions",
      "payments": []
    },
    {
      "id": 11,
      "duePaymentId": 12,
      "payerName": "حماده فتوح",
      "amountPaid": 400,
      "paymentDate": "2026-11-04T22:47:04.0959908",
      "cashboxType": "Subscriptions",
      "payments": []
    },
    {
      "id": 10,
      "duePaymentId": 9,
      "payerName": "حماده فتوح",
      "amountPaid": 800,
      "paymentDate": "2026-11-04T21:28:54.6206283",
      "cashboxType": "Subscriptions",
      "payments": []
    },
    {
      "id": 9,
      "duePaymentId": 5,
      "payerName": "حماده فتوح",
      "amountPaid": 250,
      "paymentDate": "2026-11-04T18:14:32.6820531",
      "cashboxType": "Subscriptions",
      "payments": []
    }
  ],
  "totalCount": 18,
  "page": 1,
  "pageSize": 10,
  "totalPages": 2
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 10:28:32 GMT 
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
      "payerName": "string",
      "amountPaid": 0,
      "paymentDate": "2026-11-14T10:29:06.559Z",
      "cashboxType": "POS",
      "payments": [
        {
          "paymentMethod": "Cash",
          "amount": 0
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
/api/due-payment-transactions/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
2
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/due-payment-transactions/2' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjkxNTRkNDU1LWJhYjUtNDFiZi1iNDA1LWVlY2JiMDlmYzg2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTA5NDcsImV4cCI6MTc5NDY1NDU0NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.4yzaRgOK0b5-4obHhRJ0x4dcFJQVEiareG7xdQcUgk0'
Request URL
https://swimming1academy.runasp.net/api/due-payment-transactions/2
Server response
Code	Details
200	
Response body
Download
{
  "id": 2,
  "duePaymentId": 2,
  "payerName": "Mohamed",
  "amountPaid": 400,
  "paymentDate": "2026-11-04T11:35:38.2335451",
  "cashboxType": "Subscriptions",
  "payments": []
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 10:28:42 GMT 
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
  "duePaymentId": 0,
  "payerName": "string",
  "amountPaid": 0,
  "paymentDate": "2026-11-14T10:29:06.561Z",
  "cashboxType": "POS",
  "payments": [
    {
      "paymentMethod": "Cash",
      "amount": 0
    }
  ]
}