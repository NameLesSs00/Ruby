EmployeeSales


POST
/api/employee-sales


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "employeeId": 0,
  "items": [
    {
      "productId": 0,
      "quantity": 0
    }
  ],
  "amountPaid": 0,
  "payments": [
    {
      "paymentMethod": "Cash",
      "amount": 0
    }
  ],
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
    "invoiceNumber": "string",
    "saleDate": "2026-11-14T10:41:19.203Z",
    "saleType": "Customer",
    "employeeId": 0,
    "employeeName": "string",
    "totalAmount": 0,
    "discountAmount": 0,
    "finalAmount": 0,
    "status": "NotReturned",
    "notes": "string",
    "items": [
      {
        "id": 0,
        "productId": 0,
        "productName": "string",
        "quantity": 0,
        "unitPrice": 0,
        "totalPrice": 0
      }
    ]
  }
}
No links

GET
/api/employee-sales


Parameters
Cancel
Name	Description
FromDate
string($date)
(query)
FromDate
ToDate
string($date)
(query)
ToDate
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
  'https://swimming1academy.runasp.net/api/employee-sales' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjkxNTRkNDU1LWJhYjUtNDFiZi1iNDA1LWVlY2JiMDlmYzg2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTA5NDcsImV4cCI6MTc5NDY1NDU0NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.4yzaRgOK0b5-4obHhRJ0x4dcFJQVEiareG7xdQcUgk0'
Request URL
https://swimming1academy.runasp.net/api/employee-sales
Server response
Code	Details
200	
Response body
Download
{
  "items": [
    {
      "id": 9,
      "invoiceNumber": "INV-000009",
      "saleDate": "2026-11-11T11:00:04.2043416",
      "saleType": "Employee",
      "employeeId": 1,
      "employeeName": "test",
      "totalAmount": 30,
      "discountAmount": null,
      "finalAmount": 30,
      "status": "NotReturned",
      "notes": "string",
      "items": [
        {
          "id": 11,
          "productId": 3,
          "productName": "عصير مانجو",
          "quantity": 3,
          "unitPrice": 10,
          "totalPrice": 30
        }
      ]
    }
  ],
  "totalCount": 1,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 10:40:29 GMT 
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
      "invoiceNumber": "string",
      "saleDate": "2026-11-14T10:41:19.168Z",
      "saleType": "Customer",
      "employeeId": 0,
      "employeeName": "string",
      "totalAmount": 0,
      "discountAmount": 0,
      "finalAmount": 0,
      "status": "NotReturned",
      "notes": "string",
      "items": [
        {
          "id": 0,
          "productId": 0,
          "productName": "string",
          "quantity": 0,
          "unitPrice": 0,
          "totalPrice": 0
        }
      ]
    }
  ],
  "totalCount": 0,
  "page": 0,
  "pageSize": 0,
  "totalPages": 0
}
No links

GET
/api/employee-sales/{id}


Parameters
Cancel
Name	Description
id *
integer($int32)
(path)
9
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/employee-sales/9' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6IjkxNTRkNDU1LWJhYjUtNDFiZi1iNDA1LWVlY2JiMDlmYzg2MCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2NTA5NDcsImV4cCI6MTc5NDY1NDU0NywiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.4yzaRgOK0b5-4obHhRJ0x4dcFJQVEiareG7xdQcUgk0'
Request URL
https://swimming1academy.runasp.net/api/employee-sales/9
Server response
Code	Details
200	
Response body
Download
{
  "id": 9,
  "invoiceNumber": "INV-000009",
  "saleDate": "2026-11-11T11:00:04.2043416",
  "saleType": "Employee",
  "employeeId": 1,
  "employeeName": "test",
  "totalAmount": 30,
  "discountAmount": null,
  "finalAmount": 30,
  "status": "NotReturned",
  "notes": "string",
  "items": [
    {
      "id": 11,
      "productId": 3,
      "productName": "عصير مانجو",
      "quantity": 3,
      "unitPrice": 10,
      "totalPrice": 30
    }
  ]
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 10:40:49 GMT 
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