POST
/api/subscription-due-payments/record-payment


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
  "message": "string",
  "data": {
    "id": 0,
    "duePaymentId": 0,
    "amountPaid": 0,
    "paymentDate": "2026-11-14T11:28:36.984Z",
    "cashboxType": "POS",
    "payments": [
      {
        "paymentMethod": "Cash",
        "amount": 0
      }
    ]
  }
}
No links

GET
/api/subscription-due-payments/payment-history


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
  'https://swimming1academy.runasp.net/api/subscription-due-payments/payment-history?page=1&pageSize=20' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjJhYTU2MDU4LTliYmItNGViMy04ZWM0LWE0YWIwMWUxMTY5YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTUyMDQsImV4cCI6MTc5NDY1ODgwNCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.eFxjQp5HSkVrkkCQmeYEMyJq_h43lGXqqOfu5xHuQ_4'
Request URL
https://swimming1academy.runasp.net/api/subscription-due-payments/payment-history?page=1&pageSize=20
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 15,
      "duePaymentId": 14,
      "subscriptionId": 10,
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
      "id": 12,
      "duePaymentId": 14,
      "subscriptionId": 10,
      "payerName": "احمد",
      "amountPaid": 500,
      "paymentDate": "2026-11-05T20:14:37.5000172",
      "cashboxType": "Subscriptions",
      "payments": []
    },
    {
      "id": 11,
      "duePaymentId": 12,
      "subscriptionId": 8,
      "payerName": "حماده فتوح",
      "amountPaid": 400,
      "paymentDate": "2026-11-04T22:47:04.0959908",
      "cashboxType": "Subscriptions",
      "payments": []
    },
    {
      "id": 10,
      "duePaymentId": 9,
      "subscriptionId": 7,
      "payerName": "حماده فتوح",
      "amountPaid": 800,
      "paymentDate": "2026-11-04T21:28:54.6206283",
      "cashboxType": "Subscriptions",
      "payments": []
    },
    {
      "id": 9,
      "duePaymentId": 5,
      "subscriptionId": 4,
      "payerName": "حماده فتوح",
      "amountPaid": 250,
      "paymentDate": "2026-11-04T18:14:32.6820531",
      "cashboxType": "Subscriptions",
      "payments": []
    },
    {
      "id": 6,
      "duePaymentId": 4,
      "subscriptionId": 3,
      "payerName": "حماده فتوح",
      "amountPaid": 1000,
      "paymentDate": "2026-11-04T12:12:01.7316524",
      "cashboxType": "Subscriptions",
      "payments": []
    },
    {
      "id": 5,
      "duePaymentId": 4,
      "subscriptionId": 3,
      "payerName": "حماده فتوح",
      "amountPaid": 1500,
      "paymentDate": "2026-11-04T12:10:22.7965429",
      "cashboxType": "Subscriptions",
      "payments": []
    },
    {
      "id": 4,
      "duePaymentId": 4,
      "subscriptionId": 3,
      "payerName": "حماده فتوح",
      "amountPaid": 1500,
      "paymentDate": "2026-11-04T12:08:59.9860851",
      "cashboxType": "Subscriptions",
      "payments": []
    },
    {
      "id": 3,
      "duePaymentId": 3,
      "subscriptionId": 2,
      "payerName": "Mohamed",
      "amountPaid": 1000,
      "paymentDate": "2026-11-04T11:47:54.0130708",
      "cashboxType": "Subscriptions",
      "payments": []
    },
    {
      "id": 2,
      "duePaymentId": 2,
      "subscriptionId": 1,
      "payerName": "Mohamed",
      "amountPaid": 400,
      "paymentDate": "2026-11-04T11:35:38.2335451",
      "cashboxType": "Subscriptions",
      "payments": []
    },
    {
      "id": 1,
      "duePaymentId": 2,
      "subscriptionId": 1,
      "payerName": "Mohamed",
      "amountPaid": 300,
      "paymentDate": "2026-11-04T11:16:44.1272504",
      "cashboxType": "Subscriptions",
      "payments": []
    }
  ],
  "totalCount": 11,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 11:28:02 GMT 
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