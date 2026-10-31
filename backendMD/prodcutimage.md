Products


POST
/api/products


Parameters
Try it out
No parameters

Request body

multipart/form-data
ProductCategoryId
integer($int32)
Name
string
SalePrice
number($double)
ImageFile
string($binary)
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
    "imageUrl": "string",
    "isActive": true,
    "createdAt": "2026-10-31T17:46:11.264Z"
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
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjVkMDEyYzUwLWU2OGEtNDI1ZS1iYzBkLTg1ZWMyNGI1OTk3ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0Njg2MTIsImV4cCI6MTc5MzQ2OTUxMiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.yG4er6ZdO5hW5yWDz9PUI8FAANNJ-69czCaACnrVViI'
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
      "imageUrl": null,
      "isActive": true,
      "createdAt": "2026-10-28T17:53:30.8028796"
    },
    {
      "id": 2,
      "productCategoryId": 1,
      "productCategoryName": "عصائر",
      "name": "tedasd",
      "salePrice": 10,
      "imageUrl": null,
      "isActive": true,
      "createdAt": "2026-10-30T11:09:35.5857307"
    },
    {
      "id": 3,
      "productCategoryId": 1,
      "productCategoryName": "عصائر",
      "name": "مياه",
      "salePrice": 12,
      "imageUrl": null,
      "isActive": true,
      "createdAt": "2026-10-31T01:15:14.778231"
    },
    {
      "id": 4,
      "productCategoryId": 1,
      "productCategoryName": "عصائر",
      "name": "مياه",
      "salePrice": 12,
      "imageUrl": "/uploads/products/6b0b74b6c923434389836e441036d494.jpg",
      "isActive": true,
      "createdAt": "2026-10-31T01:17:29.5522198"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalCount": 4
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 17:44:47 GMT 
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
      "imageUrl": "string",
      "isActive": true,
      "createdAt": "2026-10-31T17:46:11.267Z"
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
1
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/products/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjVkMDEyYzUwLWU2OGEtNDI1ZS1iYzBkLTg1ZWMyNGI1OTk3ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0Njg2MTIsImV4cCI6MTc5MzQ2OTUxMiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.yG4er6ZdO5hW5yWDz9PUI8FAANNJ-69czCaACnrVViI'
Request URL
https://swimming1academy.runasp.net/api/products/1
Server response
Code	Details
200	
Response body
Download
{
  "id": 1,
  "productCategoryId": 1,
  "productCategoryName": "عصائر",
  "name": "pepsi",
  "salePrice": 15,
  "imageUrl": "/uploads/products/709a6f16cb2e4fe8a8ff50c30d659b0e.jpg",
  "isActive": true,
  "createdAt": "2026-10-28T17:53:30.8028796"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 17:45:53 GMT 
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
  "imageUrl": "string",
  "isActive": true,
  "createdAt": "2026-10-31T17:46:11.270Z"
}
No links

PUT
/api/products/{id}


Parameters
Cancel
Reset
Name	Description
id *
integer($int32)
(path)
1
Request body

multipart/form-data
ProductCategoryId
integer($int32)
1
Send empty value
Name
string
pepsi
Send empty value
SalePrice
number($double)
15
Send empty value
ImageFile
string($binary)
WhatsApp Image 2026-10-28 at 9.33.30 PM.jpeg
Send empty value
RemoveImage
boolean

false
Send empty value
Execute
Clear
Responses
Curl

curl -X 'PUT' \
  'https://swimming1academy.runasp.net/api/products/1' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjVkMDEyYzUwLWU2OGEtNDI1ZS1iYzBkLTg1ZWMyNGI1OTk3ZiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTM0Njg2MTIsImV4cCI6MTc5MzQ2OTUxMiwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.yG4er6ZdO5hW5yWDz9PUI8FAANNJ-69czCaACnrVViI' \
  -H 'Content-Type: multipart/form-data' \
  -F 'ProductCategoryId=1' \
  -F 'Name=pepsi' \
  -F 'SalePrice=15' \
  -F 'ImageFile=@WhatsApp Image 2026-10-28 at 9.33.30 PM.jpeg;type=image/jpeg' \
  -F 'RemoveImage=false'
Request URL
https://swimming1academy.runasp.net/api/products/1
Server response
Code	Details
200	
Response body
Download
{
  "message": "Product updated successfully.",
  "data": {
    "id": 1,
    "productCategoryId": 1,
    "productCategoryName": "عصائر",
    "name": "pepsi",
    "salePrice": 15,
    "imageUrl": "/uploads/products/709a6f16cb2e4fe8a8ff50c30d659b0e.jpg",
    "isActive": true,
    "createdAt": "2026-10-28T17:53:30.8028796"
  }
}
Response headers
 access-control-allow-origin: * 
 content-type: application/json; charset=utf-8 
 date: Sat,31 Oct 2026 17:45:40 GMT 
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
    "imageUrl": "string",
    "isActive": true,
    "createdAt": "2026-10-31T17:46:11.274Z"
  }
}