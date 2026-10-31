we have three roles 
SuperAdmin ,ReceptionAdmin, ShopAdmin
okay?
you can't create a superAdmin
each will has it's own view but anyways 
here is the controlloer for the admins
Admins


POST
/api/admins


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "userName": "pola",
  "email": "pola@pola.com",
  "password": "Pola123!",
  "role": "ReceptionAdmin"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/admins' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3ODIyMzcxLWQxNTEtNGYyNi1hMmZlLWMzNzc4NjliNGQ2YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzg3NzksImV4cCI6MTc5MzM3OTY3OSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.R7G7RA-y2uirhPmTfpej1EPrQ8R0dO-bWAY21xkYsJo' \
  -H 'Content-Type: application/json' \
  -d '{
  "userName": "pola",
  "email": "pola@pola.com",
  "password": "Pola123!",
  "role": "ReceptionAdmin"
}'
Request URL
https://swimming1academy.runasp.net/api/admins
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "id": "4",
  "userName": "pola",
  "email": "pola@pola.com",
  "role": "ReceptionAdmin",
  "isDeactivated": false
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 16:48:41 GMT 
 location: https://swimming1academy.runasp.net/api/admins/4 
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
  "id": "string",
  "userName": "string",
  "email": "string",
  "role": "ReceptionAdmin",
  "isDeactivated": true
}
No links

GET
/api/admins


Parameters
Cancel
No parameters

Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/admins' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3ODIyMzcxLWQxNTEtNGYyNi1hMmZlLWMzNzc4NjliNGQ2YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzg3NzksImV4cCI6MTc5MzM3OTY3OSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.R7G7RA-y2uirhPmTfpej1EPrQ8R0dO-bWAY21xkYsJo'
Request URL
https://swimming1academy.runasp.net/api/admins
Server response
Code	Details
200	
Response body
Download
[
  {
    "id": "4",
    "userName": "pola",
    "email": "pola@pola.com",
    "role": "ReceptionAdmin",
    "isDeactivated": false
  },
  {
    "id": "2",
    "userName": "reception",
    "email": "reception@gmail.com",
    "role": "ReceptionAdmin",
    "isDeactivated": false
  },
  {
    "id": "3",
    "userName": "shopadmin",
    "email": "shopadmin@gmail.com",
    "role": "ShopAdmin",
    "isDeactivated": false
  }
]
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 16:48:45 GMT 
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
[
  {
    "id": "string",
    "userName": "string",
    "email": "string",
    "role": "ReceptionAdmin",
    "isDeactivated": true
  }
]
No links

GET
/api/admins/{id}


Parameters
Cancel
Name	Description
id *
string
(path)
4
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/admins/4' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3ODIyMzcxLWQxNTEtNGYyNi1hMmZlLWMzNzc4NjliNGQ2YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzg3NzksImV4cCI6MTc5MzM3OTY3OSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.R7G7RA-y2uirhPmTfpej1EPrQ8R0dO-bWAY21xkYsJo'
Request URL
https://swimming1academy.runasp.net/api/admins/4
Server response
Code	Details
200	
Response body
Download
{
  "id": "4",
  "userName": "pola",
  "email": "pola@pola.com",
  "role": "ReceptionAdmin",
  "isDeactivated": false
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 16:48:58 GMT 
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
  "id": "string",
  "userName": "string",
  "email": "string",
  "role": "ReceptionAdmin",
  "isDeactivated": true
}
No links

PUT
/api/admins/{id}


Parameters
Cancel
Reset
Name	Description
id *
string
(path)
4
Request body

application/json
{
  "userName": "polasmsm",
  "email": "pola@pola.com"
}
Execute
Clear
Responses
Curl

curl -X 'PUT' \
  'https://swimming1academy.runasp.net/api/admins/4' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3ODIyMzcxLWQxNTEtNGYyNi1hMmZlLWMzNzc4NjliNGQ2YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzg3NzksImV4cCI6MTc5MzM3OTY3OSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.R7G7RA-y2uirhPmTfpej1EPrQ8R0dO-bWAY21xkYsJo' \
  -H 'Content-Type: application/json' \
  -d '{
  "userName": "polasmsm",
  "email": "pola@pola.com"
}'
Request URL
https://swimming1academy.runasp.net/api/admins/4
Server response
Code	Details
200	
Response body
Download
{
  "id": "4",
  "userName": "polasmsm",
  "email": "pola@pola.com",
  "role": "ReceptionAdmin",
  "isDeactivated": false
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 16:49:34 GMT 
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
  "id": "string",
  "userName": "string",
  "email": "string",
  "role": "ReceptionAdmin",
  "isDeactivated": true
}
No links

PUT
/api/admins/{id}/password


Parameters
Cancel
Reset
Name	Description
id *
string
(path)
4
Request body

application/json
{
  "newPassword": "Pola123!",
  "confirmPassword": "Pola123!"
}
Execute
Clear
Responses
Curl

curl -X 'PUT' \
  'https://swimming1academy.runasp.net/api/admins/4/password' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3ODIyMzcxLWQxNTEtNGYyNi1hMmZlLWMzNzc4NjliNGQ2YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzg3NzksImV4cCI6MTc5MzM3OTY3OSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.R7G7RA-y2uirhPmTfpej1EPrQ8R0dO-bWAY21xkYsJo' \
  -H 'Content-Type: application/json' \
  -d '{
  "newPassword": "Pola123!",
  "confirmPassword": "Pola123!"
}'
Request URL
https://swimming1academy.runasp.net/api/admins/4/password
Server response
Code	Details
204
Undocumented
Response headers
 access-control-allow-origin: * 
 date: Fri,30 Oct 2026 16:49:51 GMT 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

No links

PUT
/api/admins/{id}/status


Parameters
Cancel
Name	Description
id *
string
(path)
4
Request body

application/json
{
  "isDeactivated": true
}
Execute
Clear
Responses
Curl

curl -X 'PUT' \
  'https://swimming1academy.runasp.net/api/admins/4/status' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3ODIyMzcxLWQxNTEtNGYyNi1hMmZlLWMzNzc4NjliNGQ2YiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzg3NzksImV4cCI6MTc5MzM3OTY3OSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.R7G7RA-y2uirhPmTfpej1EPrQ8R0dO-bWAY21xkYsJo' \
  -H 'Content-Type: application/json' \
  -d '{
  "isDeactivated": true
}'
Request URL
https://swimming1academy.runasp.net/api/admins/4/status
Server response
Code	Details
200	
Response body
Download
{
  "id": "4",
  "userName": "polasmsm",
  "email": "pola@pola.com",
  "role": "ReceptionAdmin",
  "isDeactivated": true
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 16:50:00 GMT 
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
  "id": "string",
  "userName": "string",
  "email": "string",
  "role": "ReceptionAdmin",
  "isDeactivated": true
}