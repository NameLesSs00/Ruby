SubscriptionCoachAssignments


POST
/api/subscription-coach-assignments


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "subscriptionId": 2,
  "coachId": null,
  "employeeId": 2,
  "startDate": "2026-10-31",
  "endDate": "2026-11-30",
  "notes": "string"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/subscription-coach-assignments' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijg0OTliODJmLWNlNmQtNDIxNy05NDFmLThjNmU5YWMzYTU2MyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0NzQ5MDMsImV4cCI6MTc5MzQ3NTgwMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FOCY_CsPDQkUj5RiyJq9cY6jezG8-ghf68EJqnGITDI' \
  -H 'Content-Type: application/json' \
  -d '{
  "subscriptionId": 2,
  "coachId": null,
  "employeeId": 2,
  "startDate": "2026-10-31",
  "endDate": "2026-11-30",
  "notes": "string"
}'
Request URL
https://swimming1academy.runasp.net/api/subscription-coach-assignments
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Subscription coach assignment created successfully.",
  "data": {
    "id": 3,
    "subscriptionId": 2,
    "coachId": null,
    "coachName": null,
    "employeeId": 2,
    "employeeName": "t",
    "startDate": "2026-10-31",
    "endDate": "2026-11-30",
    "notes": "string"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 19:32:17 GMT 
 location: https://swimming1academy.runasp.net/api/subscription-coach-assignments/3 
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
    "coachId": 0,
    "coachName": "string",
    "employeeId": 0,
    "employeeName": "string",
    "startDate": "2026-10-31",
    "endDate": "2026-10-31",
    "notes": "string"
  }
}
No links

GET
/api/subscription-coach-assignments


Parameters
Cancel
Name	Description
SubscriptionId
integer($int32)
(query)
SubscriptionId
CoachId
integer($int32)
(query)
CoachId
EmployeeId
integer($int32)
(query)
EmployeeId
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
  'https://swimming1academy.runasp.net/api/subscription-coach-assignments' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijg0OTliODJmLWNlNmQtNDIxNy05NDFmLThjNmU5YWMzYTU2MyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0NzQ5MDMsImV4cCI6MTc5MzQ3NTgwMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FOCY_CsPDQkUj5RiyJq9cY6jezG8-ghf68EJqnGITDI'
Request URL
https://swimming1academy.runasp.net/api/subscription-coach-assignments
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 3,
      "subscriptionId": 2,
      "coachId": null,
      "coachName": null,
      "employeeId": 2,
      "employeeName": "t",
      "startDate": "2026-10-31",
      "endDate": "2026-11-30",
      "notes": "string"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalCount": 1,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 19:32:25 GMT 
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
      "coachId": 0,
      "coachName": "string",
      "employeeId": 0,
      "employeeName": "string",
      "startDate": "2026-10-31",
      "endDate": "2026-10-31",
      "notes": "string"
    }
  ],
  "page": 0,
  "pageSize": 0,
  "totalCount": 0,
  "totalPages": 0
}
No links

GET
/api/subscription-coach-assignments/{id}


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
  'https://swimming1academy.runasp.net/api/subscription-coach-assignments/3' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijg0OTliODJmLWNlNmQtNDIxNy05NDFmLThjNmU5YWMzYTU2MyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0NzQ5MDMsImV4cCI6MTc5MzQ3NTgwMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FOCY_CsPDQkUj5RiyJq9cY6jezG8-ghf68EJqnGITDI'
Request URL
https://swimming1academy.runasp.net/api/subscription-coach-assignments/3
Server response
Code	Details
200	
Response body
Download
{
  "id": 3,
  "subscriptionId": 2,
  "coachId": null,
  "coachName": null,
  "employeeId": 2,
  "employeeName": "t",
  "startDate": "2026-10-31",
  "endDate": "2026-11-30",
  "notes": "string"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 19:32:36 GMT 
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
  "coachId": 0,
  "coachName": "string",
  "employeeId": 0,
  "employeeName": "string",
  "startDate": "2026-10-31",
  "endDate": "2026-10-31",
  "notes": "string"
}
No links

PUT
/api/subscription-coach-assignments/{id}


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
  "subscriptionId": 0,
  "coachId": 0,
  "employeeId": 0,
  "startDate": "2026-10-31",
  "endDate": "2026-10-31",
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
    "subscriptionId": 0,
    "coachId": 0,
    "coachName": "string",
    "employeeId": 0,
    "employeeName": "string",
    "startDate": "2026-10-31",
    "endDate": "2026-10-31",
    "notes": "string"
  }
}
No links

DELETE
/api/subscription-coach-assignments/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
3
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
    "coachId": 0,
    "coachName": "string",
    "employeeId": 0,
    "employeeName": "string",
    "startDate": "2026-10-31",
    "endDate": "2026-10-31",
    "notes": "string"
  }
}

GET
/api/subscription-due-payments/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
6
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/subscription-due-payments/6' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijg0OTliODJmLWNlNmQtNDIxNy05NDFmLThjNmU5YWMzYTU2MyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0NzQ5MDMsImV4cCI6MTc5MzQ3NTgwMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FOCY_CsPDQkUj5RiyJq9cY6jezG8-ghf68EJqnGITDI'
Request URL
https://swimming1academy.runasp.net/api/subscription-due-payments/6
Server response
Code	Details
200	
Response body
Download
{
  "id": 6,
  "subscriptionId": 2,
  "payerName": "حماده فتوح",
  "description": "Outstanding subscription balance",
  "totalAmount": 550,
  "paidAmount": 200,
  "remainingAmount": 350,
  "dueDate": null,
  "status": "PartiallyPaid",
  "createdAt": "2026-10-31T19:27:20.6711751"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 19:33:55 GMT 
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
  "dueDate": "2026-10-31",
  "status": "Unpaid",
  "createdAt": "2026-10-31T19:34:35.807Z"
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
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijg0OTliODJmLWNlNmQtNDIxNy05NDFmLThjNmU5YWMzYTU2MyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0NzQ5MDMsImV4cCI6MTc5MzQ3NTgwMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FOCY_CsPDQkUj5RiyJq9cY6jezG8-ghf68EJqnGITDI'
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
      "id": 6,
      "subscriptionId": 2,
      "payerName": "حماده فتوح",
      "description": "Outstanding subscription balance",
      "totalAmount": 550,
      "paidAmount": 0,
      "remainingAmount": 550,
      "dueDate": null,
      "status": "Unpaid",
      "createdAt": "2026-10-31T19:27:20.6711751"
    },
    {
      "id": 1,
      "subscriptionId": 1,
      "payerName": "حماده فتوح",
      "description": "Outstanding subscription balance",
      "totalAmount": 900,
      "paidAmount": 800,
      "remainingAmount": 100,
      "dueDate": null,
      "status": "PartiallyPaid",
      "createdAt": "2026-10-28T17:50:45.8623591"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 2,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 19:33:16 GMT 
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
      "dueDate": "2026-10-31",
      "status": "Unpaid",
      "createdAt": "2026-10-31T19:34:35.810Z"
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
  "duePaymentId": 6,
  "amountPaid": 200
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/subscription-due-payments/record-payment' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijg0OTliODJmLWNlNmQtNDIxNy05NDFmLThjNmU5YWMzYTU2MyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0NzQ5MDMsImV4cCI6MTc5MzQ3NTgwMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FOCY_CsPDQkUj5RiyJq9cY6jezG8-ghf68EJqnGITDI' \
  -H 'Content-Type: application/json' \
  -d '{
  "duePaymentId": 6,
  "amountPaid": 200
}'
Request URL
https://swimming1academy.runasp.net/api/subscription-due-payments/record-payment
Server response
Code	Details
200	
Response body
Download
{
  "message": "Payment of $200.00 recorded successfully for subscription due payment #6.",
  "data": {
    "id": 9,
    "duePaymentId": 6,
    "amountPaid": 200,
    "paymentDate": "2026-10-31T19:33:39.608855Z",
    "cashboxId": 2
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 19:33:38 GMT 
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
    "paymentDate": "2026-10-31T19:34:35.812Z",
    "cashboxId": 0
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
  'https://swimming1academy.runasp.net/api/subscription-due-payments/payment-history?duePaymentId=6&page=1&pageSize=20' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6Ijg0OTliODJmLWNlNmQtNDIxNy05NDFmLThjNmU5YWMzYTU2MyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0NzQ5MDMsImV4cCI6MTc5MzQ3NTgwMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FOCY_CsPDQkUj5RiyJq9cY6jezG8-ghf68EJqnGITDI'
Request URL
https://swimming1academy.runasp.net/api/subscription-due-payments/payment-history?duePaymentId=6&page=1&pageSize=20
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 9,
      "duePaymentId": 6,
      "subscriptionId": 2,
      "payerName": "حماده فتوح",
      "amountPaid": 200,
      "paymentDate": "2026-10-31T19:33:39.608855",
      "cashboxId": 2,
      "cashboxName": "Reception"
    }
  ],
  "totalCount": 1,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 19:34:10 GMT 
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
      "paymentDate": "2026-10-31T19:34:35.814Z",
      "cashboxId": 0,
      "cashboxName": "string"
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
note the payment status is Unpaid, PartiallyPaid, Paid
please review all of that and create a full plan for it 