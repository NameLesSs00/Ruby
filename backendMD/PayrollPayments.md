PayrollPayments


GET
/api/payroll-payments





Parameters
Cancel
No parameters

Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/payroll-payments' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjQ1MTZmZTUwLWQyMzctNDliZC04NDM3LWU4ZGQwMTNmZDY2NiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzODE0NzYsImV4cCI6MTc5MzM4MjM3NiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.vhi7wKc5WuKZL4ObwhNpfHrnI89ys9AhXlKGUtOXSIs'
Request URL
https://swimming1academy.runasp.net/api/payroll-payments
Server response
Code	Details
200	
Response body
Download
[
  {
    "id": 6,
    "payrollId": 2,
    "amountPaid": 100,
    "paymentDate": "2026-10-30T16:05:21.7072362",
    "cashboxId": 3
  },
  {
    "id": 5,
    "payrollId": 2,
    "amountPaid": 300,
    "paymentDate": "2026-10-30T13:47:46.0786116",
    "cashboxId": 3
  },
  {
    "id": 4,
    "payrollId": 2,
    "amountPaid": 3700,
    "paymentDate": "2026-10-30T13:45:05.8293934",
    "cashboxId": 3
  },
  {
    "id": 3,
    "payrollId": 1,
    "amountPaid": 3000,
    "paymentDate": "2026-10-29T18:54:53.8790337",
    "cashboxId": 3
  },
  {
    "id": 2,
    "payrollId": 1,
    "amountPaid": 2000,
    "paymentDate": "2026-10-29T18:54:23.2490567",
    "cashboxId": 3
  },
  {
    "id": 1,
    "payrollId": 1,
    "amountPaid": 2000,
    "paymentDate": "2026-10-29T18:45:22.3624306",
    "cashboxId": 3
  }
]
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 17:31:44 GMT 
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
    "payrollId": 0,
    "amountPaid": 0,
    "paymentDate": "2026-10-30T17:34:27.080Z",
    "cashboxId": 0
  }
]
No links

GET
/api/payroll-payments/payroll/{payrollId}


Parameters
Cancel
Name	Description
payrollId *
integer($int32)
(path)
2
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/payroll-payments/payroll/2' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjQ1MTZmZTUwLWQyMzctNDliZC04NDM3LWU4ZGQwMTNmZDY2NiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzODE0NzYsImV4cCI6MTc5MzM4MjM3NiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.vhi7wKc5WuKZL4ObwhNpfHrnI89ys9AhXlKGUtOXSIs'
Request URL
https://swimming1academy.runasp.net/api/payroll-payments/payroll/2
Server response
Code	Details
200	
Response body
Download
[
  {
    "id": 6,
    "payrollId": 2,
    "amountPaid": 100,
    "paymentDate": "2026-10-30T16:05:21.7072362",
    "cashboxId": 3
  },
  {
    "id": 5,
    "payrollId": 2,
    "amountPaid": 300,
    "paymentDate": "2026-10-30T13:47:46.0786116",
    "cashboxId": 3
  },
  {
    "id": 4,
    "payrollId": 2,
    "amountPaid": 3700,
    "paymentDate": "2026-10-30T13:45:05.8293934",
    "cashboxId": 3
  }
]
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 17:31:47 GMT 
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
    "payrollId": 0,
    "amountPaid": 0,
    "paymentDate": "2026-10-30T17:34:27.084Z",
    "cashboxId": 0
  }
]
No links

POST
/api/payroll-payments/record-payment


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "payrollId": 4,
  "amountPaid":9000
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/payroll-payments/record-payment' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjQ1MTZmZTUwLWQyMzctNDliZC04NDM3LWU4ZGQwMTNmZDY2NiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzODE0NzYsImV4cCI6MTc5MzM4MjM3NiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.vhi7wKc5WuKZL4ObwhNpfHrnI89ys9AhXlKGUtOXSIs' \
  -H 'Content-Type: application/json' \
  -d '{
  "payrollId": 4,
  "amountPaid":9000
}'
Request URL
https://swimming1academy.runasp.net/api/payroll-payments/record-payment
Server response
Code	Details
200	
Response body
Download
{
  "message": "Payroll payment of $9,000.00 recorded successfully for payroll #4.",
  "data": {
    "id": 7,
    "payrollId": 4,
    "amountPaid": 9000,
    "paymentDate": "2026-10-30T17:34:25.9156842Z",
    "cashboxId": 3
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 17:34:25 GMT 
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
    "payrollId": 0,
    "amountPaid": 0,
    "paymentDate": "2026-10-30T17:34:27.087Z",
    "cashboxId": 0
  }
}