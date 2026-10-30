Suppliers


POST
/api/suppliers


Parameters
Cancel
No parameters

Request body

application/json
{
  "name": "string",
  "companyName": "string",
  "phoneNumber": "string",
  "address": "string",
  "notes": "string"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/suppliers' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAyNzJiNjg5LWFkZDMtNDQ2Mi04NzIxLTZjODFhN2RlNDU0NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTc4MTMsImV4cCI6MTc5MzM1ODcxMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.rX3B4iP0j8wjNu6vXw37d0_VxRby15yBDKGnrssXPQ8' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "string",
  "companyName": "string",
  "phoneNumber": "string",
  "address": "string",
  "notes": "string"
}'
Request URL
https://swimming1academy.runasp.net/api/suppliers
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Supplier created successfully.",
  "data": {
    "id": 1,
    "name": "string",
    "companyName": "string",
    "phoneNumber": "string",
    "address": "string",
    "notes": "string",
    "isActive": true,
    "createdAt": "2026-10-30T11:06:48.1978144Z"
  }
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 11:06:48 GMT 
 location: https://swimming1academy.runasp.net/api/suppliers/1 
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
    "name": "string",
    "companyName": "string",
    "phoneNumber": "string",
    "address": "string",
    "notes": "string",
    "isActive": true,
    "createdAt": "2026-10-30T11:07:08.899Z"
  }
}
No links

GET
/api/suppliers


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
Search
string
(query)
Search
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/suppliers' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAyNzJiNjg5LWFkZDMtNDQ2Mi04NzIxLTZjODFhN2RlNDU0NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTc4MTMsImV4cCI6MTc5MzM1ODcxMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.rX3B4iP0j8wjNu6vXw37d0_VxRby15yBDKGnrssXPQ8'
Request URL
https://swimming1academy.runasp.net/api/suppliers
Server response
Code	Details
200	
Response body
Download
{
  "items": [],
  "page": 1,
  "pageSize": 10,
  "totalCount": 0
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 11:06:42 GMT 
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
      "name": "string",
      "companyName": "string",
      "phoneNumber": "string",
      "address": "string",
      "notes": "string",
      "isActive": true,
      "createdAt": "2026-10-30T11:07:08.904Z"
    }
  ],
  "page": 0,
  "pageSize": 0,
  "totalCount": 0
}
No links

GET
/api/suppliers/{id}


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
  'https://swimming1academy.runasp.net/api/suppliers/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAyNzJiNjg5LWFkZDMtNDQ2Mi04NzIxLTZjODFhN2RlNDU0NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTc4MTMsImV4cCI6MTc5MzM1ODcxMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.rX3B4iP0j8wjNu6vXw37d0_VxRby15yBDKGnrssXPQ8'
Request URL
https://swimming1academy.runasp.net/api/suppliers/1
Server response
Code	Details
200	
Response body
Download
{
  "id": 1,
  "name": "string",
  "companyName": "string",
  "phoneNumber": "string",
  "address": "string",
  "notes": "string",
  "isActive": true,
  "createdAt": "2026-10-30T11:06:48.1978144"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 11:06:53 GMT 
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
  "name": "string",
  "companyName": "string",
  "phoneNumber": "string",
  "address": "string",
  "notes": "string",
  "isActive": true,
  "createdAt": "2026-10-30T11:07:08.908Z"
}
No links

PUT
/api/suppliers/{id}


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
  "name": "string",
  "companyName": "string",
  "phoneNumber": "string",
  "address": "string",
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
    "name": "string",
    "companyName": "string",
    "phoneNumber": "string",
    "address": "string",
    "notes": "string",
    "isActive": true,
    "createdAt": "2026-10-30T11:07:08.911Z"
  }
}
No links

DELETE
/api/suppliers/{id}


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
No links

PATCH
/api/suppliers/{id}/status


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
    "companyName": "string",
    "phoneNumber": "string",
    "address": "string",
    "notes": "string",
    "isActive": true,
    "createdAt": "2026-10-30T11:07:08.916Z"
  }
}

ProductCategories


POST
/api/product-categories


Parameters
Cancel
No parameters

Request body

application/json
{
  "name": "string"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/product-categories' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAyNzJiNjg5LWFkZDMtNDQ2Mi04NzIxLTZjODFhN2RlNDU0NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTc4MTMsImV4cCI6MTc5MzM1ODcxMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.rX3B4iP0j8wjNu6vXw37d0_VxRby15yBDKGnrssXPQ8' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "string"
}'
Request URL
https://swimming1academy.runasp.net/api/product-categories
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Product category created successfully.",
  "data": {
    "id": 2,
    "name": "string",
    "isActive": true,
    "createdAt": "2026-10-30T11:09:03.7147749Z"
  }
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 11:09:03 GMT 
 location: https://swimming1academy.runasp.net/api/product-categories/2 
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
    "name": "string",
    "isActive": true,
    "createdAt": "2026-10-30T11:09:50.449Z"
  }
}
No links

GET
/api/product-categories


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
Search
string
(query)
Search
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/product-categories' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAyNzJiNjg5LWFkZDMtNDQ2Mi04NzIxLTZjODFhN2RlNDU0NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTc4MTMsImV4cCI6MTc5MzM1ODcxMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.rX3B4iP0j8wjNu6vXw37d0_VxRby15yBDKGnrssXPQ8'
Request URL
https://swimming1academy.runasp.net/api/product-categories
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 1,
      "name": "عصائر",
      "isActive": true,
      "createdAt": "2026-10-28T17:52:54.7896267"
    },
    {
      "id": 2,
      "name": "string",
      "isActive": true,
      "createdAt": "2026-10-30T11:09:03.7147749"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalCount": 2
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 11:09:06 GMT 
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
      "name": "string",
      "isActive": true,
      "createdAt": "2026-10-30T11:09:50.453Z"
    }
  ],
  "page": 0,
  "pageSize": 0,
  "totalCount": 0
}
No links

GET
/api/product-categories/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
2
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/product-categories/2' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAyNzJiNjg5LWFkZDMtNDQ2Mi04NzIxLTZjODFhN2RlNDU0NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTc4MTMsImV4cCI6MTc5MzM1ODcxMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.rX3B4iP0j8wjNu6vXw37d0_VxRby15yBDKGnrssXPQ8'
Request URL
https://swimming1academy.runasp.net/api/product-categories/2
Server response
Code	Details
200	
Response body
Download
{
  "id": 2,
  "name": "string",
  "isActive": true,
  "createdAt": "2026-10-30T11:09:03.7147749"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 11:09:12 GMT 
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
  "name": "string",
  "isActive": true,
  "createdAt": "2026-10-30T11:09:50.455Z"
}
No links

PUT
/api/product-categories/{id}


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
    "createdAt": "2026-10-30T11:09:50.458Z"
  }
}
No links

PATCH
/api/product-categories/{id}/status


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
    "createdAt": "2026-10-30T11:09:50.463Z"
  }
}
No links
Products


POST
/api/products


Parameters
Cancel
Reset
No parameters

Request body

application/json
{
  "productCategoryId": 1,
  "name": "tedasd",
  "salePrice":10
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  'https://swimming1academy.runasp.net/api/products' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAyNzJiNjg5LWFkZDMtNDQ2Mi04NzIxLTZjODFhN2RlNDU0NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTc4MTMsImV4cCI6MTc5MzM1ODcxMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.rX3B4iP0j8wjNu6vXw37d0_VxRby15yBDKGnrssXPQ8' \
  -H 'Content-Type: application/json' \
  -d '{
  "productCategoryId": 1,
  "name": "tedasd",
  "salePrice":10
}'
Request URL
https://swimming1academy.runasp.net/api/products
Server response
Code	Details
201
Undocumented
Response body
Download
{
  "message": "Product created successfully.",
  "data": {
    "id": 2,
    "productCategoryId": 1,
    "productCategoryName": "عصائر",
    "name": "tedasd",
    "salePrice": 10,
    "isActive": true,
    "createdAt": "2026-10-30T11:09:35.5857307"
  }
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 11:09:35 GMT 
 location: https://swimming1academy.runasp.net/api/products/2 
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
    "productCategoryId": 0,
    "productCategoryName": "string",
    "name": "string",
    "salePrice": 0,
    "isActive": true,
    "createdAt": "2026-10-30T11:09:50.467Z"
  }
}
No links

GET
/api/products


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
Search
string
(query)
Search
CategoryId
integer($int32)
(query)
CategoryId
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/products' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAyNzJiNjg5LWFkZDMtNDQ2Mi04NzIxLTZjODFhN2RlNDU0NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTc4MTMsImV4cCI6MTc5MzM1ODcxMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.rX3B4iP0j8wjNu6vXw37d0_VxRby15yBDKGnrssXPQ8'
Request URL
https://swimming1academy.runasp.net/api/products
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 1,
      "productCategoryId": 1,
      "productCategoryName": "عصائر",
      "name": "pepsi",
      "salePrice": 15,
      "isActive": true,
      "createdAt": "2026-10-28T17:53:30.8028796"
    },
    {
      "id": 2,
      "productCategoryId": 1,
      "productCategoryName": "عصائر",
      "name": "tedasd",
      "salePrice": 10,
      "isActive": true,
      "createdAt": "2026-10-30T11:09:35.5857307"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalCount": 2
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 11:09:41 GMT 
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
      "productCategoryId": 0,
      "productCategoryName": "string",
      "name": "string",
      "salePrice": 0,
      "isActive": true,
      "createdAt": "2026-10-30T11:09:50.472Z"
    }
  ],
  "page": 0,
  "pageSize": 0,
  "totalCount": 0
}
No links

GET
/api/products/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
2
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/products/2' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjAyNzJiNjg5LWFkZDMtNDQ2Mi04NzIxLTZjODFhN2RlNDU0NCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTMzNTc4MTMsImV4cCI6MTc5MzM1ODcxMywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.rX3B4iP0j8wjNu6vXw37d0_VxRby15yBDKGnrssXPQ8'
Request URL
https://swimming1academy.runasp.net/api/products/2
Server response
Code	Details
200	
Response body
Download
{
  "id": 2,
  "productCategoryId": 1,
  "productCategoryName": "عصائر",
  "name": "tedasd",
  "salePrice": 10,
  "isActive": true,
  "createdAt": "2026-10-30T11:09:35.5857307"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Fri,30 Oct 2026 11:09:48 GMT 
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
  "productCategoryId": 0,
  "productCategoryName": "string",
  "name": "string",
  "salePrice": 0,
  "isActive": true,
  "createdAt": "2026-10-30T11:09:50.477Z"
}
No links

PUT
/api/products/{id}


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
  "productCategoryId": 0,
  "name": "string",
  "salePrice": 0
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
    "productCategoryId": 0,
    "productCategoryName": "string",
    "name": "string",
    "salePrice": 0,
    "isActive": true,
    "createdAt": "2026-10-30T11:09:50.489Z"
  }
}
No links

DELETE
/api/products/{id}


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
No links

PATCH
/api/products/{id}/status


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
    "productCategoryId": 0,
    "productCategoryName": "string",
    "name": "string",
    "salePrice": 0,
    "isActive": true,
    "createdAt": "2026-10-30T11:09:50.496Z"
  }
}