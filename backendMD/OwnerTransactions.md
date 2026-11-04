OwnerTransactions


POST
/api/owner-transactions


Parameters
Cancel
Reset
No parameters

Request body
Allowed values: Withdrawal (1), Deposit (2)
application/json
{
  "transactionType": "Withdrawal",
  "cashboxType": "POS",
  "amount": 100,
  "notes": "اخر اليوم"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/owner-transactions' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjA5NTQxYjIxLTk4MjAtNGMzNi1hOGNjLWQ2MWYxYTUxZTNmMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MzA0NTAsImV4cCI6MTc5MzgzNDA1MCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.H9oIqmkEm9Og2w0ptPxKCJNUlpNVkNL3Helhh-ozDI4' \
  -H 'Content-Type: application/json' \
  -d '{
  "transactionType": "Withdrawal",
  "cashboxType": "POS",
  "amount": 100,
  "notes": "اخر اليوم"
}'
Request URL
https://swimming1academy.runasp.net/api/owner-transactions
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Owner transaction recorded successfully.",
  "data": {
    "id": 1,
    "transactionType": "Withdrawal",
    "cashboxType": "POS",
    "amount": 100,
    "transactionDate": "2026-11-04T22:15:35.7508132Z",
    "notes": "اخر اليوم"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 22:15:35 GMT 
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
    "transactionType": "Withdrawal",
    "cashboxType": "POS",
    "amount": 0,
    "transactionDate": "2026-11-04T22:16:11.850Z",
    "notes": "string"
  }
}
No links

GET
/api/owner-transactions


Parameters
Cancel
Name	Description
CashboxType
string
(query)

--
TransactionType
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
  'https://swimming1academy.runasp.net/api/owner-transactions' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjA5NTQxYjIxLTk4MjAtNGMzNi1hOGNjLWQ2MWYxYTUxZTNmMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MzA0NTAsImV4cCI6MTc5MzgzNDA1MCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.H9oIqmkEm9Og2w0ptPxKCJNUlpNVkNL3Helhh-ozDI4'
Request URL
https://swimming1academy.runasp.net/api/owner-transactions
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 1,
      "transactionType": "Withdrawal",
      "cashboxType": "POS",
      "amount": 100,
      "transactionDate": "2026-11-04T22:15:35.7508132",
      "notes": "اخر اليوم"
    }
  ],
  "pageNumber": 1,
  "pageSize": 20,
  "totalCount": 1,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 22:15:45 GMT 
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
      "transactionType": "Withdrawal",
      "cashboxType": "POS",
      "amount": 0,
      "transactionDate": "2026-11-04T22:16:11.852Z",
      "notes": "string"
    }
  ],
  "pageNumber": 0,
  "pageSize": 0,
  "totalCount": 0,
  "totalPages": 0
}
No links

GET
/api/owner-transactions/{id}


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
  'https://swimming1academy.runasp.net/api/owner-transactions/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjA5NTQxYjIxLTk4MjAtNGMzNi1hOGNjLWQ2MWYxYTUxZTNmMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MzA0NTAsImV4cCI6MTc5MzgzNDA1MCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.H9oIqmkEm9Og2w0ptPxKCJNUlpNVkNL3Helhh-ozDI4'
Request URL
https://swimming1academy.runasp.net/api/owner-transactions/1
Server response
Code	Details
200	
Response body
Download
{
  "id": 1,
  "transactionType": "Withdrawal",
  "cashboxType": "POS",
  "amount": 100,
  "transactionDate": "2026-11-04T22:15:35.7508132",
  "notes": "اخر اليوم"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 22:15:52 GMT 
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
  "transactionType": "Withdrawal",
  "cashboxType": "POS",
  "amount": 0,
  "transactionDate": "2026-11-04T22:16:11.854Z",
  "notes": "string"
}