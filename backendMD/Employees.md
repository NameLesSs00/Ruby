Employees


POST
/api/employees


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "fullName": "string",
  "phoneNumber": "string",
  "jobTitle": "string",
  "monthlySalary": 0,
  "hireDate": "2026-10-30"
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
    "fullName": "string",
    "phoneNumber": "string",
    "jobTitle": "string",
    "monthlySalary": 0,
    "hireDate": "2026-10-30",
    "isActive": true,
    "createdAt": "2026-10-30T10:57:12.629Z"
  }
}
No links

GET
/api/employees


Parameters
Cancel
Name	Description
SearchTerm
string
(query)
SearchTerm
IsActive
boolean
(query)

--
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
  'https://swimming1academy.runasp.net/api/employees' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAyNzJiNjg5LWFkZDMtNDQ2Mi04NzIxLTZjODFhN2RlNDU0NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTc4MTMsImV4cCI6MTc5MzM1ODcxMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.rX3B4iP0j8wjNu6vXw37d0_VxRby15yBDKGnrssXPQ8'
Request URL
https://swimming1academy.runasp.net/api/employees
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 1,
      "fullName": "احمد محمود",
      "phoneNumber": "0102154554",
      "jobTitle": "مدرب",
      "monthlySalary": 8000,
      "hireDate": "2000-10-29",
      "isActive": true,
      "createdAt": "2026-10-29T17:56:35.4354876"
    }
  ],
  "totalCount": 1,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 10:57:04 GMT 
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
      "jobTitle": "string",
      "monthlySalary": 0,
      "hireDate": "2026-10-30",
      "isActive": true,
      "createdAt": "2026-10-30T10:57:12.634Z"
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
No links

GET
/api/employees/{id}


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
  'https://swimming1academy.runasp.net/api/employees/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAyNzJiNjg5LWFkZDMtNDQ2Mi04NzIxLTZjODFhN2RlNDU0NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTc4MTMsImV4cCI6MTc5MzM1ODcxMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.rX3B4iP0j8wjNu6vXw37d0_VxRby15yBDKGnrssXPQ8'
Request URL
https://swimming1academy.runasp.net/api/employees/1
Server response
Code	Details
200	
Response body
Download
{
  "id": 1,
  "fullName": "احمد محمود",
  "phoneNumber": "0102154554",
  "jobTitle": "مدرب",
  "monthlySalary": 8000,
  "hireDate": "2000-10-29",
  "isActive": true,
  "createdAt": "2026-10-29T17:56:35.4354876"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 10:57:11 GMT 
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
  "jobTitle": "string",
  "monthlySalary": 0,
  "hireDate": "2026-10-30",
  "isActive": true,
  "createdAt": "2026-10-30T10:57:12.639Z"
}
No links

PUT
/api/employees/{id}


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
  "jobTitle": "string",
  "monthlySalary": 0,
  "hireDate": "2026-10-30"
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
    "fullName": "string",
    "phoneNumber": "string",
    "jobTitle": "string",
    "monthlySalary": 0,
    "hireDate": "2026-10-30",
    "isActive": true,
    "createdAt": "2026-10-30T10:57:12.642Z"
  }
}
No links

DELETE
/api/employees/{id}


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
    "fullName": "string",
    "phoneNumber": "string",
    "jobTitle": "string",
    "monthlySalary": 0,
    "hireDate": "2026-10-30",
    "isActive": true,
    "createdAt": "2026-10-30T10:57:12.644Z"
  }
}
No links

PATCH
/api/employees/{id}/status


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
    "fullName": "string",
    "phoneNumber": "string",
    "jobTitle": "string",
    "monthlySalary": 0,
    "hireDate": "2026-10-30",
    "isActive": true,
    "createdAt": "2026-10-30T10:57:12.646Z"
  }
}