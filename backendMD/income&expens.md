OtherIncomes


POST
/api/other-incomes


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "amount": 1000,
  "incomeDate": "2026-11-04T07:55:22.820Z",
  "description": "event"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/other-incomes' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAwNWNjNGY3LTQxYjAtNDVjYy04NzcyLWZiMTA3MzNmYzIzMyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzg3ODgsImV4cCI6MTc5Mzc3OTY4OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.QSmSvphaOpW7BmYKMN87UttA9z94XTINB5naPh_Wvg4' \
  -H 'Content-Type: application/json' \
  -d '{
  "amount": 1000,
  "incomeDate": "2026-11-04T07:55:22.820Z",
  "description": "event"
}'
Request URL
https://swimming1academy.runasp.net/api/other-incomes
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Other income created successfully.",
  "data": {
    "id": 1,
    "amount": 1000,
    "incomeDate": "2026-11-04T07:55:22.82",
    "description": "event",
    "cashboxType": "Main"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 07:55:14 GMT 
 location: https://swimming1academy.runasp.net/api/other-incomes/1 
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
    "amount": 0,
    "incomeDate": "2026-11-04T07:56:25.476Z",
    "description": "string",
    "cashboxType": "POS"
  }
}
No links

GET
/api/other-incomes


Parameters
Cancel
Name	Description
Page
integer($int32)
(query)
Page
PageSize
integer($int32)
(query)
PageSize
Search
string
(query)
Search
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/other-incomes' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAwNWNjNGY3LTQxYjAtNDVjYy04NzcyLWZiMTA3MzNmYzIzMyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzg3ODgsImV4cCI6MTc5Mzc3OTY4OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.QSmSvphaOpW7BmYKMN87UttA9z94XTINB5naPh_Wvg4'
Request URL
https://swimming1academy.runasp.net/api/other-incomes
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 1,
      "amount": 1000,
      "incomeDate": "2026-11-04T07:55:22.82",
      "description": "event",
      "cashboxType": "Main"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalCount": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 07:55:20 GMT 
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
      "amount": 0,
      "incomeDate": "2026-11-04T07:56:25.478Z",
      "description": "string",
      "cashboxType": "POS"
    }
  ],
  "page": 0,
  "pageSize": 0,
  "totalCount": 0
}
No links

GET
/api/other-incomes/{id}


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
  'https://swimming1academy.runasp.net/api/other-incomes/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAwNWNjNGY3LTQxYjAtNDVjYy04NzcyLWZiMTA3MzNmYzIzMyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzg3ODgsImV4cCI6MTc5Mzc3OTY4OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.QSmSvphaOpW7BmYKMN87UttA9z94XTINB5naPh_Wvg4'
Request URL
https://swimming1academy.runasp.net/api/other-incomes/1
Server response
Code	Details
200	
Response body
Download
{
  "id": 1,
  "amount": 1000,
  "incomeDate": "2026-11-04T07:55:22.82",
  "description": "event",
  "cashboxType": "Main"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 07:55:26 GMT 
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
  "amount": 0,
  "incomeDate": "2026-11-04T07:56:25.479Z",
  "description": "string",
  "cashboxType": "POS"
}
No links

PUT
/api/other-incomes/{id}


Parameters
Cancel
Reset
Name	Description
id *
integer($int32)
(path)
1
Request body

application/json
{
  "amount": 10001,
  "incomeDate": "2026-11-04T07:56:00.076Z",
  "description": "aaa"
}
Execute
Clear
Responses
Curl

curl -X 'PUT' \
  'https://swimming1academy.runasp.net/api/other-incomes/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAwNWNjNGY3LTQxYjAtNDVjYy04NzcyLWZiMTA3MzNmYzIzMyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzg3ODgsImV4cCI6MTc5Mzc3OTY4OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.QSmSvphaOpW7BmYKMN87UttA9z94XTINB5naPh_Wvg4' \
  -H 'Content-Type: application/json' \
  -d '{
  "amount": 10001,
  "incomeDate": "2026-11-04T07:56:00.076Z",
  "description": "aaa"
}'
Request URL
https://swimming1academy.runasp.net/api/other-incomes/1
Server response
Code	Details
200	
Response body
Download
{
  "message": "Other income updated successfully.",
  "data": {
    "id": 1,
    "amount": 10001,
    "incomeDate": "2026-11-04T07:56:00.076",
    "description": "aaa",
    "cashboxType": "Main"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 07:55:51 GMT 
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
    "amount": 0,
    "incomeDate": "2026-11-04T07:56:25.481Z",
    "description": "string",
    "cashboxType": "POS"
  }
}
No links

DELETE
/api/other-incomes/{id}


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

curl -X 'DELETE' \
  'https://swimming1academy.runasp.net/api/other-incomes/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAwNWNjNGY3LTQxYjAtNDVjYy04NzcyLWZiMTA3MzNmYzIzMyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzg3ODgsImV4cCI6MTc5Mzc3OTY4OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.QSmSvphaOpW7BmYKMN87UttA9z94XTINB5naPh_Wvg4'
Request URL
https://swimming1academy.runasp.net/api/other-incomes/1
Server response
Code	Details
200	
Response body
Download
{
  "message": "Other income deleted successfully.",
  "data": {}
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 07:56:06 GMT 
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
  "data": "string"
}
Expenses


POST
/api/expenses


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "amount": 100,
  "expenseDate": "2026-11-04T08:00:31.692Z",
  "description": "broken chair fix",
  "cashboxType": "Main"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/expenses' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAwNWNjNGY3LTQxYjAtNDVjYy04NzcyLWZiMTA3MzNmYzIzMyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzg3ODgsImV4cCI6MTc5Mzc3OTY4OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.QSmSvphaOpW7BmYKMN87UttA9z94XTINB5naPh_Wvg4' \
  -H 'Content-Type: application/json' \
  -d '{
  "amount": 100,
  "expenseDate": "2026-11-04T08:00:31.692Z",
  "description": "broken chair fix",
  "cashboxType": "Main"
}'
Request URL
https://swimming1academy.runasp.net/api/expenses
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Expense created successfully.",
  "data": {
    "id": 1,
    "amount": 100,
    "expenseDate": "2026-11-04T08:00:31.692",
    "description": "broken chair fix",
    "cashboxType": "Main",
    "createdAt": "2026-11-04T08:00:38.3212914"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 08:00:37 GMT 
 location: https://swimming1academy.runasp.net/api/expenses/1 
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
    "amount": 0,
    "expenseDate": "2026-11-04T08:01:38.793Z",
    "description": "string",
    "cashboxType": "POS",
    "createdAt": "2026-11-04T08:01:38.793Z"
  }
}
No links

GET
/api/expenses


Parameters
Cancel
Name	Description
Page
integer($int32)
(query)
Page
PageSize
integer($int32)
(query)
PageSize
Search
string
(query)
Search
CashboxType
string
(query)

--
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/expenses' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAwNWNjNGY3LTQxYjAtNDVjYy04NzcyLWZiMTA3MzNmYzIzMyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzg3ODgsImV4cCI6MTc5Mzc3OTY4OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.QSmSvphaOpW7BmYKMN87UttA9z94XTINB5naPh_Wvg4'
Request URL
https://swimming1academy.runasp.net/api/expenses
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 1,
      "amount": 100,
      "expenseDate": "2026-11-04T08:00:31.692",
      "description": "broken chair fix",
      "cashboxType": "Main",
      "createdAt": "2026-11-04T08:00:38.3212914"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalCount": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 08:00:43 GMT 
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
      "amount": 0,
      "expenseDate": "2026-11-04T08:01:38.796Z",
      "description": "string",
      "cashboxType": "POS",
      "createdAt": "2026-11-04T08:01:38.796Z"
    }
  ],
  "page": 0,
  "pageSize": 0,
  "totalCount": 0
}
No links

GET
/api/expenses/{id}


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
  'https://swimming1academy.runasp.net/api/expenses/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAwNWNjNGY3LTQxYjAtNDVjYy04NzcyLWZiMTA3MzNmYzIzMyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzg3ODgsImV4cCI6MTc5Mzc3OTY4OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.QSmSvphaOpW7BmYKMN87UttA9z94XTINB5naPh_Wvg4'
Request URL
https://swimming1academy.runasp.net/api/expenses/1
Server response
Code	Details
200	
Response body
Download
{
  "id": 1,
  "amount": 100,
  "expenseDate": "2026-11-04T08:00:31.692",
  "description": "broken chair fix",
  "cashboxType": "Main",
  "createdAt": "2026-11-04T08:00:38.3212914"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 08:00:50 GMT 
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
  "amount": 0,
  "expenseDate": "2026-11-04T08:01:38.797Z",
  "description": "string",
  "cashboxType": "POS",
  "createdAt": "2026-11-04T08:01:38.797Z"
}
No links

PUT
/api/expenses/{id}


Parameters
Cancel
Reset
Name	Description
id *
integer($int32)
(path)
1
Request body

application/json
{
  "amount": 101,
  "expenseDate": "2026-11-04T08:01:14.372Z",
  "description": "aaaa",
  "cashboxType": "Main"
}
Execute
Clear
Responses
Curl

curl -X 'PUT' \
  'https://swimming1academy.runasp.net/api/expenses/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAwNWNjNGY3LTQxYjAtNDVjYy04NzcyLWZiMTA3MzNmYzIzMyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzg3ODgsImV4cCI6MTc5Mzc3OTY4OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.QSmSvphaOpW7BmYKMN87UttA9z94XTINB5naPh_Wvg4' \
  -H 'Content-Type: application/json' \
  -d '{
  "amount": 101,
  "expenseDate": "2026-11-04T08:01:14.372Z",
  "description": "aaaa",
  "cashboxType": "Main"
}'
Request URL
https://swimming1academy.runasp.net/api/expenses/1
Server response
Code	Details
200	
Response body
Download
{
  "message": "Expense updated successfully.",
  "data": {
    "id": 1,
    "amount": 101,
    "expenseDate": "2026-11-04T08:01:14.372",
    "description": "aaaa",
    "cashboxType": "Main",
    "createdAt": "2026-11-04T08:00:38.3212914"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 08:01:12 GMT 
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
    "amount": 0,
    "expenseDate": "2026-11-04T08:01:38.799Z",
    "description": "string",
    "cashboxType": "POS",
    "createdAt": "2026-11-04T08:01:38.799Z"
  }
}
No links

DELETE
/api/expenses/{id}


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

curl -X 'DELETE' \
  'https://swimming1academy.runasp.net/api/expenses/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAwNWNjNGY3LTQxYjAtNDVjYy04NzcyLWZiMTA3MzNmYzIzMyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM3Nzg3ODgsImV4cCI6MTc5Mzc3OTY4OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.QSmSvphaOpW7BmYKMN87UttA9z94XTINB5naPh_Wvg4'
Request URL
https://swimming1academy.runasp.net/api/expenses/1
Server response
Code	Details
200	
Response body
Download
{
  "message": "Expense deleted successfully.",
  "data": {}
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 08:01:20 GMT 
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
  "data": "string"
}