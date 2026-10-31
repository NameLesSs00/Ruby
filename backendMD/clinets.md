Clients


POST
/api/clients


Parameters
Cancel
No parameters

Request body

application/json
{
  "fullName": "string",
  "phoneNumber": "string",
  "dateOfBirth": "2026-10-30"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/clients' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImViMzRkZDQzLTY5MWEtNDk3My04NWY2LTI2OWNhNmVlNmFkYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzQwMjMsImV4cCI6MTc5MzM3NDkyMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FRy4MTgbWpHA2J9EmzWwpJlebs2DfvRGBONQvXBZuOM' \
  -H 'Content-Type: application/json' \
  -d '{
  "fullName": "string",
  "phoneNumber": "string",
  "dateOfBirth": "2026-10-30"
}'
Request URL
https://swimming1academy.runasp.net/api/clients
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Client created successfully.",
  "data": {
    "id": 3,
    "clientCode": "CL-000003",
    "fullName": "string",
    "phoneNumber": "string",
    "dateOfBirth": "2026-10-30",
    "isActive": true,
    "createdAt": "2026-10-30T15:28:37.2721928Z"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 15:28:37 GMT 
 location: https://swimming1academy.runasp.net/api/clients/3 
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
    "clientCode": "string",
    "fullName": "string",
    "phoneNumber": "string",
    "dateOfBirth": "2026-10-30",
    "isActive": true,
    "createdAt": "2026-10-30T15:28:50.198Z"
  }
}
No links

GET
/api/clients


Parameters
Cancel
Name	Description
Search
string
(query)
Search
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
  'https://swimming1academy.runasp.net/api/clients' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImViMzRkZDQzLTY5MWEtNDk3My04NWY2LTI2OWNhNmVlNmFkYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzQwMjMsImV4cCI6MTc5MzM3NDkyMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FRy4MTgbWpHA2J9EmzWwpJlebs2DfvRGBONQvXBZuOM'
Request URL
https://swimming1academy.runasp.net/api/clients
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 1,
      "clientCode": "CL-000001",
      "fullName": "حماده فتوح",
      "phoneNumber": "021212015485",
      "dateOfBirth": "1999-10-28",
      "isActive": true,
      "createdAt": "2026-10-28T17:48:03.4736159"
    },
    {
      "id": 2,
      "clientCode": "CL-000002",
      "fullName": "test",
      "phoneNumber": "123123",
      "dateOfBirth": "2026-10-30",
      "isActive": false,
      "createdAt": "2026-10-30T09:50:49.4726735"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 2
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 15:27:50 GMT 
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
      "clientCode": "string",
      "fullName": "string",
      "phoneNumber": "string",
      "dateOfBirth": "2026-10-30",
      "isActive": true,
      "createdAt": "2026-10-30T15:28:50.204Z"
    }
  ],
  "page": 0,
  "pageSize": 0,
  "totalCount": 0
}
No links

GET
/api/clients/{id}


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
  'https://swimming1academy.runasp.net/api/clients/2' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImViMzRkZDQzLTY5MWEtNDk3My04NWY2LTI2OWNhNmVlNmFkYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzQwMjMsImV4cCI6MTc5MzM3NDkyMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FRy4MTgbWpHA2J9EmzWwpJlebs2DfvRGBONQvXBZuOM'
Request URL
https://swimming1academy.runasp.net/api/clients/2
Server response
Code	Details
200	
Response body
Download
{
  "id": 2,
  "clientCode": "CL-000002",
  "fullName": "test",
  "phoneNumber": "123123",
  "dateOfBirth": "2026-10-30",
  "isActive": false,
  "createdAt": "2026-10-30T09:50:49.4726735"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 15:28:07 GMT 
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
  "clientCode": "string",
  "fullName": "string",
  "phoneNumber": "string",
  "dateOfBirth": "2026-10-30",
  "isActive": true,
  "createdAt": "2026-10-30T15:28:50.208Z"
}
No links

PUT
/api/clients/{id}


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
  "fullName": "string",
  "phoneNumber": "string",
  "dateOfBirth": "2026-10-30"
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
    "clientCode": "string",
    "fullName": "string",
    "phoneNumber": "string",
    "dateOfBirth": "2026-10-30",
    "isActive": true,
    "createdAt": "2026-10-30T15:28:50.211Z"
  }
}
No links

GET
/api/clients/by-barcode/{clientCode}


Parameters
Cancel
Name	Description
clientCode *
string
(path)
CL-000002
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/clients/by-barcode/CL-000002' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImViMzRkZDQzLTY5MWEtNDk3My04NWY2LTI2OWNhNmVlNmFkYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzQwMjMsImV4cCI6MTc5MzM3NDkyMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FRy4MTgbWpHA2J9EmzWwpJlebs2DfvRGBONQvXBZuOM'
Request URL
https://swimming1academy.runasp.net/api/clients/by-barcode/CL-000002
Server response
Code	Details
200	
Response body
Download
{
  "clientId": 2,
  "clientCode": "CL-000002",
  "fullName": "test",
  "eligibleSubscriptions": []
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 15:28:21 GMT 
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
  "clientId": 0,
  "clientCode": "string",
  "fullName": "string",
  "eligibleSubscriptions": [
    {
      "subscriptionId": 0,
      "subscriptionType": "string",
      "startDate": "2026-10-30",
      "endDate": "2026-10-30",
      "totalSessions": 0,
      "usedSessions": 0,
      "remainingSessions": 0,
      "status": "string"
    }
  ]
}
No links

PATCH
/api/clients/{id}/status


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
  "isActive": true
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
    "clientCode": "string",
    "fullName": "string",
    "phoneNumber": "string",
    "dateOfBirth": "2026-10-30",
    "isActive": true,
    "createdAt": "2026-10-30T15:28:50.217Z"
  }
}
No links

GET
/api/clients/{id}/barcode


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
  'https://swimming1academy.runasp.net/api/clients/1/barcode' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImViMzRkZDQzLTY5MWEtNDk3My04NWY2LTI2OWNhNmVlNmFkYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzQwMjMsImV4cCI6MTc5MzM3NDkyMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FRy4MTgbWpHA2J9EmzWwpJlebs2DfvRGBONQvXBZuOM'
Request URL
https://swimming1academy.runasp.net/api/clients/1/barcode
Server response
Code	Details
200	
Response body
Download
{
  "clientId": 1,
  "clientCode": "CL-000001",
  "barcodeUrl": "/uploads/barcodes/client-1.png"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 15:28:48 GMT 
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
  "clientId": 0,
  "clientCode": "string",
  "barcodeUrl": "string"
}