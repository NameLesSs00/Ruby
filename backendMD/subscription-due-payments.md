const items = [
  "--",
  "Unpaid",
  "PartiallyPaid",
  "Paid"
];
SubscriptionDuePayments

please create a componet so that each time we send the idempotencyKey it's realted to time so that it's unqiue each time 

GET
/api/subscription-due-payments/{id}


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
  'https://swimming1academy.runasp.net/api/subscription-due-payments/2' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjhlZTliOTQ5LTU5YjItNGM5Zi05M2U4LTQ3MzEzMjU4NWE1ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTU5MjgsImV4cCI6MTc5MzgxNjgyOCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.K04fNrpDg1AR2V2IUkr8gfU-Pq_Sw1PyNJ5NLLp4mSc'
Request URL
https://swimming1academy.runasp.net/api/subscription-due-payments/2
Server response
Code	Details
200	
Response body
Download
{
  "id": 2,
  "subscriptionId": 1,
  "payerName": "Mohamed",
  "description": "Outstanding subscription balance",
  "totalAmount": 700,
  "paidAmount": 700,
  "remainingAmount": 0,
  "dueDate": null,
  "status": "Paid",
  "createdAt": "2026-11-04T11:10:42.3730613"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:12:55 GMT 
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
  "subscriptionId": 0,
  "payerName": "string",
  "description": "string",
  "totalAmount": 0,
  "paidAmount": 0,
  "remainingAmount": 0,
  "dueDate": "2026-11-04",
  "status": "Unpaid",
  "createdAt": "2026-11-04T18:14:52.010Z"
}
No links

GET
/api/subscription-due-payments


Parameters
Cancel
Name	Description
status
string
(query)

--
subscriptionId
integer($int32)
(query)
subscriptionId
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
  'https://swimming1academy.runasp.net/api/subscription-due-payments?page=1&pageSize=20' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjhlZTliOTQ5LTU5YjItNGM5Zi05M2U4LTQ3MzEzMjU4NWE1ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTU5MjgsImV4cCI6MTc5MzgxNjgyOCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.K04fNrpDg1AR2V2IUkr8gfU-Pq_Sw1PyNJ5NLLp4mSc'
Request URL
https://swimming1academy.runasp.net/api/subscription-due-payments?page=1&pageSize=20
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 5,
      "subscriptionId": 4,
      "payerName": "حماده فتوح",
      "description": "Outstanding subscription balance",
      "totalAmount": 700,
      "paidAmount": 0,
      "remainingAmount": 700,
      "dueDate": null,
      "status": "Unpaid",
      "createdAt": "2026-11-04T12:59:56.9840315"
    },
    {
      "id": 4,
      "subscriptionId": 3,
      "payerName": "حماده فتوح",
      "description": "Outstanding subscription balance",
      "totalAmount": 4000,
      "paidAmount": 4000,
      "remainingAmount": 0,
      "dueDate": null,
      "status": "Paid",
      "createdAt": "2026-11-04T12:06:27.9049327"
    },
    {
      "id": 3,
      "subscriptionId": 2,
      "payerName": "Mohamed",
      "description": "Outstanding subscription balance",
      "totalAmount": 1000,
      "paidAmount": 1000,
      "remainingAmount": 0,
      "dueDate": null,
      "status": "Paid",
      "createdAt": "2026-11-04T11:45:01.6030489"
    },
    {
      "id": 2,
      "subscriptionId": 1,
      "payerName": "Mohamed",
      "description": "Outstanding subscription balance",
      "totalAmount": 700,
      "paidAmount": 700,
      "remainingAmount": 0,
      "dueDate": null,
      "status": "Paid",
      "createdAt": "2026-11-04T11:10:42.3730613"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 4,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:12:47 GMT 
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
      "subscriptionId": 0,
      "payerName": "string",
      "description": "string",
      "totalAmount": 0,
      "paidAmount": 0,
      "remainingAmount": 0,
      "dueDate": "2026-11-04",
      "status": "Unpaid",
      "createdAt": "2026-11-04T18:14:52.013Z"
    }
  ],
  "page": 0,
  "pageSize": 0,
  "totalCount": 0,
  "totalPages": 0
}
No links

POST
/api/subscription-due-payments/record-payment


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "duePaymentId":5,
  "amountPaid": 250,
  "idempotencyKey": "qw"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/subscription-due-payments/record-payment' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjhlZTliOTQ5LTU5YjItNGM5Zi05M2U4LTQ3MzEzMjU4NWE1ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTU5MjgsImV4cCI6MTc5MzgxNjgyOCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.K04fNrpDg1AR2V2IUkr8gfU-Pq_Sw1PyNJ5NLLp4mSc' \
  -H 'Content-Type: application/json' \
  -d '{
  "duePaymentId":5,
  "amountPaid": 250,
  "idempotencyKey": "qw"
}'
Request URL
https://swimming1academy.runasp.net/api/subscription-due-payments/record-payment
Server response
Code	Details
200	
Response body
Download
{
  "message": "Payment of $250.00 recorded successfully for subscription due payment #5.",
  "data": {
    "id": 9,
    "duePaymentId": 5,
    "amountPaid": 250,
    "paymentDate": "2026-11-04T18:14:32.6820531",
    "cashboxType": "Subscriptions"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:14:32 GMT 
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
    "paymentDate": "2026-11-04T18:14:52.015Z",
    "cashboxType": "POS"
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
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjhlZTliOTQ5LTU5YjItNGM5Zi05M2U4LTQ3MzEzMjU4NWE1ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTU5MjgsImV4cCI6MTc5MzgxNjgyOCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.K04fNrpDg1AR2V2IUkr8gfU-Pq_Sw1PyNJ5NLLp4mSc'
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
      "id": 6,
      "duePaymentId": 4,
      "subscriptionId": 3,
      "payerName": "حماده فتوح",
      "amountPaid": 1000,
      "paymentDate": "2026-11-04T12:12:01.7316524",
      "cashboxType": "Subscriptions"
    },
    {
      "id": 5,
      "duePaymentId": 4,
      "subscriptionId": 3,
      "payerName": "حماده فتوح",
      "amountPaid": 1500,
      "paymentDate": "2026-11-04T12:10:22.7965429",
      "cashboxType": "Subscriptions"
    },
    {
      "id": 4,
      "duePaymentId": 4,
      "subscriptionId": 3,
      "payerName": "حماده فتوح",
      "amountPaid": 1500,
      "paymentDate": "2026-11-04T12:08:59.9860851",
      "cashboxType": "Subscriptions"
    },
    {
      "id": 3,
      "duePaymentId": 3,
      "subscriptionId": 2,
      "payerName": "Mohamed",
      "amountPaid": 1000,
      "paymentDate": "2026-11-04T11:47:54.0130708",
      "cashboxType": "Subscriptions"
    },
    {
      "id": 2,
      "duePaymentId": 2,
      "subscriptionId": 1,
      "payerName": "Mohamed",
      "amountPaid": 400,
      "paymentDate": "2026-11-04T11:35:38.2335451",
      "cashboxType": "Subscriptions"
    },
    {
      "id": 1,
      "duePaymentId": 2,
      "subscriptionId": 1,
      "payerName": "Mohamed",
      "amountPaid": 300,
      "paymentDate": "2026-11-04T11:16:44.1272504",
      "cashboxType": "Subscriptions"
    }
  ],
  "totalCount": 6,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:13:00 GMT 
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
      "subscriptionId": 0,
      "payerName": "string",
      "amountPaid": 0,
      "paymentDate": "2026-11-04T18:14:52.018Z",
      "cashboxType": "POS"
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
SubscriptionCancellations


POST
/api/subscription-cancellations


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "subscriptionId": 1,
  "reason": "dfghjkl;,mnbv",
  "refundAmount": 200,
  "notes": "bsfdjodfjg"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/subscription-cancellations' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjhlZTliOTQ5LTU5YjItNGM5Zi05M2U4LTQ3MzEzMjU4NWE1ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTU5MjgsImV4cCI6MTc5MzgxNjgyOCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.K04fNrpDg1AR2V2IUkr8gfU-Pq_Sw1PyNJ5NLLp4mSc' \
  -H 'Content-Type: application/json' \
  -d '{
  "subscriptionId": 1,
  "reason": "dfghjkl;,mnbv",
  "refundAmount": 200,
  "notes": "bsfdjodfjg"
}'
Request URL
https://swimming1academy.runasp.net/api/subscription-cancellations
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Subscription cancellation registered successfully.",
  "data": {
    "id": 2,
    "subscriptionId": 1,
    "cancellationDate": "2026-11-04T18:20:44.6385575Z",
    "reason": "dfghjkl;,mnbv",
    "refundAmount": 200,
    "paidRefundAmount": 0,
    "remainingRefundAmount": 200,
    "paymentStatus": "Unpaid",
    "notes": "bsfdjodfjg"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:20:44 GMT 
 location: https://swimming1academy.runasp.net/api/subscription-cancellations/2 
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
    "subscriptionId": 0,
    "cancellationDate": "2026-11-04T18:21:52.566Z",
    "reason": "string",
    "refundAmount": 0,
    "paidRefundAmount": 0,
    "remainingRefundAmount": 0,
    "paymentStatus": "Unpaid",
    "notes": "string"
  }
}
No links

GET
/api/subscription-cancellations


Parameters
Cancel
No parameters

Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/subscription-cancellations' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjhlZTliOTQ5LTU5YjItNGM5Zi05M2U4LTQ3MzEzMjU4NWE1ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTU5MjgsImV4cCI6MTc5MzgxNjgyOCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.K04fNrpDg1AR2V2IUkr8gfU-Pq_Sw1PyNJ5NLLp4mSc'
Request URL
https://swimming1academy.runasp.net/api/subscription-cancellations
Server response
Code	Details
200	
Response body
Download
[
  {
    "id": 2,
    "subscriptionId": 1,
    "cancellationDate": "2026-11-04T18:20:44.6385575",
    "reason": "dfghjkl;,mnbv",
    "refundAmount": 200,
    "paidRefundAmount": 0,
    "remainingRefundAmount": 200,
    "paymentStatus": "Unpaid",
    "notes": "bsfdjodfjg"
  },
  {
    "id": 1,
    "subscriptionId": 4,
    "cancellationDate": "2026-11-04T13:15:27.8556463",
    "reason": "string",
    "refundAmount": 500,
    "paidRefundAmount": 0,
    "remainingRefundAmount": 500,
    "paymentStatus": "Unpaid",
    "notes": "string"
  }
]
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:20:54 GMT 
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
    "id": 0,
    "subscriptionId": 0,
    "cancellationDate": "2026-11-04T18:21:52.568Z",
    "reason": "string",
    "refundAmount": 0,
    "paidRefundAmount": 0,
    "remainingRefundAmount": 0,
    "paymentStatus": "Unpaid",
    "notes": "string"
  }
]
No links

GET
/api/subscription-cancellations/{id}


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
  'https://swimming1academy.runasp.net/api/subscription-cancellations/2' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjhlZTliOTQ5LTU5YjItNGM5Zi05M2U4LTQ3MzEzMjU4NWE1ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTU5MjgsImV4cCI6MTc5MzgxNjgyOCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.K04fNrpDg1AR2V2IUkr8gfU-Pq_Sw1PyNJ5NLLp4mSc'
Request URL
https://swimming1academy.runasp.net/api/subscription-cancellations/2
Server response
Code	Details
200	
Response body
Download
{
  "id": 2,
  "subscriptionId": 1,
  "cancellationDate": "2026-11-04T18:20:44.6385575",
  "reason": "dfghjkl;,mnbv",
  "refundAmount": 200,
  "paidRefundAmount": 0,
  "remainingRefundAmount": 200,
  "paymentStatus": "Unpaid",
  "notes": "bsfdjodfjg"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:20:59 GMT 
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
  "subscriptionId": 0,
  "cancellationDate": "2026-11-04T18:21:52.569Z",
  "reason": "string",
  "refundAmount": 0,
  "paidRefundAmount": 0,
  "remainingRefundAmount": 0,
  "paymentStatus": "Unpaid",
  "notes": "string"
}
No links

POST
/api/subscription-cancellations/{id}/refund-payments


Parameters
Cancel
Reset
Name	Description
id *
integer($int32)
(path)
2
Request body

application/json
{
  "paymentAmount": 100,
  "cashboxType": "Subscriptions",
  "notes": "dfghjkl"
}
Execute
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
    "subscriptionId": 0,
    "cancellationDate": "2026-11-04T18:21:52.571Z",
    "reason": "string",
    "refundAmount": 0,
    "paidRefundAmount": 0,
    "remainingRefundAmount": 0,
    "paymentStatus": "Unpaid",
    "notes": "string"
  }
}