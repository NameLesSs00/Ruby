POST
/api/pos-due-payments/record-payment


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
    "paymentDate": "2026-11-14T11:35:57.869Z",
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
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjJhYTU2MDU4LTliYmItNGViMy04ZWM0LWE0YWIwMWUxMTY5YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTUyMDQsImV4cCI6MTc5NDY1ODgwNCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.eFxjQp5HSkVrkkCQmeYEMyJq_h43lGXqqOfu5xHuQ_4'
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
      "id": 17,
      "duePaymentId": 21,
      "saleId": 12,
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
      "saleId": 11,
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
      "id": 14,
      "duePaymentId": 16,
      "saleId": 6,
      "payerName": "test",
      "amountPaid": 30,
      "paymentDate": "2026-11-05T20:40:06.8301447",
      "cashboxType": "POS",
      "payments": []
    }
  ],
  "totalCount": 3,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}