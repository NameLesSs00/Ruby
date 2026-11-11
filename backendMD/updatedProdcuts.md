now products has new fileds like the barcode which will be unique and also will be mostly numbers but it accpets both numbers and string
and we have als employee pirce this will be used later 
could you create a full plan so that we could update the prodcts sechma nad make sure now it works right in the app create a plan for it 
Products


string
(query)
Available values : Customer, Employee

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
Barcode
string
CustomerPrice
number($double)
EmployeePrice
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
    "barcode": "string",
    "customerPrice": 0,
    "employeePrice": 0,
    "imageUrl": "string",
    "isActive": true,
    "createdAt": "2026-11-11T21:25:07.548Z"
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
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjE2OTYyZDgwLTk5NWUtNDA2OC04NGQxLTdkMjJjYmM0ZDgwYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ0MzAyMTQsImV4cCI6MTc5NDQzMzgxNCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.fPxLvwdU7XxkNhRvRrwrN2apk8AntT4CiA38hIjotxI'
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
      "name": "كولا",
      "barcode": "TEMP_PRODUCT_1",
      "customerPrice": 0,
      "employeePrice": 15,
      "imageUrl": null,
      "isActive": true,
      "createdAt": "2026-11-01T21:11:45.8543097"
    },
    {
      "id": 2,
      "productCategoryId": 2,
      "productCategoryName": "coffe",
      "name": "قهوة ساده",
      "barcode": "TEMP_PRODUCT_2",
      "customerPrice": 0,
      "employeePrice": 15,
      "imageUrl": null,
      "isActive": true,
      "createdAt": "2026-11-05T20:37:45.7536629"
    },
    {
      "id": 3,
      "productCategoryId": 1,
      "productCategoryName": "عصائر",
      "name": "عصير مانجو",
      "barcode": "TEMP_PRODUCT_3",
      "customerPrice": 15,
      "employeePrice": 10,
      "imageUrl": null,
      "isActive": true,
      "createdAt": "2026-11-11T10:20:35.7876073"
    },
    {
      "id": 4,
      "productCategoryId": 1,
      "productCategoryName": "عصائر",
      "name": "عصير جوافه",
      "barcode": "TEMP_PRODUCT_4",
      "customerPrice": 20,
      "employeePrice": 15,
      "imageUrl": null,
      "isActive": true,
      "createdAt": "2026-11-11T11:06:16.3587867"
    }
  ],
  "page": 1,
  "pageSize": 10,
  "totalCount": 4
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,11 Nov 2026 21:24:43 GMT 
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
      "barcode": "string",
      "customerPrice": 0,
      "employeePrice": 0,
      "imageUrl": "string",
      "isActive": true,
      "createdAt": "2026-11-11T21:25:07.551Z"
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
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjE2OTYyZDgwLTk5NWUtNDA2OC04NGQxLTdkMjJjYmM0ZDgwYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ0MzAyMTQsImV4cCI6MTc5NDQzMzgxNCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.fPxLvwdU7XxkNhRvRrwrN2apk8AntT4CiA38hIjotxI'
Request URL
https://swimming1academy.runasp.net/api/products/2
Server response
Code	Details
200	
Response body
Download
{
  "id": 2,
  "productCategoryId": 2,
  "productCategoryName": "coffe",
  "name": "قهوة ساده",
  "barcode": "TEMP_PRODUCT_2",
  "customerPrice": 0,
  "employeePrice": 15,
  "imageUrl": null,
  "isActive": true,
  "createdAt": "2026-11-05T20:37:45.7536629"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,11 Nov 2026 21:24:06 GMT 
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
  "barcode": "string",
  "customerPrice": 0,
  "employeePrice": 0,
  "imageUrl": "string",
  "isActive": true,
  "createdAt": "2026-11-11T21:25:07.553Z"
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

multipart/form-data
ProductCategoryId
integer($int32)
Name
string
Barcode
string
CustomerPrice
number($double)
EmployeePrice
number($double)
ImageFile
string($binary)
RemoveImage
boolean
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
    "barcode": "string",
    "customerPrice": 0,
    "employeePrice": 0,
    "imageUrl": "string",
    "isActive": true,
    "createdAt": "2026-11-11T21:25:07.554Z"
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

GET
/api/products/by-barcode/{barcode}


Parameters
Cancel
Name	Description
barcode *
string
(path)
TEMP_PRODUCT_2
saleType
string
(query)

Customer
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/products/by-barcode/TEMP_PRODUCT_2?saleType=Customer' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjE2OTYyZDgwLTk5NWUtNDA2OC04NGQxLTdkMjJjYmM0ZDgwYSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ0MzAyMTQsImV4cCI6MTc5NDQzMzgxNCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.fPxLvwdU7XxkNhRvRrwrN2apk8AntT4CiA38hIjotxI'
Request URL
https://swimming1academy.runasp.net/api/products/by-barcode/TEMP_PRODUCT_2?saleType=Customer
Server response
Code	Details
200	
Response body
Download
{
  "productId": 2,
  "name": "قهوة ساده",
  "barcode": "TEMP_PRODUCT_2",
  "unitPrice": 0,
  "saleType": "Customer"
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Wed,11 Nov 2026 21:24:37 GMT 
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
  "productId": 0,
  "name": "string",
  "barcode": "string",
  "unitPrice": 0,
  "saleType": "string"
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