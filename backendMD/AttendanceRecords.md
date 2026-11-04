AttendanceRecords


POST
/api/attendance-records


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "clientId": 1,
  "subscriptionId": 2,
  "notes": "string"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/attendance-records' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3ZTBiZTJhLTkzZWUtNGVmYS1hYjZmLTlmZTlkODY0Y2U2ZSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MjM4MDEsImV4cCI6MTc5MzgyNDcwMSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.N1Se_UYiN_YOXtqE3FjPKJiosKp7UUpuUS-CbY77b2A' \
  -H 'Content-Type: application/json' \
  -d '{
  "clientId": 1,
  "subscriptionId": 2,
  "notes": "string"
}'
Request URL
https://swimming1academy.runasp.net/api/attendance-records
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Attendance record created successfully.",
  "data": {
    "id": 1,
    "clientId": 1,
    "clientName": "Mohamed",
    "subscriptionId": 2,
    "checkInTime": "2026-11-04T20:26:32.2243627Z",
    "notes": "string"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 20:26:31 GMT 
 location: https://swimming1academy.runasp.net/api/attendance-records/1 
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
    "clientId": 0,
    "clientName": "string",
    "subscriptionId": 0,
    "checkInTime": "2026-11-04T20:27:03.547Z",
    "notes": "string"
  }
}
No links

GET
/api/attendance-records


Parameters
Cancel
Name	Description
ClientId
integer($int32)
(query)
ClientId
SubscriptionId
integer($int32)
(query)
SubscriptionId
FromDate
string($date)
(query)
FromDate
ToDate
string($date)
(query)
ToDate
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
  'https://swimming1academy.runasp.net/api/attendance-records' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3ZTBiZTJhLTkzZWUtNGVmYS1hYjZmLTlmZTlkODY0Y2U2ZSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MjM4MDEsImV4cCI6MTc5MzgyNDcwMSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.N1Se_UYiN_YOXtqE3FjPKJiosKp7UUpuUS-CbY77b2A'
Request URL
https://swimming1academy.runasp.net/api/attendance-records
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 1,
      "clientId": 1,
      "clientName": "Mohamed",
      "subscriptionId": 2,
      "checkInTime": "2026-11-04T20:26:32.2243627",
      "notes": "string"
    }
  ],
  "totalCount": 1,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 20:26:38 GMT 
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
      "clientId": 0,
      "clientName": "string",
      "subscriptionId": 0,
      "checkInTime": "2026-11-04T20:27:03.556Z",
      "notes": "string"
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
No links

GET
/api/attendance-records/{id}


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
  'https://swimming1academy.runasp.net/api/attendance-records/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3ZTBiZTJhLTkzZWUtNGVmYS1hYjZmLTlmZTlkODY0Y2U2ZSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MjM4MDEsImV4cCI6MTc5MzgyNDcwMSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.N1Se_UYiN_YOXtqE3FjPKJiosKp7UUpuUS-CbY77b2A'
Request URL
https://swimming1academy.runasp.net/api/attendance-records/1
Server response
Code	Details
200	
Response body
Download
{
  "id": 1,
  "clientId": 1,
  "clientName": "Mohamed",
  "subscriptionId": 2,
  "checkInTime": "2026-11-04T20:26:32.2243627",
  "notes": "string"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 20:26:44 GMT 
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
  "clientId": 0,
  "clientName": "string",
  "subscriptionId": 0,
  "checkInTime": "2026-11-04T20:27:03.563Z",
  "notes": "string"
}
No links

PUT
/api/attendance-records/{id}


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
  "clientId": 0,
  "subscriptionId": 0,
  "checkInTime": "2026-11-04T20:27:03.567Z",
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
    "clientId": 0,
    "clientName": "string",
    "subscriptionId": 0,
    "checkInTime": "2026-11-04T20:27:03.569Z",
    "notes": "string"
  }
}
No links

DELETE
/api/attendance-records/{id}


Parameters
Try it out
Name	Description
id *
integer($int32)
(path)
id
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
    "clientId": 0,
    "clientName": "string",
    "subscriptionId": 0,
    "checkInTime": "2026-11-04T20:27:03.573Z",
    "notes": "string"
  }
}