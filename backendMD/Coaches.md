review this and create a plan for it it should have it's own tab and it should be working right make sure we use sonner and tanssatck okay ? create a plna for it 
Coaches


POST
/api/coaches


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "fullName": "test coahc",
  "phoneNumber": "123123123123",
  "hireDate": "2026-10-30",
  "notes": "notes here could be added"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/coaches' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImIwYWZhZWUzLTFlYzMtNDE0Zi1hNmE5LWNhNDVhYTdlNTU0YyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTU4ODEsImV4cCI6MTc5MzM1Njc4MSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.vfDk-1o9wbrNOxYEACp8FYFJdjcyskorv_1KVuQfymg' \
  -H 'Content-Type: application/json' \
  -d '{
  "fullName": "test coahc",
  "phoneNumber": "123123123123",
  "hireDate": "2026-10-30",
  "notes": "notes here could be added"
}'
Request URL
https://swimming1academy.runasp.net/api/coaches
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Coach created successfully.",
  "data": {
    "id": 3,
    "fullName": "test coahc",
    "phoneNumber": "123123123123",
    "hireDate": "2026-10-30",
    "isActive": true,
    "createdAt": "2026-10-30T10:26:06.1510316Z",
    "notes": "notes here could be added"
  }
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 10:26:05 GMT 
 location: https://swimming1academy.runasp.net/api/coaches/3 
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
    "fullName": "string",
    "phoneNumber": "string",
    "hireDate": "2026-10-30",
    "isActive": true,
    "createdAt": "2026-10-30T10:26:55.595Z",
    "notes": "string"
  }
}
No links

GET
/api/coaches


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
  'https://swimming1academy.runasp.net/api/coaches' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImIwYWZhZWUzLTFlYzMtNDE0Zi1hNmE5LWNhNDVhYTdlNTU0YyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTU4ODEsImV4cCI6MTc5MzM1Njc4MSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.vfDk-1o9wbrNOxYEACp8FYFJdjcyskorv_1KVuQfymg'
Request URL
https://swimming1academy.runasp.net/api/coaches
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 1,
      "fullName": "كابتن محمد سليمان",
      "phoneNumber": "0102108745",
      "hireDate": "2000-10-28",
      "isActive": true,
      "createdAt": "2026-10-28T17:48:56.4608186",
      "notes": null
    },
    {
      "id": 2,
      "fullName": "كابتن خالد رمضان",
      "phoneNumber": "1111111111",
      "hireDate": "2000-10-29",
      "isActive": true,
      "createdAt": "2026-10-29T16:38:07.3467252",
      "notes": "مدرب عويل"
    },
    {
      "id": 3,
      "fullName": "not test",
      "phoneNumber": "123132123",
      "hireDate": "2026-10-30",
      "isActive": false,
      "createdAt": "2026-10-30T10:26:06.1510316",
      "notes": "12313123123"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalCount": 3
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 10:26:53 GMT 
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
      "fullName": "string",
      "phoneNumber": "string",
      "hireDate": "2026-10-30",
      "isActive": true,
      "createdAt": "2026-10-30T10:26:55.600Z",
      "notes": "string"
    }
  ],
  "page": 0,
  "pageSize": 0,
  "totalCount": 0
}
No links

GET
/api/coaches/{id}


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
  'https://swimming1academy.runasp.net/api/coaches/3' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImIwYWZhZWUzLTFlYzMtNDE0Zi1hNmE5LWNhNDVhYTdlNTU0YyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTU4ODEsImV4cCI6MTc5MzM1Njc4MSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.vfDk-1o9wbrNOxYEACp8FYFJdjcyskorv_1KVuQfymg'
Request URL
https://swimming1academy.runasp.net/api/coaches/3
Server response
Code	Details
200	
Response body
Download
{
  "id": 3,
  "fullName": "not test",
  "phoneNumber": "123132123",
  "hireDate": "2026-10-30",
  "isActive": false,
  "createdAt": "2026-10-30T10:26:06.1510316",
  "notes": "12313123123"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 10:26:50 GMT 
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
  "fullName": "string",
  "phoneNumber": "string",
  "hireDate": "2026-10-30",
  "isActive": true,
  "createdAt": "2026-10-30T10:26:55.603Z",
  "notes": "string"
}
No links

PUT
/api/coaches/{id}


Parameters
Cancel
Reset
Name	Description
id *
integer($int32)
(path)
3
Request body

application/json
{
  "fullName": "not test ",
  "phoneNumber": "123132123",
  "hireDate": "2026-10-30",
  "notes": "12313123123"
}
Execute
Clear
Responses
Curl

curl -X 'PUT' \
  'https://swimming1academy.runasp.net/api/coaches/3' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImIwYWZhZWUzLTFlYzMtNDE0Zi1hNmE5LWNhNDVhYTdlNTU0YyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTU4ODEsImV4cCI6MTc5MzM1Njc4MSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.vfDk-1o9wbrNOxYEACp8FYFJdjcyskorv_1KVuQfymg' \
  -H 'Content-Type: application/json' \
  -d '{
  "fullName": "not test ",
  "phoneNumber": "123132123",
  "hireDate": "2026-10-30",
  "notes": "12313123123"
}'
Request URL
https://swimming1academy.runasp.net/api/coaches/3
Server response
Code	Details
200	
Response body
Download
{
  "message": "Coach updated successfully.",
  "data": {
    "id": 3,
    "fullName": "not test",
    "phoneNumber": "123132123",
    "hireDate": "2026-10-30",
    "isActive": true,
    "createdAt": "2026-10-30T10:26:06.1510316",
    "notes": "12313123123"
  }
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 10:26:25 GMT 
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
    "fullName": "string",
    "phoneNumber": "string",
    "hireDate": "2026-10-30",
    "isActive": true,
    "createdAt": "2026-10-30T10:26:55.607Z",
    "notes": "string"
  }
}
No links

PATCH
/api/coaches/{id}/status


Parameters
Cancel
Reset
Name	Description
id *
integer($int32)
(path)
3
Request body

application/json
{
  "isActive": false
}
Execute
Clear
Responses
Curl

curl -X 'PATCH' \
  'https://swimming1academy.runasp.net/api/coaches/3/status' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImIwYWZhZWUzLTFlYzMtNDE0Zi1hNmE5LWNhNDVhYTdlNTU0YyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTU4ODEsImV4cCI6MTc5MzM1Njc4MSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.vfDk-1o9wbrNOxYEACp8FYFJdjcyskorv_1KVuQfymg' \
  -H 'Content-Type: application/json' \
  -d '{
  "isActive": false
}'
Request URL
https://swimming1academy.runasp.net/api/coaches/3/status
Server response
Code	Details
200	
Response body
Download
{
  "message": "Coach status updated successfully.",
  "data": {
    "id": 3,
    "fullName": "not test",
    "phoneNumber": "123132123",
    "hireDate": "2026-10-30",
    "isActive": false,
    "createdAt": "2026-10-30T10:26:06.1510316",
    "notes": "12313123123"
  }
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 10:26:35 GMT 
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
    "fullName": "string",
    "phoneNumber": "string",
    "hireDate": "2026-10-30",
    "isActive": true,
    "createdAt": "2026-10-30T10:26:55.610Z",
    "notes": "string"
  }
}