CashTransactions


GET
/api/cash-transactions/balances


Parameters
Cancel
No parameters

Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/cash-transactions/balances' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijk2MWI0YzkyLWNhNzYtNDE0OS04ZDcwLTQ4YzM2NTE2MTkwZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MjUxNjgsImV4cCI6MTc5MzgyNjA2OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.kUUgC8Nj4HgP0a-KebV2Mow74MoIFI6rop3FMcLLjcY'
Request URL
https://swimming1academy.runasp.net/api/cash-transactions/balances
Server response
Code	Details
200	
Response body
Download
[
  {
    "cashboxType": "POS",
    "cashboxName": "POS",
    "totalIncome": 440,
    "totalExpense": 150,
    "balance": 290
  },
  {
    "cashboxType": "Subscriptions",
    "cashboxName": "Subscriptions",
    "totalIncome": 7450,
    "totalExpense": 5200,
    "balance": 2250
  },
  {
    "cashboxType": "Main",
    "cashboxName": "Main",
    "totalIncome": 5720,
    "totalExpense": 660,
    "balance": 5060
  }
]
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 20:48:22 GMT 
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
    "cashboxType": "POS",
    "cashboxName": "string",
    "totalIncome": 0,
    "totalExpense": 0,
    "balance": 0
  }
]
No links

GET
/api/cash-transactions

Name	Description
CashboxType
string
(query)
Available values : POS, Subscriptions, Main


Subscriptions
TransactionType
string
(query)
Available values : Income, Expense


Income
ReferenceType
string
(query)
Available values : Subscription, Sale, Payroll, Expense, SubscriptionCancellation, SaleReturn, OtherIncome, DuePaymentCollection, CoachPayment, PurchaseInvoicePayment, CashTransfer


Subscription


Parameters
Cancel
Name	Description
CashboxType
string
(query)

Subscriptions
TransactionType
string
(query)

Income
ReferenceType
string
(query)

Subscription
FromDate
string($date)
(query)
FromDate
ToDate
string($date)
(query)
ToDate
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/cash-transactions?CashboxType=Subscriptions&TransactionType=Income&ReferenceType=Subscription' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijk2MWI0YzkyLWNhNzYtNDE0OS04ZDcwLTQ4YzM2NTE2MTkwZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MjUxNjgsImV4cCI6MTc5MzgyNjA2OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.kUUgC8Nj4HgP0a-KebV2Mow74MoIFI6rop3FMcLLjcY'
Request URL
https://swimming1academy.runasp.net/api/cash-transactions?CashboxType=Subscriptions&TransactionType=Income&ReferenceType=Subscription
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 17,
      "cashboxType": "Subscriptions",
      "cashboxName": "Subscriptions",
      "transactionType": "Income",
      "transactionTypeName": "Income",
      "amount": 500,
      "transactionDate": "2026-11-04T12:59:57.2533764",
      "referenceType": "Subscription",
      "referenceTypeName": "Subscription",
      "referenceId": 4,
      "notes": "Initial payment for subscription #4 - حماده فتوح",
      "isVoided": false,
      "voidedAt": null
    },
    {
      "id": 12,
      "cashboxType": "Subscriptions",
      "cashboxName": "Subscriptions",
      "transactionType": "Income",
      "transactionTypeName": "Income",
      "amount": 500,
      "transactionDate": "2026-11-04T11:45:01.6276328",
      "referenceType": "Subscription",
      "referenceTypeName": "Subscription",
      "referenceId": 2,
      "notes": "Initial payment for subscription #2 - Mohamed",
      "isVoided": false,
      "voidedAt": null
    },
    {
      "id": 9,
      "cashboxType": "Subscriptions",
      "cashboxName": "Subscriptions",
      "transactionType": "Income",
      "transactionTypeName": "Income",
      "amount": 500,
      "transactionDate": "2026-11-04T11:10:42.5680192",
      "referenceType": "Subscription",
      "referenceTypeName": "Subscription",
      "referenceId": 1,
      "notes": "Initial payment for subscription #1 - Mohamed",
      "isVoided": false,
      "voidedAt": null
    }
  ],
  "pageNumber": 1,
  "pageSize": 20,
  "totalCount": 3,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 20:49:14 GMT 
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
      "cashboxType": "POS",
      "cashboxName": "string",
      "transactionType": "Income",
      "transactionTypeName": "string",
      "amount": 0,
      "transactionDate": "2026-11-04T20:49:34.095Z",
      "referenceType": "Subscription",
      "referenceTypeName": "string",
      "referenceId": 0,
      "notes": "string",
      "isVoided": true,
      "voidedAt": "2026-11-04T20:49:34.095Z"
    }
  ],
  "pageNumber": 0,
  "pageSize": 0,
  "totalCount": 0,
  "totalPages": 0
}
CashTransfers


POST
/api/cash-transfers


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "fromCashboxType": "POS",
  "toCashboxType": "Subscriptions ",
  "amount": 10,
  "notes": "string"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/cash-transfers' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijk2MWI0YzkyLWNhNzYtNDE0OS04ZDcwLTQ4YzM2NTE2MTkwZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MjUxNjgsImV4cCI6MTc5MzgyNjA2OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.kUUgC8Nj4HgP0a-KebV2Mow74MoIFI6rop3FMcLLjcY' \
  -H 'Content-Type: application/json' \
  -d '{
  "fromCashboxType": "POS",
  "toCashboxType": "Subscriptions ",
  "amount": 10,
  "notes": "string"
}'
Request URL
https://swimming1academy.runasp.net/api/cash-transfers
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Cash transfer created successfully.",
  "data": {
    "id": 4,
    "fromCashboxType": "POS",
    "toCashboxType": "Subscriptions",
    "amount": 10,
    "transferDate": "2026-11-04T20:53:52.4998045Z",
    "notes": "string"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 20:53:52 GMT 
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
    "fromCashboxType": "POS",
    "toCashboxType": "POS",
    "amount": 0,
    "transferDate": "2026-11-04T20:54:27.168Z",
    "notes": "string"
  }
}
No links

GET
/api/cash-transfers


Parameters
Cancel
Name	Description
FromCashboxType
string
(query)

--
ToCashboxType
string
(query)

--
FromDate
string($date)
(query)
FromDate
ToDate
string($date)
(query)
ToDate
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/cash-transfers' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijk2MWI0YzkyLWNhNzYtNDE0OS04ZDcwLTQ4YzM2NTE2MTkwZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MjUxNjgsImV4cCI6MTc5MzgyNjA2OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.kUUgC8Nj4HgP0a-KebV2Mow74MoIFI6rop3FMcLLjcY'
Request URL
https://swimming1academy.runasp.net/api/cash-transfers
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 4,
      "fromCashboxType": "POS",
      "toCashboxType": "Subscriptions",
      "amount": 10,
      "transferDate": "2026-11-04T20:53:52.4998045",
      "notes": "string"
    },
    {
      "id": 3,
      "fromCashboxType": "Subscriptions",
      "toCashboxType": "Main",
      "amount": 1000,
      "transferDate": "2026-11-04T13:12:04.4981601",
      "notes": "string"
    },
    {
      "id": 2,
      "fromCashboxType": "Subscriptions",
      "toCashboxType": "Main",
      "amount": 3700,
      "transferDate": "2026-11-04T13:10:18.3364948",
      "notes": "string"
    },
    {
      "id": 1,
      "fromCashboxType": "Main",
      "toCashboxType": "POS",
      "amount": 400,
      "transferDate": "2026-11-04T09:57:22.721291",
      "notes": "string"
    }
  ],
  "pageNumber": 1,
  "pageSize": 20,
  "totalCount": 4,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 20:53:57 GMT 
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
      "fromCashboxType": "POS",
      "toCashboxType": "POS",
      "amount": 0,
      "transferDate": "2026-11-04T20:54:27.178Z",
      "notes": "string"
    }
  ],
  "pageNumber": 0,
  "pageSize": 0,
  "totalCount": 0,
  "totalPages": 0
}