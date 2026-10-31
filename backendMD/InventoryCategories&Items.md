InventoryCategories


POST
/api/inventory-categories


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "name": "string"
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
    "name": "string",
    "isActive": true,
    "createdAt": "2026-10-30T17:05:20.264Z"
  }
}
No links

GET
/api/inventory-categories


Parameters
Try it out
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
      "name": "string",
      "isActive": true,
      "createdAt": "2026-10-30T17:05:20.267Z"
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
No links

GET
/api/inventory-categories/{id}


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
  "name": "string",
  "isActive": true,
  "createdAt": "2026-10-30T17:05:20.269Z"
}
No links

PUT
/api/inventory-categories/{id}


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
  "name": "string"
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
    "name": "string",
    "isActive": true,
    "createdAt": "2026-10-30T17:05:20.272Z"
  }
}
No links

DELETE
/api/inventory-categories/{id}


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
    "name": "string",
    "isActive": true,
    "createdAt": "2026-10-30T17:05:20.274Z"
  }
}
No links

PATCH
/api/inventory-categories/{id}/status


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
    "name": "string",
    "isActive": true,
    "createdAt": "2026-10-30T17:05:20.276Z"
  }
}
No links
InventoryItems


POST
/api/inventory-items


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "inventoryCategoryId": 0,
  "name": "string",
  "unit": "Piece"
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
    "inventoryCategoryId": 0,
    "inventoryCategoryName": "string",
    "name": "string",
    "unit": "Piece",
    "isActive": true,
    "createdAt": "2026-10-30T17:05:20.278Z"
  }
}
No links

GET
/api/inventory-items


Parameters
Cancel
Name	Description
SearchTerm
string
(query)
SearchTerm
InventoryCategoryId
integer($int32)
(query)
InventoryCategoryId
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
  'https://swimming1academy.runasp.net/api/inventory-items' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImQ1OGJkODU0LWM5ZjItNGEyYy1iMWM1LTc2NWEyMDA3YmNjNSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNzk4OTUsImV4cCI6MTc5MzM4MDc5NCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.IAxqOLQBV5bB4sI29dI-rd2pV79EtR9y6rNM7X1All8'
Request URL
https://swimming1academy.runasp.net/api/inventory-items
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 1,
      "inventoryCategoryId": 1,
      "inventoryCategoryName": "العصائر",
      "name": "ببسي",
      "unit": "Piece",
      "isActive": true,
      "createdAt": "2026-10-29T13:26:43.5108283"
    }
  ],
  "totalCount": 1,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 17:05:10 GMT 
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
      "inventoryCategoryId": 0,
      "inventoryCategoryName": "string",
      "name": "string",
      "unit": "Piece",
      "isActive": true,
      "createdAt": "2026-10-30T17:05:20.284Z"
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
No links

GET
/api/inventory-items/{id}


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
  "inventoryCategoryId": 0,
  "inventoryCategoryName": "string",
  "name": "string",
  "unit": "Piece",
  "isActive": true,
  "createdAt": "2026-10-30T17:05:20.286Z"
}
No links

PUT
/api/inventory-items/{id}


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
  "inventoryCategoryId": 0,
  "name": "string",
  "unit": "Piece"
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
    "inventoryCategoryId": 0,
    "inventoryCategoryName": "string",
    "name": "string",
    "unit": "Piece",
    "isActive": true,
    "createdAt": "2026-10-30T17:05:20.289Z"
  }
}
No links

DELETE
/api/inventory-items/{id}


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
    "inventoryCategoryId": 0,
    "inventoryCategoryName": "string",
    "name": "string",
    "unit": "Piece",
    "isActive": true,
    "createdAt": "2026-10-30T17:05:20.291Z"
  }
}
No links

PATCH
/api/inventory-items/{id}/status


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
    "inventoryCategoryId": 0,
    "inventoryCategoryName": "string",
    "name": "string",
    "unit": "Piece",
    "isActive": true,
    "createdAt": "2026-10-30T17:05:20.294Z"
  }
}