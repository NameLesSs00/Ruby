PayrollAdjustments


POST
/api/payroll-adjustments/bonuses


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "employeeId": 1,
  "payrollMonth": "2026-12-30",
  "amount": 1000,
  "description": "string"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/payroll-adjustments/bonuses' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjM4MWI4NWY2LTE5ZTItNGU4Yy1iZTNhLWY5YmNkOTg4YTZjOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzU4MTQsImV4cCI6MTc5MzM3NjcxNCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.w7qVEIZXls55pKrqbxkOis2rxO2a1pa4R03eE6BmSu0' \
  -H 'Content-Type: application/json' \
  -d '{
  "employeeId": 1,
  "payrollMonth": "2026-12-30",
  "amount": 1000,
  "description": "string"
}'
Request URL
https://swimming1academy.runasp.net/api/payroll-adjustments/bonuses
Server response
Code	Details
200	
Response body
Download
{
  "message": "Payroll bonus recorded successfully.",
  "data": {
    "id": 6,
    "employeeId": 1,
    "amount": 1000,
    "bonusDate": "2026-10-30T16:04:15.7710057Z",
    "payrollMonth": "2026-12-01",
    "description": "string"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 16:04:15 GMT 
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
    "employeeId": 0,
    "amount": 0,
    "bonusDate": "2026-10-30T16:05:35.818Z",
    "payrollMonth": "2026-10-30",
    "description": "string"
  }
}
No links

GET
/api/payroll-adjustments/bonuses


Parameters
Cancel
Name	Description
employeeId
integer($int32)
(query)
employeeId
payrollMonth
string($date)
(query)
payrollMonth
from
string($date-time)
(query)
from
to
string($date-time)
(query)
to
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/payroll-adjustments/bonuses' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjM4MWI4NWY2LTE5ZTItNGU4Yy1iZTNhLWY5YmNkOTg4YTZjOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzU4MTQsImV4cCI6MTc5MzM3NjcxNCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.w7qVEIZXls55pKrqbxkOis2rxO2a1pa4R03eE6BmSu0'
Request URL
https://swimming1academy.runasp.net/api/payroll-adjustments/bonuses
Server response
Code	Details
200	
Response body
Download
[
  {
    "id": 6,
    "employeeId": 1,
    "amount": 1000,
    "bonusDate": "2026-10-30T16:04:15.7710057",
    "payrollMonth": "2026-12-01",
    "description": "string"
  },
  {
    "id": 5,
    "employeeId": 1,
    "amount": 1000,
    "bonusDate": "2026-10-30T13:47:00.0718748",
    "payrollMonth": "2026-11-01",
    "description": "string"
  },
  {
    "id": 4,
    "employeeId": 1,
    "amount": 4000,
    "bonusDate": "2026-10-30T13:46:06.5918727",
    "payrollMonth": "2026-11-01",
    "description": "string"
  },
  {
    "id": 3,
    "employeeId": 1,
    "amount": 500,
    "bonusDate": "2026-10-29T23:11:42.8851957",
    "payrollMonth": "2026-10-01",
    "description": "Swagger test bonus"
  },
  {
    "id": 2,
    "employeeId": 1,
    "amount": 500,
    "bonusDate": "2026-10-29T23:10:24.251965",
    "payrollMonth": "2026-10-01",
    "description": "Swagger test bonus"
  },
  {
    "id": 1,
    "employeeId": 1,
    "amount": 500,
    "bonusDate": "2026-10-29T23:07:39.5989398",
    "payrollMonth": "2026-10-01",
    "description": "Swagger test bonus"
  }
]
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 16:04:46 GMT 
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
    "employeeId": 0,
    "amount": 0,
    "bonusDate": "2026-10-30T16:05:35.824Z",
    "payrollMonth": "2026-10-30",
    "description": "string"
  }
]
No links

POST
/api/payroll-adjustments/deductions


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "employeeId": 0,
  "payrollMonth": "2026-10-30",
  "amount": 0,
  "description": "string"
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
    "employeeId": 0,
    "amount": 0,
    "deductionDate": "2026-10-30T16:05:35.826Z",
    "payrollMonth": "2026-10-30",
    "description": "string"
  }
}
No links

GET
/api/payroll-adjustments/deductions


Parameters
Try it out
Name	Description
employeeId
integer($int32)
(query)
employeeId
payrollMonth
string($date)
(query)
payrollMonth
from
string($date-time)
(query)
from
to
string($date-time)
(query)
to
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
    "employeeId": 0,
    "amount": 0,
    "deductionDate": "2026-10-30T16:05:35.829Z",
    "payrollMonth": "2026-10-30",
    "description": "string"
  }
]
Payrolls


POST
/api/payrolls


Parameters
Try it out
Reset
No parameters

Request body

application/json
Example Value
Schema
{
  "employeeId": 1,
  "payrollMonth": "2026-12-30",
  "notes": "string"
}
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/payrolls' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjM4MWI4NWY2LTE5ZTItNGU4Yy1iZTNhLWY5YmNkOTg4YTZjOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzU4MTQsImV4cCI6MTc5MzM3NjcxNCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.w7qVEIZXls55pKrqbxkOis2rxO2a1pa4R03eE6BmSu0' \
  -H 'Content-Type: application/json' \
  -d '{
  "employeeId": 1,
  "payrollMonth": "2026-12-30",
  "notes": "string"
}'
Request URL
https://swimming1academy.runasp.net/api/payrolls
Server response
Code	Details
400
Undocumented
Error: response status is 400

Response body
Download
{
  "error": "A payroll record already exists for this employee and payroll month."
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 16:04:21 GMT 
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
    "employeeId": 0,
    "payrollMonth": "2026-10-30",
    "salaryAmount": 0,
    "bonusAmount": 0,
    "deductionAmount": 0,
    "netSalary": 0,
    "paidAmount": 0,
    "remainingAmount": 0,
    "paymentStatus": 1,
    "createdAt": "2026-10-30T16:06:52.640Z",
    "notes": "string"
  }
}
No links

GET
/api/payrolls


Parameters
Try it out
No parameters

Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/payrolls' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjM4MWI4NWY2LTE5ZTItNGU4Yy1iZTNhLWY5YmNkOTg4YTZjOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzU4MTQsImV4cCI6MTc5MzM3NjcxNCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.w7qVEIZXls55pKrqbxkOis2rxO2a1pa4R03eE6BmSu0'
Request URL
https://swimming1academy.runasp.net/api/payrolls
Server response
Code	Details
200	
Response body
Download
[
  {
    "id": 4,
    "employeeId": 1,
    "payrollMonth": "2026-12-01",
    "salaryAmount": 8000,
    "bonusAmount": 1000,
    "deductionAmount": 0,
    "netSalary": 9000,
    "paidAmount": 0,
    "remainingAmount": 9000,
    "paymentStatus": 1,
    "createdAt": "2026-10-30T16:03:17.018426",
    "notes": "string"
  },
  {
    "id": 2,
    "employeeId": 1,
    "payrollMonth": "2026-11-01",
    "salaryAmount": 8000,
    "bonusAmount": 5000,
    "deductionAmount": 3000,
    "netSalary": 10000,
    "paidAmount": 4000,
    "remainingAmount": 6000,
    "paymentStatus": 2,
    "createdAt": "2026-10-29T18:58:27.0709925",
    "notes": "string"
  },
  {
    "id": 1,
    "employeeId": 1,
    "payrollMonth": "2026-10-01",
    "salaryAmount": 8000,
    "bonusAmount": 1500,
    "deductionAmount": 0,
    "netSalary": 9500,
    "paidAmount": 7000,
    "remainingAmount": 2500,
    "paymentStatus": 2,
    "createdAt": "2026-10-29T18:16:05.6420975",
    "notes": "October 2026 payroll"
  }
]
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 16:04:25 GMT 
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
    "employeeId": 0,
    "payrollMonth": "2026-10-30",
    "salaryAmount": 0,
    "bonusAmount": 0,
    "deductionAmount": 0,
    "netSalary": 0,
    "paidAmount": 0,
    "remainingAmount": 0,
    "paymentStatus": 1,
    "createdAt": "2026-10-30T16:06:52.646Z",
    "notes": "string"
  }
]
No links

GET
/api/payrolls/{id}


Parameters
Try it out
Name	Description
id *
integer($int32)
(path)
4
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/payrolls/4' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjM4MWI4NWY2LTE5ZTItNGU4Yy1iZTNhLWY5YmNkOTg4YTZjOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzU4MTQsImV4cCI6MTc5MzM3NjcxNCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.w7qVEIZXls55pKrqbxkOis2rxO2a1pa4R03eE6BmSu0'
Request URL
https://swimming1academy.runasp.net/api/payrolls/4
Server response
Code	Details
200	
Response body
Download
{
  "id": 4,
  "employeeId": 1,
  "payrollMonth": "2026-12-01",
  "salaryAmount": 8000,
  "bonusAmount": 0,
  "deductionAmount": 0,
  "netSalary": 8000,
  "paidAmount": 0,
  "remainingAmount": 8000,
  "paymentStatus": 1,
  "createdAt": "2026-10-30T16:03:17.018426",
  "notes": "string"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 16:03:20 GMT 
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
  "employeeId": 0,
  "payrollMonth": "2026-10-30",
  "salaryAmount": 0,
  "bonusAmount": 0,
  "deductionAmount": 0,
  "netSalary": 0,
  "paidAmount": 0,
  "remainingAmount": 0,
  "paymentStatus": 1,
  "createdAt": "2026-10-30T16:06:52.650Z",
  "notes": "string"
}
No links

PUT
/api/payrolls/{id}


Parameters
Try it out
Reset
Name	Description
id *
integer($int32)
(path)
3
Request body

application/json
Example Value
Schema
{
  "notes": "hahah?"
}
Responses
Curl

curl -X 'PUT' \
  'https://swimming1academy.runasp.net/api/payrolls/3' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjM4MWI4NWY2LTE5ZTItNGU4Yy1iZTNhLWY5YmNkOTg4YTZjOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzU4MTQsImV4cCI6MTc5MzM3NjcxNCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.w7qVEIZXls55pKrqbxkOis2rxO2a1pa4R03eE6BmSu0' \
  -H 'Content-Type: application/json' \
  -d '{
  "notes": "hahah?"
}'
Request URL
https://swimming1academy.runasp.net/api/payrolls/3
Server response
Code	Details
200	
Response body
Download
{
  "message": "Payroll record updated successfully.",
  "data": {
    "id": 3,
    "employeeId": 1,
    "payrollMonth": "2026-12-01",
    "salaryAmount": 8000,
    "bonusAmount": 0,
    "deductionAmount": 0,
    "netSalary": 8000,
    "paidAmount": 0,
    "remainingAmount": 8000,
    "paymentStatus": 1,
    "createdAt": "2026-10-30T16:02:38.8279892",
    "notes": "hahah?"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 16:02:57 GMT 
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
    "employeeId": 0,
    "payrollMonth": "2026-10-30",
    "salaryAmount": 0,
    "bonusAmount": 0,
    "deductionAmount": 0,
    "netSalary": 0,
    "paidAmount": 0,
    "remainingAmount": 0,
    "paymentStatus": 1,
    "createdAt": "2026-10-30T16:06:52.655Z",
    "notes": "string"
  }
}
No links

DELETE
/api/payrolls/{id}


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

curl -X 'DELETE' \
  'https://swimming1academy.runasp.net/api/payrolls/2' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjM4MWI4NWY2LTE5ZTItNGU4Yy1iZTNhLWY5YmNkOTg4YTZjOSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzU4MTQsImV4cCI6MTc5MzM3NjcxNCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.w7qVEIZXls55pKrqbxkOis2rxO2a1pa4R03eE6BmSu0'
Request URL
https://swimming1academy.runasp.net/api/payrolls/2
Server response
Code	Details
400
Undocumented
Error: response status is 400

Response body
Download
{
  "error": "Cannot delete payroll because it has related cash transactions."
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 16:06:50 GMT 
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
    "employeeId": 0,
    "payrollMonth": "2026-10-30",
    "salaryAmount": 0,
    "bonusAmount": 0,
    "deductionAmount": 0,
    "netSalary": 0,
    "paidAmount": 0,
    "remainingAmount": 0,
    "paymentStatus": 1,
    "createdAt": "2026-10-30T16:06:52.659Z",
    "notes": "string"
  }
}