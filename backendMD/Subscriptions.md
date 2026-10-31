note that hte commissionCoachId could be null ir the clientType is Academy
Subscriptions

clientType	ClientTypeClientTypestring
Enum:
[ Academy, External ]
subscriptionType	SubscriptionTypeSubscriptionTypestring
Enum:
[ Sessions, Duration, PrivateTraining ]

POST
/api/subscriptions


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "clientId": 0,
  "commissionCoachId": 0,
  "clientType": "Academy",
  "subscriptionType": "Sessions",
  "startDate": "2026-10-30",
  "endDate": "2026-10-30",
  "totalSessions": 0,
  "amount": 0,
  "discountAmount": 0,
  "paidAmount": 0,
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
    "commissionCoachId": 0,
    "commissionCoachName": "string",
    "clientType": "Academy",
    "subscriptionType": "Sessions",
    "startDate": "2026-10-30",
    "endDate": "2026-10-30",
    "totalSessions": 0,
    "usedSessions": 0,
    "amount": 0,
    "discountAmount": 0,
    "finalAmount": 0,
    "paidAmount": 0,
    "remainingAmount": 0,
    "paymentStatus": "Unpaid",
    "status": "Active",
    "createdAt": "2026-10-30T18:26:56.401Z",
    "notes": "string"
  }
}
No links

GET
/api/subscriptions


Parameters
Try it out
Name	Description
ClientId
integer($int32)
(query)
ClientId
Status
string
(query)
Available values : Active, Completed, Expired, Cancelled


--
PaymentStatus
string
(query)
Available values : Unpaid, PartiallyPaid, Paid


--
Page
integer($int32)
(query)
Page
PageSize
integer($int32)
(query)
PageSize
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/subscriptions' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjliOWIxOTcyLWUxNTUtNGIxZC05OWJiLTVmMDQ2NzFmNWU3NyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzODQ2ODYsImV4cCI6MTc5MzM4NTU4NiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.LmZEEN2Hxp39C8NUQjdc4MSc0nvsLyw3U1ZrgBWgSr8'
Request URL
https://swimming1academy.runasp.net/api/subscriptions
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
      "clientName": "حماده فتوح",
      "commissionCoachId": 1,
      "commissionCoachName": "كابتن محمد سليمان",
      "clientType": "Academy",
      "subscriptionType": "Sessions",
      "startDate": "2026-10-28",
      "endDate": "2026-11-28",
      "totalSessions": 4,
      "usedSessions": 0,
      "amount": 1500,
      "discountAmount": 0,
      "finalAmount": 1500,
      "paidAmount": 600,
      "remainingAmount": 900,
      "paymentStatus": "PartiallyPaid",
      "status": "Active",
      "createdAt": "2026-10-28T17:50:45.862148",
      "notes": null
    }
  ],
  "totalCount": 1,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 18:25:10 GMT 
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
      "commissionCoachId": 0,
      "commissionCoachName": "string",
      "clientType": "Academy",
      "subscriptionType": "Sessions",
      "startDate": "2026-10-30",
      "endDate": "2026-10-30",
      "totalSessions": 0,
      "usedSessions": 0,
      "amount": 0,
      "discountAmount": 0,
      "finalAmount": 0,
      "paidAmount": 0,
      "remainingAmount": 0,
      "paymentStatus": "Unpaid",
      "status": "Active",
      "createdAt": "2026-10-30T18:26:56.372Z",
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
/api/subscriptions/{id}


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
  "id": 0,
  "clientId": 0,
  "clientName": "string",
  "commissionCoachId": 0,
  "commissionCoachName": "string",
  "clientType": "Academy",
  "subscriptionType": "Sessions",
  "startDate": "2026-10-30",
  "endDate": "2026-10-30",
  "totalSessions": 0,
  "usedSessions": 0,
  "amount": 0,
  "discountAmount": 0,
  "finalAmount": 0,
  "paidAmount": 0,
  "remainingAmount": 0,
  "paymentStatus": "Unpaid",
  "status": "Active",
  "createdAt": "2026-10-30T18:26:56.375Z",
  "notes": "string"
}
No links

PUT
/api/subscriptions/{id}


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
  "commissionCoachId": 0,
  "clientType": "Academy",
  "subscriptionType": "Sessions",
  "startDate": "2026-10-30",
  "endDate": "2026-10-30",
  "totalSessions": 0,
  "amount": 0,
  "discountAmount": 0,
  "paidAmount": 0,
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
    "commissionCoachId": 0,
    "commissionCoachName": "string",
    "clientType": "Academy",
    "subscriptionType": "Sessions",
    "startDate": "2026-10-30",
    "endDate": "2026-10-30",
    "totalSessions": 0,
    "usedSessions": 0,
    "amount": 0,
    "discountAmount": 0,
    "finalAmount": 0,
    "paidAmount": 0,
    "remainingAmount": 0,
    "paymentStatus": "Unpaid",
    "status": "Active",
    "createdAt": "2026-10-30T18:26:56.379Z",
    "notes": "string"
  }
}
No links

DELETE
/api/subscriptions/{id}


Parameters
Try it out
Name	Description
id *
integer($int32)
(path)
1
Responses
Curl

curl -X 'DELETE' \
  'https://swimming1academy.runasp.net/api/subscriptions/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjliOWIxOTcyLWUxNTUtNGIxZC05OWJiLTVmMDQ2NzFmNWU3NyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzODQ2ODYsImV4cCI6MTc5MzM4NTU4NiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.LmZEEN2Hxp39C8NUQjdc4MSc0nvsLyw3U1ZrgBWgSr8'
Request URL
https://swimming1academy.runasp.net/api/subscriptions/1
Server response
Code	Details
400
Undocumented
Error: response status is 400

Response body
Download
{
  "error": "Cannot delete subscription because it has related due payment records."
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 18:26:22 GMT 
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
    "commissionCoachId": 0,
    "commissionCoachName": "string",
    "clientType": "Academy",
    "subscriptionType": "Sessions",
    "startDate": "2026-10-30",
    "endDate": "2026-10-30",
    "totalSessions": 0,
    "usedSessions": 0,
    "amount": 0,
    "discountAmount": 0,
    "finalAmount": 0,
    "paidAmount": 0,
    "remainingAmount": 0,
    "paymentStatus": "Unpaid",
    "status": "Active",
    "createdAt": "2026-10-30T18:26:56.382Z",
    "notes": "string"
  }
}