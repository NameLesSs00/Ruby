Clients


POST
/api/clients


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "fullName": "newClinet",
  "phoneNumber": "12312321",
  "dateOfBirth": "2001-11-20",
  "barcode": "CL-3456789"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/clients' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImQ4YTZmYzVjLTZkMzgtNDk3OS05MThlLTYwYmNlN2U1YzI5NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTUxNjc2MzEsImV4cCI6MTc5NTE3MTIzMSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.w4Iw9Fl5qqf-1VVjvi9TFM_qIFq0HMkcoBAmuftGcss' \
  -H 'Content-Type: application/json' \
  -d '{
  "fullName": "newClinet",
  "phoneNumber": "12312321",
  "dateOfBirth": "2001-11-20",
  "barcode": "CL-3456789"
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
    "id": 45,
    "fullName": "newClinet",
    "phoneNumber": "12312321",
    "dateOfBirth": "2001-11-20",
    "isActive": true,
    "createdAt": "2026-11-20T09:45:08.7334662Z",
    "barcode": "CL-3456789"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Fri,20 Nov 2026 09:45:07 GMT 
 location: https://swimming1academy.runasp.net/api/clients/45 
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
    "dateOfBirth": "2026-11-20",
    "isActive": true,
    "createdAt": "2026-11-20T09:45:50.058Z",
    "barcode": "string"
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
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImQ4YTZmYzVjLTZkMzgtNDk3OS05MThlLTYwYmNlN2U1YzI5NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTUxNjc2MzEsImV4cCI6MTc5NTE3MTIzMSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.w4Iw9Fl5qqf-1VVjvi9TFM_qIFq0HMkcoBAmuftGcss'
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
      "fullName": "Mohamed",
      "phoneNumber": "010210287545",
      "dateOfBirth": "2000-11-01",
      "isActive": true,
      "createdAt": "2026-11-04T11:08:28.4439481",
      "barcode": null
    },
    {
      "id": 2,
      "fullName": "حماده فتوح",
      "phoneNumber": "011145454545",
      "dateOfBirth": "2000-11-04",
      "isActive": true,
      "createdAt": "2026-11-04T12:04:08.2897134",
      "barcode": null
    },
    {
      "id": 3,
      "fullName": "علي",
      "phoneNumber": "5674545454",
      "dateOfBirth": "2000-01-01",
      "isActive": true,
      "createdAt": "2026-11-04T22:38:52.3833828",
      "barcode": "SB8898522645"
    },
    {
      "id": 4,
      "fullName": "احمد",
      "phoneNumber": "1234567ع",
      "dateOfBirth": "2005-02-01",
      "isActive": true,
      "createdAt": "2026-11-05T20:08:41.1487477",
      "barcode": null
    },
    {
      "id": 5,
      "fullName": "علي محمود",
      "phoneNumber": "01021055454",
      "dateOfBirth": "2000-01-01",
      "isActive": true,
      "createdAt": "2026-11-11T18:13:37.8048469",
      "barcode": null
    },
    {
      "id": 6,
      "fullName": "ماريا امجد حلمى",
      "phoneNumber": null,
      "dateOfBirth": null,
      "isActive": false,
      "createdAt": "2026-11-14T18:04:12.2873401",
      "barcode": null
    },
    {
      "id": 7,
      "fullName": "ريتاج تامر احمد",
      "phoneNumber": null,
      "dateOfBirth": null,
      "isActive": true,
      "createdAt": "2026-11-14T18:04:12.5688936",
      "barcode": null
    },
    {
      "id": 8,
      "fullName": "ادم احمد محمد",
      "phoneNumber": null,
      "dateOfBirth": null,
      "isActive": true,
      "createdAt": "2026-11-14T18:04:12.8184815",
      "barcode": null
    },
    {
      "id": 9,
      "fullName": "محمد طه العربى",
      "phoneNumber": null,
      "dateOfBirth": null,
      "isActive": true,
      "createdAt": "2026-11-14T18:04:13.0513794",
      "barcode": null
    },
    {
      "id": 10,
      "fullName": "بريسكلا عبدالمسيح",
      "phoneNumber": null,
      "dateOfBirth": null,
      "isActive": true,
      "createdAt": "2026-11-14T18:04:13.2880095",
      "barcode": null
    },
    {
      "id": 11,
      "fullName": "اياد وائل محمد",
      "phoneNumber": null,
      "dateOfBirth": null,
      "isActive": true,
      "createdAt": "2026-11-14T18:04:13.6485826",
      "barcode": null
    },
    {
      "id": 12,
      "fullName": "مؤيد محمد حمدته",
      "phoneNumber": null,
      "dateOfBirth": null,
      "isActive": true,
      "createdAt": "2026-11-14T18:04:13.982456",
      "barcode": null
    },
    {
      "id": 13,
      "fullName": "ابراهيم ناصر فايز",
      "phoneNumber": null,
      "dateOfBirth": null,
      "isActive": true,
      "createdAt": "2026-11-14T18:04:14.3368777",
      "barcode": null
    },
    {
      "id": 14,
      "fullName": "مانويل امجد حلمى",
      "phoneNumber": null,
      "dateOfBirth": null,
      "isActive": true,
      "createdAt": "2026-11-14T18:04:14.6840725",
      "barcode": null
    },
    {
      "id": 15,
      "fullName": "فريده اسامه محمد",
      "phoneNumber": null,
      "dateOfBirth": null,
      "isActive": true,
      "createdAt": "2026-11-14T18:04:14.9200378",
      "barcode": null
    },
    {
      "id": 16,
      "fullName": "احمد خالد احمد",
      "phoneNumber": null,
      "dateOfBirth": null,
      "isActive": true,
      "createdAt": "2026-11-14T18:04:15.1697613",
      "barcode": null
    },
    {
      "id": 17,
      "fullName": "ذياد خالد احمد",
      "phoneNumber": null,
      "dateOfBirth": null,
      "isActive": true,
      "createdAt": "2026-11-14T18:04:15.4207105",
      "barcode": null
    },
    {
      "id": 18,
      "fullName": "يحي احمد مصطفى",
      "phoneNumber": null,
      "dateOfBirth": null,
      "isActive": true,
      "createdAt": "2026-11-14T18:04:15.6705434",
      "barcode": null
    },
    {
      "id": 19,
      "fullName": "عمار محمد سيد",
      "phoneNumber": null,
      "dateOfBirth": null,
      "isActive": true,
      "createdAt": "2026-11-14T18:04:15.9195286",
      "barcode": null
    },
    {
      "id": 20,
      "fullName": "لارا حمدى ابوالحسن",
      "phoneNumber": null,
      "dateOfBirth": null,
      "isActive": true,
      "createdAt": "2026-11-14T18:04:16.1520131",
      "barcode": null
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 29
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,20 Nov 2026 09:45:12 GMT 
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
      "dateOfBirth": "2026-11-20",
      "isActive": true,
      "createdAt": "2026-11-20T09:45:50.067Z",
      "barcode": "string"
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
45
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/clients/45' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImQ4YTZmYzVjLTZkMzgtNDk3OS05MThlLTYwYmNlN2U1YzI5NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTUxNjc2MzEsImV4cCI6MTc5NTE3MTIzMSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.w4Iw9Fl5qqf-1VVjvi9TFM_qIFq0HMkcoBAmuftGcss'
Request URL
https://swimming1academy.runasp.net/api/clients/45
Server response
Code	Details
200	
Response body
Download
{
  "id": 45,
  "fullName": "newClinet",
  "phoneNumber": "12312321",
  "dateOfBirth": "2001-11-20",
  "isActive": true,
  "createdAt": "2026-11-20T09:45:08.7334662",
  "barcode": "CL-3456789"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,20 Nov 2026 09:45:21 GMT 
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
  "dateOfBirth": "2026-11-20",
  "isActive": true,
  "createdAt": "2026-11-20T09:45:50.072Z",
  "barcode": "string"
}
No links

PUT
/api/clients/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
45
Request body

application/json
{
  "fullName": "string",
  "phoneNumber": "string",
  "dateOfBirth": "2026-11-20",
  "barcode": "string"
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
    "fullName": "string",
    "phoneNumber": "string",
    "dateOfBirth": "2026-11-20",
    "isActive": true,
    "createdAt": "2026-11-20T09:45:50.075Z",
    "barcode": "string"
  }
}
No links

GET
/api/clients/subscriptions


Parameters
Cancel
Name	Description
subscriptionStatus
string
(query)

--
barcode
string
(query)
CL-3456789
page
integer($int32)
(query)
1
pageSize
integer($int32)
(query)
10
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/clients/subscriptions?barcode=CL-3456789&page=1&pageSize=10' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImQ4YTZmYzVjLTZkMzgtNDk3OS05MThlLTYwYmNlN2U1YzI5NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTUxNjc2MzEsImV4cCI6MTc5NTE3MTIzMSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.w4Iw9Fl5qqf-1VVjvi9TFM_qIFq0HMkcoBAmuftGcss'
Request URL
https://swimming1academy.runasp.net/api/clients/subscriptions?barcode=CL-3456789&page=1&pageSize=10
Server response
Code	Details
200	
Response body
Download
{
  "items": [],
  "totalCount": 0,
  "page": 1,
  "pageSize": 10,
  "totalPages": 0
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,20 Nov 2026 09:45:41 GMT 
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
      "commissionCoachId": 0,
      "commissionCoachName": "string",
      "clientType": "Academy",
      "subscriptionType": "Sessions",
      "startDate": "2026-11-20",
      "endDate": "2026-11-20",
      "totalSessions": 0,
      "usedSessions": 0,
      "amount": 0,
      "discountAmount": 0,
      "finalAmount": 0,
      "paidAmount": 0,
      "remainingAmount": 0,
      "paymentStatus": "Unpaid",
      "status": "Active",
      "createdAt": "2026-11-20T09:45:50.081Z",
      "notes": "string"
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}