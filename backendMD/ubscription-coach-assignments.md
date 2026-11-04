SubscriptionCoachAssignments


POST
/api/subscription-coach-assignments


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "subscriptionId": 2,
  "coachId": 1,
  "employeeId": null,
  "startDate": "2026-11-04",
  "endDate": "2026-11-14",
  "notes": "string"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/subscription-coach-assignments' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjQ0NjE4ZjIzLTkyMGUtNGM2Zi04YTg1LTdjOWRhMjU4OWIzMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTY5OTcsImV4cCI6MTc5MzgxNzg5NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FNkGazzGAefdfsHLShzkjdKE3ywo5mJFoI_FbgUgpjk' \
  -H 'Content-Type: application/json' \
  -d '{
  "subscriptionId": 2,
  "coachId": 1,
  "employeeId": null,
  "startDate": "2026-11-04",
  "endDate": "2026-11-14",
  "notes": "string"
}'
Request URL
https://swimming1academy.runasp.net/api/subscription-coach-assignments
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Subscription coach assignment created successfully.",
  "data": {
    "id": 1,
    "subscriptionId": 2,
    "coachId": 1,
    "coachName": "dfghjkjhgfdsa",
    "employeeId": null,
    "employeeName": null,
    "startDate": "2026-11-04",
    "endDate": "2026-11-14",
    "notes": "string"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:31:01 GMT 
 location: https://swimming1academy.runasp.net/api/subscription-coach-assignments/1 
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
    "subscriptionId": 0,
    "coachId": 0,
    "coachName": "string",
    "employeeId": 0,
    "employeeName": "string",
    "startDate": "2026-11-04",
    "endDate": "2026-11-04",
    "notes": "string"
  }
}
No links

GET
/api/subscription-coach-assignments


Parameters
Cancel
Name	Description
SubscriptionId
integer($int32)
(query)
SubscriptionId
CoachId
integer($int32)
(query)
CoachId
EmployeeId
integer($int32)
(query)
EmployeeId
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
  'https://swimming1academy.runasp.net/api/subscription-coach-assignments' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjQ0NjE4ZjIzLTkyMGUtNGM2Zi04YTg1LTdjOWRhMjU4OWIzMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTY5OTcsImV4cCI6MTc5MzgxNzg5NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FNkGazzGAefdfsHLShzkjdKE3ywo5mJFoI_FbgUgpjk'
Request URL
https://swimming1academy.runasp.net/api/subscription-coach-assignments
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 1,
      "subscriptionId": 2,
      "coachId": 1,
      "coachName": "dfghjkjhgfdsa",
      "employeeId": null,
      "employeeName": null,
      "startDate": "2026-11-04",
      "endDate": "2026-11-14",
      "notes": "string"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalCount": 1,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:31:14 GMT 
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
      "subscriptionId": 0,
      "coachId": 0,
      "coachName": "string",
      "employeeId": 0,
      "employeeName": "string",
      "startDate": "2026-11-04",
      "endDate": "2026-11-04",
      "notes": "string"
    }
  ],
  "page": 0,
  "pageSize": 0,
  "totalCount": 0,
  "totalPages": 0
}
No links

GET
/api/subscription-coach-assignments/{id}


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
  'https://swimming1academy.runasp.net/api/subscription-coach-assignments/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjQ0NjE4ZjIzLTkyMGUtNGM2Zi04YTg1LTdjOWRhMjU4OWIzMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MTY5OTcsImV4cCI6MTc5MzgxNzg5NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.FNkGazzGAefdfsHLShzkjdKE3ywo5mJFoI_FbgUgpjk'
Request URL
https://swimming1academy.runasp.net/api/subscription-coach-assignments/1
Server response
Code	Details
200	
Response body
Download
{
  "id": 1,
  "subscriptionId": 2,
  "coachId": 1,
  "coachName": "dfghjkjhgfdsa",
  "employeeId": null,
  "employeeName": null,
  "startDate": "2026-11-04",
  "endDate": "2026-11-14",
  "notes": "string"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 18:31:19 GMT 
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
  "subscriptionId": 0,
  "coachId": 0,
  "coachName": "string",
  "employeeId": 0,
  "employeeName": "string",
  "startDate": "2026-11-04",
  "endDate": "2026-11-04",
  "notes": "string"
}
No links

PUT
/api/subscription-coach-assignments/{id}


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
  "subscriptionId": 0,
  "coachId": 0,
  "employeeId": 0,
  "startDate": "2026-11-04",
  "endDate": "2026-11-04",
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
    "subscriptionId": 0,
    "coachId": 0,
    "coachName": "string",
    "employeeId": 0,
    "employeeName": "string",
    "startDate": "2026-11-04",
    "endDate": "2026-11-04",
    "notes": "string"
  }
}
No links

DELETE
/api/subscription-coach-assignments/{id}


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
    "subscriptionId": 0,
    "coachId": 0,
    "coachName": "string",
    "employeeId": 0,
    "employeeName": "string",
    "startDate": "2026-11-04",
    "endDate": "2026-11-04",
    "notes": "string"
  }
}