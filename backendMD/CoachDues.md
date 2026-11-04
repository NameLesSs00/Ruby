CoachDues


POST
/api/coachdues


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "coachId": 1,
  "amount": 100,
  "description": "شسيبسشيب"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/coachdues' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjQ0NjE4ZjIzLTkyMGUtNGM2Zi04YTg1LTdjOWRhMjU4OWIzMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTY5OTcsImV4cCI6MTc5MzgxNzg5NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FNkGazzGAefdfsHLShzkjdKE3ywo5mJFoI_FbgUgpjk' \
  -H 'Content-Type: application/json' \
  -d '{
  "coachId": 1,
  "amount": 100,
  "description": "شسيبسشيب"
}'
Request URL
https://swimming1academy.runasp.net/api/coachdues
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Coach due created successfully.",
  "data": {
    "id": 1,
    "coachId": 1,
    "coachName": "dfghjkjhgfdsa",
    "amount": 100,
    "paidAmount": 0,
    "remainingAmount": 100,
    "description": "شسيبسشيب",
    "createdAt": "2026-11-04T18:41:05.3049897Z"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:41:04 GMT 
 location: https://swimming1academy.runasp.net/api/coachdues/1 
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
    "coachId": 0,
    "coachName": "string",
    "amount": 0,
    "paidAmount": 0,
    "remainingAmount": 0,
    "description": "string",
    "createdAt": "2026-11-04T18:41:32.056Z"
  }
}
No links

GET
/api/coachdues


Parameters
Cancel
Name	Description
coachId
integer($int32)
(query)
coachId
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
  'https://swimming1academy.runasp.net/api/coachdues?page=1&pageSize=20' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjQ0NjE4ZjIzLTkyMGUtNGM2Zi04YTg1LTdjOWRhMjU4OWIzMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTY5OTcsImV4cCI6MTc5MzgxNzg5NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FNkGazzGAefdfsHLShzkjdKE3ywo5mJFoI_FbgUgpjk'
Request URL
https://swimming1academy.runasp.net/api/coachdues?page=1&pageSize=20
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 1,
      "coachId": 1,
      "coachName": "dfghjkjhgfdsa",
      "amount": 100,
      "paidAmount": 0,
      "remainingAmount": 100,
      "description": "شسيبسشيب",
      "createdAt": "2026-11-04T18:41:05.3049897"
    }
  ],
  "totalCount": 1,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:41:07 GMT 
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
      "coachId": 0,
      "coachName": "string",
      "amount": 0,
      "paidAmount": 0,
      "remainingAmount": 0,
      "description": "string",
      "createdAt": "2026-11-04T18:41:32.058Z"
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
No links

GET
/api/coachdues/{id}


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
  'https://swimming1academy.runasp.net/api/coachdues/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjQ0NjE4ZjIzLTkyMGUtNGM2Zi04YTg1LTdjOWRhMjU4OWIzMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTY5OTcsImV4cCI6MTc5MzgxNzg5NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FNkGazzGAefdfsHLShzkjdKE3ywo5mJFoI_FbgUgpjk'
Request URL
https://swimming1academy.runasp.net/api/coachdues/1
Server response
Code	Details
200	
Response body
Download
{
  "id": 1,
  "coachId": 1,
  "coachName": "dfghjkjhgfdsa",
  "amount": 100,
  "paidAmount": 0,
  "remainingAmount": 100,
  "description": "شسيبسشيب",
  "createdAt": "2026-11-04T18:41:05.3049897"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:41:12 GMT 
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
  "coachId": 0,
  "coachName": "string",
  "amount": 0,
  "paidAmount": 0,
  "remainingAmount": 0,
  "description": "string",
  "createdAt": "2026-11-04T18:41:32.060Z"
}
paymentType	string
DuePayment (1) or Advance (2)

CoachPayments


POST
/api/coachpayments


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "coachId": 1,
  "paymentType": "DuePayment",
  "coachDueId": 1,
  "amount": 10,
  "notes": "asd",
  "idempotencyKey": "strasdasing"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/coachpayments' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjQ0NjE4ZjIzLTkyMGUtNGM2Zi04YTg1LTdjOWRhMjU4OWIzMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTY5OTcsImV4cCI6MTc5MzgxNzg5NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FNkGazzGAefdfsHLShzkjdKE3ywo5mJFoI_FbgUgpjk' \
  -H 'Content-Type: application/json' \
  -d '{
  "coachId": 1,
  "paymentType": "DuePayment",
  "coachDueId": 1,
  "amount": 10,
  "notes": "asd",
  "idempotencyKey": "strasdasing"
}'
Request URL
https://swimming1academy.runasp.net/api/coachpayments
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Coach payment created successfully.",
  "data": {
    "id": 1,
    "coachId": 1,
    "coachName": "dfghjkjhgfdsa",
    "coachDueId": 1,
    "paymentType": "DuePayment",
    "amount": 10,
    "paymentDate": "2026-11-04T18:42:25.8568301",
    "cashboxType": "Main",
    "notes": "asd",
    "createdAt": "2026-11-04T18:42:25.8568301"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:42:25 GMT 
 location: https://swimming1academy.runasp.net/api/coachpayments/1 
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
    "coachId": 0,
    "coachName": "string",
    "coachDueId": 0,
    "paymentType": "DuePayment",
    "amount": 0,
    "paymentDate": "2026-11-04T18:43:19.060Z",
    "cashboxType": "POS",
    "notes": "string",
    "createdAt": "2026-11-04T18:43:19.060Z"
  }
}
No links

GET
/api/coachpayments


Parameters
Cancel
Name	Description
coachId
integer($int32)
(query)
coachId
paymentType
string
(query)

--
coachDueId
integer($int32)
(query)
coachDueId
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
  'https://swimming1academy.runasp.net/api/coachpayments?page=1&pageSize=20' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjQ0NjE4ZjIzLTkyMGUtNGM2Zi04YTg1LTdjOWRhMjU4OWIzMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTY5OTcsImV4cCI6MTc5MzgxNzg5NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FNkGazzGAefdfsHLShzkjdKE3ywo5mJFoI_FbgUgpjk'
Request URL
https://swimming1academy.runasp.net/api/coachpayments?page=1&pageSize=20
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 1,
      "coachId": 1,
      "coachName": "dfghjkjhgfdsa",
      "coachDueId": 1,
      "paymentType": "DuePayment",
      "amount": 10,
      "paymentDate": "2026-11-04T18:42:25.8568301",
      "cashboxType": "Main",
      "notes": "asd",
      "createdAt": "2026-11-04T18:42:25.8568301"
    }
  ],
  "totalCount": 1,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:42:29 GMT 
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
      "coachId": 0,
      "coachName": "string",
      "coachDueId": 0,
      "paymentType": "DuePayment",
      "amount": 0,
      "paymentDate": "2026-11-04T18:42:53.765Z",
      "cashboxType": "POS",
      "notes": "string",
      "createdAt": "2026-11-04T18:42:53.766Z"
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
No links

GET
/api/coachpayments/{id}


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
  'https://swimming1academy.runasp.net/api/coachpayments/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjQ0NjE4ZjIzLTkyMGUtNGM2Zi04YTg1LTdjOWRhMjU4OWIzMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTY5OTcsImV4cCI6MTc5MzgxNzg5NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FNkGazzGAefdfsHLShzkjdKE3ywo5mJFoI_FbgUgpjk'
Request URL
https://swimming1academy.runasp.net/api/coachpayments/1
Server response
Code	Details
200	
Response body
Download
{
  "id": 1,
  "coachId": 1,
  "coachName": "dfghjkjhgfdsa",
  "coachDueId": 1,
  "paymentType": "DuePayment",
  "amount": 10,
  "paymentDate": "2026-11-04T18:42:25.8568301",
  "cashboxType": "Main",
  "notes": "asd",
  "createdAt": "2026-11-04T18:42:25.8568301"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:42:34 GMT 
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
  "coachId": 0,
  "coachName": "string",
  "coachDueId": 0,
  "paymentType": "DuePayment",
  "amount": 0,
  "paymentDate": "2026-11-04T18:42:53.768Z",
  "cashboxType": "POS",
  "notes": "string",
  "createdAt": "2026-11-04T18:42:53.768Z"
}