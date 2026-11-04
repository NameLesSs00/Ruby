WarehouseTransactions
Name	Description
Page
integer($int32)
(query)
Page
PageSize
integer($int32)
(query)
PageSize
MovementType
string
(query)
Available values : In, Out

POST
/api/warehousetransactions


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "movementType": "In",
  "description": "string",
  "items": [
    {
      "inventoryItemId": 1,
      "quantity": 10
    }
  ]
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/warehousetransactions' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImM0YWMyNzM5LWQwNTMtNGI5Ny1iMWM0LWE4MjdhMDVmY2IzOCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MjY2MTcsImV4cCI6MTc5MzgyNzUxNywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.DX2l9ovE3tE5s89mITd5hA0VrmDQwE6WD29J5kC06o0' \
  -H 'Content-Type: application/json' \
  -d '{
  "movementType": "In",
  "description": "string",
  "items": [
    {
      "inventoryItemId": 1,
      "quantity": 10
    }
  ]
}'
Request URL
https://swimming1academy.runasp.net/api/warehousetransactions
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Warehouse movement created successfully.",
  "data": {
    "movementGroupId": 1,
    "movementType": "In",
    "movementDate": "2026-11-04T21:10:39.2007807",
    "description": "string",
    "items": [
      {
        "id": 1,
        "inventoryItemId": 1,
        "inventoryItemName": "سكر تحليه",
        "quantity": 10
      }
    ]
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 21:10:38 GMT 
 location: https://swimming1academy.runasp.net/api/warehousetransactions/1 
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
    "movementGroupId": 0,
    "movementType": "In",
    "movementDate": "2026-11-04T21:11:10.680Z",
    "description": "string",
    "items": [
      {
        "id": 0,
        "inventoryItemId": 0,
        "inventoryItemName": "string",
        "quantity": 0
      }
    ]
  }
}
No links

GET
/api/warehousetransactions


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
MovementType
string
(query)

--
InventoryItemId
integer($int32)
(query)
InventoryItemId
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/warehousetransactions' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImM0YWMyNzM5LWQwNTMtNGI5Ny1iMWM0LWE4MjdhMDVmY2IzOCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MjY2MTcsImV4cCI6MTc5MzgyNzUxNywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.DX2l9ovE3tE5s89mITd5hA0VrmDQwE6WD29J5kC06o0'
Request URL
https://swimming1academy.runasp.net/api/warehousetransactions
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "movementGroupId": 1,
      "movementType": "In",
      "movementDate": "2026-11-04T21:10:39.2007807",
      "description": "string",
      "items": [
        {
          "id": 1,
          "inventoryItemId": 1,
          "inventoryItemName": "سكر تحليه",
          "quantity": 10
        }
      ]
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalCount": 1,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 21:10:44 GMT 
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
      "movementGroupId": 0,
      "movementType": "In",
      "movementDate": "2026-11-04T21:11:10.691Z",
      "description": "string",
      "items": [
        {
          "id": 0,
          "inventoryItemId": 0,
          "inventoryItemName": "string",
          "quantity": 0
        }
      ]
    }
  ],
  "page": 0,
  "pageSize": 0,
  "totalCount": 0,
  "totalPages": 0
}
No links

GET
/api/warehousetransactions/{id}


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
  'https://swimming1academy.runasp.net/api/warehousetransactions/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImM0YWMyNzM5LWQwNTMtNGI5Ny1iMWM0LWE4MjdhMDVmY2IzOCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM4MjY2MTcsImV4cCI6MTc5MzgyNzUxNywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.DX2l9ovE3tE5s89mITd5hA0VrmDQwE6WD29J5kC06o0'
Request URL
https://swimming1academy.runasp.net/api/warehousetransactions/1
Server response
Code	Details
200	
Response body
Download
{
  "movementGroupId": 1,
  "movementType": "In",
  "movementDate": "2026-11-04T21:10:39.2007807",
  "description": "string",
  "items": [
    {
      "id": 1,
      "inventoryItemId": 1,
      "inventoryItemName": "سكر تحليه",
      "quantity": 10
    }
  ]
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,04 Nov 2026 21:10:52 GMT 
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
  "movementGroupId": 0,
  "movementType": "In",
  "movementDate": "2026-11-04T21:11:10.700Z",
  "description": "string",
  "items": [
    {
      "id": 0,
      "inventoryItemId": 0,
      "inventoryItemName": "string",
      "quantity": 0
    }
  ]
}
No links

PUT
/api/warehousetransactions/{id}


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
  "movementType": "In",
  "movementDate": "2026-11-04T21:11:10.702Z",
  "description": "string",
  "items": [
    {
      "inventoryItemId": 0,
      "quantity": 0
    }
  ]
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
    "movementGroupId": 0,
    "movementType": "In",
    "movementDate": "2026-11-04T21:11:10.703Z",
    "description": "string",
    "items": [
      {
        "id": 0,
        "inventoryItemId": 0,
        "inventoryItemName": "string",
        "quantity": 0
      }
    ]
  }
}
No links

DELETE
/api/warehousetransactions/{id}


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
  "data": "string"
}