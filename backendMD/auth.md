create a plan so that we use those to create the login page then the admin page it should be a simple login page with the logo of the place and name and inputs for username and password and we should have the eye icon so that if we want to see the password being typed 
create a plan so that we use those enpdoint and create the login page and the admin dashboard it should have a side bar to the right with empty tabs for now and each page should be empty okay create a plan for all of that 
Auth


POST
/api/auth/login


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "email": "superadmin@gmail.com",
  "password": "Mohamed@#9"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/auth/login' \
  -H 'accept: text/plain' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "superadmin@gmail.com",
  "password": "Mohamed@#9"
}'
Request URL
https://swimming1academy.runasp.net/api/auth/login
Server response
Code	Details
200	
Response body
Download
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAyMzUwNWJhLWRlY2EtNDg0MS1hNGU5LTQzY2JjMjY0MmE1MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTM2MjgsImV4cCI6MTc5MzM1NDUyOCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.VXKnR3eCCOprjb22xcLZ-1ZqaxOddrEj4DAp8DpUkfc",
  "refreshToken": "+KvUNqYUxzLrrTcE5KotxUjbcLY74FvDMqd0LX3NV+rwoZpOZE/NgI5xBDsGOUtriA5OkH58lkBsJwhBkaKwRg==",
  "accessTokenExpiresAtUtc": "2026-10-30T10:02:08.4615625Z"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 09:47:07 GMT 
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
  "accessToken": "string",
  "refreshToken": "string",
  "accessTokenExpiresAtUtc": "2026-10-30T09:52:14.146Z"
}
No links

POST
/api/auth/refresh


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "refreshToken": "+KvUNqYUxzLrrTcE5KotxUjbcLY74FvDMqd0LX3NV+rwoZpOZE/NgI5xBDsGOUtriA5OkH58lkBsJwhBkaKwRg=="
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/auth/refresh' \
  -H 'accept: text/plain' \
  -H 'Content-Type: application/json' \
  -d '{
  "refreshToken": "+KvUNqYUxzLrrTcE5KotxUjbcLY74FvDMqd0LX3NV+rwoZpOZE/NgI5xBDsGOUtriA5OkH58lkBsJwhBkaKwRg=="
}'
Request URL
https://swimming1academy.runasp.net/api/auth/refresh
Server response
Code	Details
200	
Response body
Download
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjQ4YTdmMGY3LTcwMDAtNDkxNC1hZTU2LTU4YzJiYjhhZDQ1NSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTM2MzksImV4cCI6MTc5MzM1NDUzOSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.Q4WVTLQgzub4m1S8x9g4FjoARgtfjoJ4cMuSf-DYsEc",
  "refreshToken": "rNQAmYTADCMdUoSolpDMsVn/bfysErpbX20Fl5TDDmwLTkg+rf9QdZ9gCZ8DgEReXh+KRs3SfZXJ147Ft4LSmA==",
  "accessTokenExpiresAtUtc": "2026-10-30T10:02:19.6453147Z"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 09:47:19 GMT 
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
  "accessToken": "string",
  "refreshToken": "string",
  "accessTokenExpiresAtUtc": "2026-10-30T09:52:14.148Z"
}
No links

POST
/api/auth/logout


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "refreshToken": "+KvUNqYUxzLrrTcE5KotxUjbcLY74FvDMqd0LX3NV+rwoZpOZE/NgI5xBDsGOUtriA5OkH58lkBsJwhBkaKwRg=="
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/auth/logout' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjQ4YTdmMGY3LTcwMDAtNDkxNC1hZTU2LTU4YzJiYjhhZDQ1NSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTM2MzksImV4cCI6MTc5MzM1NDUzOSwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.Q4WVTLQgzub4m1S8x9g4FjoARgtfjoJ4cMuSf-DYsEc' \
  -H 'Content-Type: application/json' \
  -d '{
  "refreshToken": "+KvUNqYUxzLrrTcE5KotxUjbcLY74FvDMqd0LX3NV+rwoZpOZE/NgI5xBDsGOUtriA5OkH58lkBsJwhBkaKwRg=="
}'
Request URL
https://swimming1academy.runasp.net/api/auth/logout
Server response
Code	Details
204
Undocumented
Response headers
 date: Fri,30 Oct 2026 09:50:27 GMT 
 server: Microsoft-IIS/10.0 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK