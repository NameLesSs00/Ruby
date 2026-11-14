Barcodes


POST
/api/barcodes/generate


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "count": 1
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/barcodes/generate' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjkxNTRkNDU1LWJhYjUtNDFiZi1iNDA1LWVlY2JiMDlmYzg2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTA5NDcsImV4cCI6MTc5NDY1NDU0NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.4yzaRgOK0b5-4obHhRJ0x4dcFJQVEiareG7xdQcUgk0' \
  -H 'Content-Type: application/json' \
  -d '{
  "count": 1
}'
Request URL
https://swimming1academy.runasp.net/api/barcodes/generate
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "1 barcode(s) generated successfully.",
  "data": [
    {
      "id": 4,
      "barcodeValue": "SB1561273734",
      "isActive": true,
      "isAvailable": true,
      "clientId": null,
      "clientFullName": null,
      "assignedAt": null,
      "createdAt": "2026-11-14T10:09:21.5226681Z"
    }
  ]
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 10:09:21 GMT 
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
  "data": [
    {
      "id": 0,
      "barcodeValue": "string",
      "isActive": true,
      "isAvailable": true,
      "clientId": 0,
      "clientFullName": "string",
      "assignedAt": "2026-11-14T10:30:45.670Z",
      "createdAt": "2026-11-14T10:30:45.670Z"
    }
  ]
}
No links

GET
/api/barcodes/available


Parameters
Cancel
Name	Description
isActive
boolean
(query)

true
isAvailable
boolean
(query)

false
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/barcodes/available?isActive=true&isAvailable=false' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjkxNTRkNDU1LWJhYjUtNDFiZi1iNDA1LWVlY2JiMDlmYzg2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTA5NDcsImV4cCI6MTc5NDY1NDU0NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.4yzaRgOK0b5-4obHhRJ0x4dcFJQVEiareG7xdQcUgk0'
Request URL
https://swimming1academy.runasp.net/api/barcodes/available?isActive=true&isAvailable=false
Server response
Code	Details
200	
Response body
Download
[
  {
    "id": 1,
    "barcodeValue": "SB6729374988",
    "isActive": true,
    "isAvailable": false,
    "clientId": 1,
    "clientFullName": null,
    "assignedAt": "2026-11-10T16:02:13.0891293",
    "createdAt": "2026-11-10T16:01:52.4168113"
  }
]
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 10:09:42 GMT 
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
    "barcodeValue": "string",
    "isActive": true,
    "isAvailable": true,
    "clientId": 0,
    "clientFullName": "string",
    "assignedAt": "2026-11-14T10:30:45.672Z",
    "createdAt": "2026-11-14T10:30:45.672Z"
  }
]
No links

GET
/api/barcodes


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
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/barcodes' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjkxNTRkNDU1LWJhYjUtNDFiZi1iNDA1LWVlY2JiMDlmYzg2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTA5NDcsImV4cCI6MTc5NDY1NDU0NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.4yzaRgOK0b5-4obHhRJ0x4dcFJQVEiareG7xdQcUgk0'
Request URL
https://swimming1academy.runasp.net/api/barcodes
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 4,
      "barcodeValue": "SB1561273734",
      "isActive": true,
      "isAvailable": true,
      "clientId": null,
      "clientFullName": null,
      "assignedAt": null,
      "createdAt": "2026-11-14T10:09:21.5226681"
    },
    {
      "id": 3,
      "barcodeValue": "SB8898522645",
      "isActive": true,
      "isAvailable": true,
      "clientId": null,
      "clientFullName": null,
      "assignedAt": null,
      "createdAt": "2026-11-10T16:01:52.4201964"
    },
    {
      "id": 2,
      "barcodeValue": "SB2941178766",
      "isActive": true,
      "isAvailable": true,
      "clientId": null,
      "clientFullName": null,
      "assignedAt": null,
      "createdAt": "2026-11-10T16:01:52.4188127"
    },
    {
      "id": 1,
      "barcodeValue": "SB6729374988",
      "isActive": true,
      "isAvailable": false,
      "clientId": 1,
      "clientFullName": "Mohamed",
      "assignedAt": "2026-11-10T16:02:13.0891293",
      "createdAt": "2026-11-10T16:01:52.4168113"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 4
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 10:09:54 GMT 
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
      "barcodeValue": "string",
      "isActive": true,
      "isAvailable": true,
      "clientId": 0,
      "clientFullName": "string",
      "assignedAt": "2026-11-14T10:30:45.677Z",
      "createdAt": "2026-11-14T10:30:45.677Z"
    }
  ],
  "page": 0,
  "pageSize": 0,
  "totalCount": 0
}
No links

GET
/api/barcodes/by-value/{barcodeValue}


Parameters
Cancel
Name	Description
barcodeValue *
string
(path)
SB6729374988
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/barcodes/by-value/SB6729374988' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjkxNTRkNDU1LWJhYjUtNDFiZi1iNDA1LWVlY2JiMDlmYzg2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTA5NDcsImV4cCI6MTc5NDY1NDU0NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.4yzaRgOK0b5-4obHhRJ0x4dcFJQVEiareG7xdQcUgk0'
Request URL
https://swimming1academy.runasp.net/api/barcodes/by-value/SB6729374988
Server response
Code	Details
200	
Response body
Download
{
  "clientId": 1,
  "barcodeValue": "SB6729374988",
  "fullName": "Mohamed",
  "eligibleSubscriptions": [
    {
      "subscriptionId": 13,
      "subscriptionType": "Sessions",
      "startDate": "2026-11-13",
      "endDate": "2026-12-13",
      "totalSessions": 12,
      "usedSessions": 0,
      "remainingSessions": 12,
      "status": "Active"
    },
    {
      "subscriptionId": 11,
      "subscriptionType": "Sessions",
      "startDate": "2026-11-10",
      "endDate": "2026-12-10",
      "totalSessions": 12,
      "usedSessions": 0,
      "remainingSessions": 12,
      "status": "Active"
    },
    {
      "subscriptionId": 2,
      "subscriptionType": "Sessions",
      "startDate": "2026-11-04",
      "endDate": "2026-12-04",
      "totalSessions": 4,
      "usedSessions": 2,
      "remainingSessions": 2,
      "status": "Cancelled"
    },
    {
      "subscriptionId": 1,
      "subscriptionType": "Sessions",
      "startDate": "2026-11-04",
      "endDate": "2026-12-04",
      "totalSessions": 4,
      "usedSessions": 0,
      "remainingSessions": 4,
      "status": "Cancelled"
    }
  ]
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 10:10:06 GMT 
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
  "barcodeValue": "string",
  "fullName": "string",
  "eligibleSubscriptions": [
    {
      "subscriptionId": 0,
      "subscriptionType": "string",
      "startDate": "2026-11-14",
      "endDate": "2026-11-14",
      "totalSessions": 0,
      "usedSessions": 0,
      "remainingSessions": 0,
      "status": "string"
    }
  ]
}
No links

GET
/api/barcodes/{id}/image


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
  'https://swimming1academy.runasp.net/api/barcodes/1/image' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjkxNTRkNDU1LWJhYjUtNDFiZi1iNDA1LWVlY2JiMDlmYzg2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTA5NDcsImV4cCI6MTc5NDY1NDU0NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.4yzaRgOK0b5-4obHhRJ0x4dcFJQVEiareG7xdQcUgk0'
Request URL
https://swimming1academy.runasp.net/api/barcodes/1/image
Server response
Code	Details
200	
Response body
Download
{
  "barcodeId": 1,
  "barcodeValue": "SB6729374988",
  "barcodeUrl": "/uploads/barcodes/barcode-1.png"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 10:10:32 GMT 
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
  "barcodeId": 0,
  "barcodeValue": "string",
  "barcodeUrl": "string"
}
No links

GET
/api/barcodes/{id}


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
  'https://swimming1academy.runasp.net/api/barcodes/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjkxNTRkNDU1LWJhYjUtNDFiZi1iNDA1LWVlY2JiMDlmYzg2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTA5NDcsImV4cCI6MTc5NDY1NDU0NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.4yzaRgOK0b5-4obHhRJ0x4dcFJQVEiareG7xdQcUgk0'
Request URL
https://swimming1academy.runasp.net/api/barcodes/1
Server response
Code	Details
200	
Response body
Download
{
  "id": 1,
  "barcodeValue": "SB6729374988",
  "isActive": true,
  "isAvailable": false,
  "clientId": 1,
  "clientFullName": "Mohamed",
  "assignedAt": "2026-11-10T16:02:13.0891293",
  "createdAt": "2026-11-10T16:01:52.4168113"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 10:10:54 GMT 
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
  "barcodeValue": "string",
  "isActive": true,
  "isAvailable": true,
  "clientId": 0,
  "clientFullName": "string",
  "assignedAt": "2026-11-14T10:30:45.683Z",
  "createdAt": "2026-11-14T10:30:45.683Z"
}
No links

PUT
/api/barcodes/{id}/assign-client


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
  "clientId": 3
}
Execute
Clear
Responses
Curl

curl -X 'PUT' \
  'https://swimming1academy.runasp.net/api/barcodes/3/assign-client' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjkxNTRkNDU1LWJhYjUtNDFiZi1iNDA1LWVlY2JiMDlmYzg2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTA5NDcsImV4cCI6MTc5NDY1NDU0NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.4yzaRgOK0b5-4obHhRJ0x4dcFJQVEiareG7xdQcUgk0' \
  -H 'Content-Type: application/json' \
  -d '{
  "clientId": 3
}'
Request URL
https://swimming1academy.runasp.net/api/barcodes/3/assign-client
Server response
Code	Details
400
Undocumented
Error: response status is 400

Response body
Download
{
  "error": "Barcode with ID 3 is already assigned to client #3."
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 10:15:14 GMT 
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
    "barcodeValue": "string",
    "isActive": true,
    "isAvailable": true,
    "clientId": 0,
    "clientFullName": "string",
    "assignedAt": "2026-11-14T10:30:45.685Z",
    "createdAt": "2026-11-14T10:30:45.685Z"
  }
}
No links

PUT
/api/barcodes/{id}/detach


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

curl -X 'PUT' \
  'https://swimming1academy.runasp.net/api/barcodes/3/detach' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjkxNTRkNDU1LWJhYjUtNDFiZi1iNDA1LWVlY2JiMDlmYzg2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTA5NDcsImV4cCI6MTc5NDY1NDU0NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.4yzaRgOK0b5-4obHhRJ0x4dcFJQVEiareG7xdQcUgk0'
Request URL
https://swimming1academy.runasp.net/api/barcodes/3/detach
Server response
Code	Details
400
Undocumented
Error: response status is 400

Response body
Download
{
  "error": "Client #3 has an active subscription. Detach the barcode only after the subscription ends."
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 10:15:21 GMT 
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
    "barcodeValue": "string",
    "isActive": true,
    "isAvailable": true,
    "clientId": 0,
    "clientFullName": "string",
    "assignedAt": "2026-11-14T10:30:45.687Z",
    "createdAt": "2026-11-14T10:30:45.687Z"
  }
}
No links

PUT
/api/barcodes/{id}/status


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

curl -X 'PUT' \
  'https://swimming1academy.runasp.net/api/barcodes/3/status' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjkxNTRkNDU1LWJhYjUtNDFiZi1iNDA1LWVlY2JiMDlmYzg2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTA5NDcsImV4cCI6MTc5NDY1NDU0NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.4yzaRgOK0b5-4obHhRJ0x4dcFJQVEiareG7xdQcUgk0' \
  -H 'Content-Type: application/json' \
  -d '{
  "isActive": false
}'
Request URL
https://swimming1academy.runasp.net/api/barcodes/3/status
Server response
Code	Details
400
Undocumented
Error: response status is 400

Response body
Download
{
  "error": "Barcode with ID 3 is assigned to client #3. Detach it before changing its status."
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 10:15:25 GMT 
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
    "barcodeValue": "string",
    "isActive": true,
    "isAvailable": true,
    "clientId": 0,
    "clientFullName": "string",
    "assignedAt": "2026-11-14T10:30:45.688Z",
    "createdAt": "2026-11-14T10:30:45.688Z"
  }
}
note that to detach a bar code the clinet should not be active and also subscription for that clinet should be all not active to do that could you create a plan to add those to the app ? and give the clinet those notes in arabic to help them use the app 