GET
/api/reports/cashboxes


Parameters
Try it out
Name	Description
FromDate
string($date)
(query)
2026/11/01
ToDate
string($date)
(query)
2026/12/01
CashboxType
string
(query)
Available values : POS, Subscriptions, Main


--
TransactionType
string
(query)
Available values : Income, Expense


--
ReferenceType
string
(query)
Available values : Subscription, Sale, Payroll, Expense, SubscriptionCancellation, SaleReturn, OtherIncome, DuePaymentCollection, CoachPayment, PurchaseInvoicePayment, CashTransfer, OwnerTransaction


--
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize


Reports


GET
/api/reports/income


Parameters
Cancel
Name	Description
FromDate
string($date)
(query)
2026/11/01
ToDate
string($date)
(query)
2026/12/01
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/reports/income?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3YTI3MThhLTg5ZjctNGNlYS1iNzlmLWRkZTEyOTUyOGU2NSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2Nzg4NTgsImV4cCI6MTc5NDY4MjQ1OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ODI6LUqMCDhpLGTqhZX5aOXmyOL52dfJglMaARFTAyE'
Request URL
https://swimming1academy.runasp.net/api/reports/income?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01
Server response
Code	Details
200	
Response body
Download
{
  "summary": {
    "totalIncome": 28586,
    "totalTransactions": 58
  },
  "sources": {
    "subscriptionPayments": 16450,
    "productSales": 715,
    "otherIncome": 6651,
    "ownerDeposits": 4000,
    "externalEntityCollections": 770
  },
  "transactions": [
    {
      "transactionId": 110,
      "transactionDate": "2026-11-14T11:10:36.0481492",
      "description": "Initial payment for sale invoice INV-000016",
      "referenceType": "Sale",
      "referenceTypeName": "Sale",
      "referenceId": 16,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 10,
      "paymentMethod": "Cash",
      "paymentMethodName": "Cash",
      "category": "ProductSales",
      "categoryName": "مبيعات المنتجات",
      "clientName": null,
      "employeeName": "test",
      "invoiceNumber": "INV-000016",
      "payerName": null
    },
    {
      "transactionId": 109,
      "transactionDate": "2026-11-14T11:10:36.0481492",
      "description": "Initial payment for sale invoice INV-000016",
      "referenceType": "Sale",
      "referenceTypeName": "Sale",
      "referenceId": 16,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 15,
      "paymentMethod": "Visa",
      "paymentMethodName": "Visa",
      "category": "ProductSales",
      "categoryName": "مبيعات المنتجات",
      "clientName": null,
      "employeeName": "test",
      "invoiceNumber": "INV-000016",
      "payerName": null
    },
    {
      "transactionId": 105,
      "transactionDate": "2026-11-13T17:59:49.8858011",
      "description": "Initial payment for sale invoice INV-000015",
      "referenceType": "Sale",
      "referenceTypeName": "Sale",
      "referenceId": 15,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 50,
      "paymentMethod": "Cash",
      "paymentMethodName": "Cash",
      "category": "ProductSales",
      "categoryName": "مبيعات المنتجات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "INV-000015",
      "payerName": null
    },
    {
      "transactionId": 103,
      "transactionDate": "2026-11-13T15:50:21.5119822",
      "description": "Initial payment for sale invoice INV-000014",
      "referenceType": "Sale",
      "referenceTypeName": "Sale",
      "referenceId": 14,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 45,
      "paymentMethod": "Cash",
      "paymentMethodName": "Cash",
      "category": "ProductSales",
      "categoryName": "مبيعات المنتجات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "INV-000014",
      "payerName": null
    },
    {
      "transactionId": 101,
      "transactionDate": "2026-11-13T15:38:05.1141402",
      "description": "Initial payment for sale invoice INV-000013",
      "referenceType": "Sale",
      "referenceTypeName": "Sale",
      "referenceId": 13,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 45,
      "paymentMethod": "Cash",
      "paymentMethodName": "Cash",
      "category": "ProductSales",
      "categoryName": "مبيعات المنتجات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "INV-000013",
      "payerName": null
    },
    {
      "transactionId": 96,
      "transactionDate": "2026-11-13T14:25:40.5727583",
      "description": "Payment for due payment #22 - اسم الجهة المستأجرة",
      "referenceType": "DuePaymentCollection",
      "referenceTypeName": "DuePaymentCollection",
      "referenceId": 18,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "amount": 700,
      "paymentMethod": "Cash",
      "paymentMethodName": "Cash",
      "category": "ExternalEntityCollections",
      "categoryName": "تحصيل مديونيات جهات خارجية",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": "اسم الجهة المستأجرة"
    },
    {
      "transactionId": 95,
      "transactionDate": "2026-11-13T14:05:21.7679661",
      "description": "POS sale payment collection for due payment #21 - حمو",
      "referenceType": "DuePaymentCollection",
      "referenceTypeName": "DuePaymentCollection",
      "referenceId": 17,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 35,
      "paymentMethod": "Cash",
      "paymentMethodName": "Cash",
      "category": "ProductSales",
      "categoryName": "مبيعات المنتجات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "INV-000012",
      "payerName": "حمو"
    },
    {
      "transactionId": 97,
      "transactionDate": "2026-11-13T14:00:35.307",
      "description": "محمد النجار",
      "referenceType": "OtherIncome",
      "referenceTypeName": "OtherIncome",
      "referenceId": 6,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "amount": 5000,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "OtherIncome",
      "categoryName": "إيرادات أخرى",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 94,
      "transactionDate": "2026-11-13T14:00:35.307",
      "description": "Other income test",
      "referenceType": "OtherIncome",
      "referenceTypeName": "OtherIncome",
      "referenceId": 5,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "amount": 500,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "OtherIncome",
      "categoryName": "إيرادات أخرى",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 93,
      "transactionDate": "2026-11-13T13:57:54.1352265",
      "description": "Initial payment for sale invoice INV-000012",
      "referenceType": "Sale",
      "referenceTypeName": "Sale",
      "referenceId": 12,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 40,
      "paymentMethod": "Cash",
      "paymentMethodName": "Cash",
      "category": "ProductSales",
      "categoryName": "مبيعات المنتجات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "INV-000012",
      "payerName": null
    },
    {
      "transactionId": 92,
      "transactionDate": "2026-11-13T13:51:43.1418554",
      "description": "Initial payment for subscription #13 - Mohamed",
      "referenceType": "Subscription",
      "referenceTypeName": "Subscription",
      "referenceId": 13,
      "cashboxType": "Subscriptions",
      "cashboxName": "Subscriptions",
      "amount": 1000,
      "paymentMethod": "Cash",
      "paymentMethodName": "Cash",
      "category": "SubscriptionPayments",
      "categoryName": "اشتراكات",
      "clientName": "Mohamed",
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 91,
      "transactionDate": "2026-11-13T13:15:13.2415245",
      "description": "Owner deposit #9 into POS.",
      "referenceType": "OwnerTransaction",
      "referenceTypeName": "OwnerTransaction",
      "referenceId": 9,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 1000,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "OwnerDeposits",
      "categoryName": "إيداعات المالك",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 82,
      "transactionDate": "2026-11-11T20:52:00",
      "description": "test",
      "referenceType": "OtherIncome",
      "referenceTypeName": "OtherIncome",
      "referenceId": 4,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "amount": 1,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "OtherIncome",
      "categoryName": "إيرادات أخرى",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 80,
      "transactionDate": "2026-11-11T11:40:27.5003327",
      "description": "Owner deposit #7 into POS.",
      "referenceType": "OwnerTransaction",
      "referenceTypeName": "OwnerTransaction",
      "referenceId": 7,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 500,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "OwnerDeposits",
      "categoryName": "إيداعات المالك",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 79,
      "transactionDate": "2026-11-11T11:36:52.8649025",
      "description": "Owner deposit #6 into POS.",
      "referenceType": "OwnerTransaction",
      "referenceTypeName": "OwnerTransaction",
      "referenceId": 6,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 500,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "OwnerDeposits",
      "categoryName": "إيداعات المالك",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 78,
      "transactionDate": "2026-11-11T11:17:10.5852653",
      "description": "POS sale payment collection for due payment #20 - string",
      "referenceType": "DuePaymentCollection",
      "referenceTypeName": "DuePaymentCollection",
      "referenceId": 16,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 30,
      "paymentMethod": "Visa",
      "paymentMethodName": "Visa",
      "category": "ProductSales",
      "categoryName": "مبيعات المنتجات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "INV-000011",
      "payerName": "string"
    },
    {
      "transactionId": 77,
      "transactionDate": "2026-11-11T11:07:08.3057204",
      "description": "Initial payment for sale invoice INV-000011",
      "referenceType": "Sale",
      "referenceTypeName": "Sale",
      "referenceId": 11,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 30,
      "paymentMethod": "Cash",
      "paymentMethodName": "Cash",
      "category": "ProductSales",
      "categoryName": "مبيعات المنتجات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "INV-000011",
      "payerName": null
    },
    {
      "transactionId": 76,
      "transactionDate": "2026-11-11T11:04:32.1824355",
      "description": "Initial payment for sale invoice INV-000010",
      "referenceType": "Sale",
      "referenceTypeName": "Sale",
      "referenceId": 10,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 30,
      "paymentMethod": "Cash",
      "paymentMethodName": "Cash",
      "category": "ProductSales",
      "categoryName": "مبيعات المنتجات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "INV-000010",
      "payerName": null
    },
    {
      "transactionId": 75,
      "transactionDate": "2026-11-11T11:00:04.3397765",
      "description": "Initial payment for sale invoice INV-000009",
      "referenceType": "Sale",
      "referenceTypeName": "Sale",
      "referenceId": 9,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 30,
      "paymentMethod": "Cash",
      "paymentMethodName": "Cash",
      "category": "ProductSales",
      "categoryName": "مبيعات المنتجات",
      "clientName": null,
      "employeeName": "test",
      "invoiceNumber": "INV-000009",
      "payerName": null
    },
    {
      "transactionId": 74,
      "transactionDate": "2026-11-10T18:51:13.7430767",
      "description": "Payment for due payment #14 - احمد",
      "referenceType": "DuePaymentCollection",
      "referenceTypeName": "DuePaymentCollection",
      "referenceId": 15,
      "cashboxType": "Subscriptions",
      "cashboxName": "Subscriptions",
      "amount": 1000,
      "paymentMethod": "VodafoneCash",
      "paymentMethodName": "VodafoneCash",
      "category": "SubscriptionPayments",
      "categoryName": "اشتراكات",
      "clientName": "احمد",
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": "احمد"
    }
  ],
  "pageNumber": 1,
  "pageSize": 20,
  "totalRecords": 58,
  "totalPages": 3
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 17:55:15 GMT 
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
  "summary": {
    "totalIncome": 0,
    "totalTransactions": 0
  },
  "sources": {
    "subscriptionPayments": 0,
    "productSales": 0,
    "otherIncome": 0,
    "ownerDeposits": 0,
    "externalEntityCollections": 0
  },
  "transactions": [
    {
      "transactionId": 0,
      "transactionDate": "2026-11-14T17:58:38.327Z",
      "description": "string",
      "referenceType": "Subscription",
      "referenceTypeName": "string",
      "referenceId": 0,
      "cashboxType": "POS",
      "cashboxName": "string",
      "amount": 0,
      "paymentMethod": "Cash",
      "paymentMethodName": "string",
      "category": "string",
      "categoryName": "string",
      "clientName": "string",
      "employeeName": "string",
      "invoiceNumber": "string",
      "payerName": "string"
    }
  ],
  "pageNumber": 0,
  "pageSize": 0,
  "totalRecords": 0,
  "totalPages": 0
}
No links

GET
/api/reports/income/pdf


Parameters
Cancel
Name	Description
FromDate
string($date)
(query)
2026/11/01
ToDate
string($date)
(query)
2026/12/01
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/reports/income/pdf?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01' \
  -H 'accept: application/pdf' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3YTI3MThhLTg5ZjctNGNlYS1iNzlmLWRkZTEyOTUyOGU2NSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2Nzg4NTgsImV4cCI6MTc5NDY4MjQ1OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ODI6LUqMCDhpLGTqhZX5aOXmyOL52dfJglMaARFTAyE'
Request URL
https://swimming1academy.runasp.net/api/reports/income/pdf?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01
Server response
Code	Details
200	
Response body
Download file
Response headers
 content-disposition: attachment; filename=IncomeReport_2026-11-01_2026-12-01.pdf; filename*=UTF-8''IncomeReport_2026-11-01_2026-12-01.pdf 
 content-length: 99635 
 content-type: application/pdf 
 date: Sat,14 Nov 2026 17:55:39 GMT 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

application/pdf
Controls Accept header.
Example Value
Schema
string
No links

GET
/api/reports/income/excel


Parameters
Cancel
Name	Description
FromDate
string($date)
(query)
2026/11/01
ToDate
string($date)
(query)
2026/12/01
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/reports/income/excel?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01' \
  -H 'accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3YTI3MThhLTg5ZjctNGNlYS1iNzlmLWRkZTEyOTUyOGU2NSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2Nzg4NTgsImV4cCI6MTc5NDY4MjQ1OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ODI6LUqMCDhpLGTqhZX5aOXmyOL52dfJglMaARFTAyE'
Request URL
https://swimming1academy.runasp.net/api/reports/income/excel?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01
Server response
Code	Details
200	
Response body
Download file
Response headers
 content-disposition: attachment; filename=IncomeReport_2026-11-01_2026-12-01.xlsx; filename*=UTF-8''IncomeReport_2026-11-01_2026-12-01.xlsx 
 content-length: 13243 
 content-type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet 
 date: Sat,14 Nov 2026 17:56:06 GMT 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Controls Accept header.
Example Value
Schema
<?xml version="1.0" encoding="UTF-8"?>
<!-- XML example cannot be generated; root element name is undefined -->
No links

GET
/api/reports/expenses


Parameters
Cancel
Name	Description
FromDate
string($date)
(query)
2026/11/01
ToDate
string($date)
(query)
2026/12/01
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/reports/expenses?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3YTI3MThhLTg5ZjctNGNlYS1iNzlmLWRkZTEyOTUyOGU2NSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2Nzg4NTgsImV4cCI6MTc5NDY4MjQ1OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ODI6LUqMCDhpLGTqhZX5aOXmyOL52dfJglMaARFTAyE'
Request URL
https://swimming1academy.runasp.net/api/reports/expenses?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01
Server response
Code	Details
200	
Response body
Download
{
  "summary": {
    "totalExpenses": 8094,
    "totalTransactions": 32
  },
  "sources": {
    "academyExpenses": 1202,
    "saleReturns": 165,
    "subscriptionCancellations": 2000,
    "purchasePayments": 2850,
    "payrollPayments": 0,
    "coachPayments": 195,
    "ownerWithdrawals": 1682,
    "otherExpenses": 0
  },
  "transactions": [
    {
      "transactionId": 108,
      "transactionDate": "2026-11-14T10:28:12.148021",
      "description": "Coach payment for coach #1 - pola",
      "referenceType": "CoachPayment",
      "referenceTypeName": "CoachPayment",
      "referenceId": 4,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "amount": 100,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "CoachPayments",
      "categoryName": "مدفوعات المدربين",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 107,
      "transactionDate": "2026-11-14T10:27:41.7477622",
      "description": "Coach payment for coach #1 - pola",
      "referenceType": "CoachPayment",
      "referenceTypeName": "CoachPayment",
      "referenceId": 3,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "amount": 10,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "CoachPayments",
      "categoryName": "مدفوعات المدربين",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 106,
      "transactionDate": "2026-11-13T18:05:05.6464296",
      "description": "Refund for sale return - Invoice: INV-000015",
      "referenceType": "SaleReturn",
      "referenceTypeName": "SaleReturn",
      "referenceId": 7,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 5,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "SaleReturns",
      "categoryName": "مرتجعات المبيعات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "INV-000015",
      "payerName": null
    },
    {
      "transactionId": 104,
      "transactionDate": "2026-11-13T15:56:42.4977145",
      "description": "Refund for sale return - Invoice: INV-000014",
      "referenceType": "SaleReturn",
      "referenceTypeName": "SaleReturn",
      "referenceId": 6,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 45,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "SaleReturns",
      "categoryName": "مرتجعات المبيعات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "INV-000014",
      "payerName": null
    },
    {
      "transactionId": 102,
      "transactionDate": "2026-11-13T15:42:03.8933637",
      "description": "Refund for sale return - Invoice: INV-000013",
      "referenceType": "SaleReturn",
      "referenceTypeName": "SaleReturn",
      "referenceId": 5,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 45,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "SaleReturns",
      "categoryName": "مرتجعات المبيعات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "INV-000013",
      "payerName": null
    },
    {
      "transactionId": 100,
      "transactionDate": "2026-11-13T15:33:34.2340819",
      "description": "Owner withdrawal #11 from Main.",
      "referenceType": "OwnerTransaction",
      "referenceTypeName": "OwnerTransaction",
      "referenceId": 11,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "amount": 400,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "OwnerWithdrawals",
      "categoryName": "سحوبات المالك",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 99,
      "transactionDate": "2026-11-13T15:31:58.6534344",
      "description": "Owner withdrawal #10 from Main.",
      "referenceType": "OwnerTransaction",
      "referenceTypeName": "OwnerTransaction",
      "referenceId": 10,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "amount": 500,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "OwnerWithdrawals",
      "categoryName": "سحوبات المالك",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 98,
      "transactionDate": "2026-11-13T15:27:34.231",
      "description": "Electricity expense test",
      "referenceType": "Expense",
      "referenceTypeName": "Expense",
      "referenceId": 10,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "amount": 200,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "AcademyExpenses",
      "categoryName": "مصروفات الأكاديمية",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 88,
      "transactionDate": "2026-11-11T21:46:00.9888297",
      "description": "Owner withdrawal #8 from POS.",
      "referenceType": "OwnerTransaction",
      "referenceTypeName": "OwnerTransaction",
      "referenceId": 8,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 2,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "OwnerWithdrawals",
      "categoryName": "سحوبات المالك",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 83,
      "transactionDate": "2026-11-11T21:46:00",
      "description": "2",
      "referenceType": "Expense",
      "referenceTypeName": "Expense",
      "referenceId": 9,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "amount": 2,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "AcademyExpenses",
      "categoryName": "مصروفات الأكاديمية",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 81,
      "transactionDate": "2026-11-11T20:51:00",
      "description": "test",
      "referenceType": "Expense",
      "referenceTypeName": "Expense",
      "referenceId": 8,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "amount": 250,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "AcademyExpenses",
      "categoryName": "مصروفات الأكاديمية",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 66,
      "transactionDate": "2026-11-05T20:38:46.82381",
      "description": "Refund for sale return - Invoice: INV-000005",
      "referenceType": "SaleReturn",
      "referenceTypeName": "SaleReturn",
      "referenceId": 4,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 15,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "SaleReturns",
      "categoryName": "مرتجعات المبيعات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "INV-000005",
      "payerName": null
    },
    {
      "transactionId": 64,
      "transactionDate": "2026-11-05T20:38:00",
      "description": "Purchase invoice payment #5 for invoice INV-038158.",
      "referenceType": "PurchaseInvoicePayment",
      "referenceTypeName": "PurchaseInvoicePayment",
      "referenceId": 5,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "amount": 500,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "PurchasePayments",
      "categoryName": "مدفوعات المشتريات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "INV-038158",
      "payerName": null
    },
    {
      "transactionId": 57,
      "transactionDate": "2026-11-05T20:18:41.786836",
      "description": "Coach payment for coach #1 - pola",
      "referenceType": "CoachPayment",
      "referenceTypeName": "CoachPayment",
      "referenceId": 2,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "amount": 75,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "CoachPayments",
      "categoryName": "مدفوعات المدربين",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 53,
      "transactionDate": "2026-11-04T23:44:48.405",
      "description": "Purchase invoice payment #4 for invoice string.",
      "referenceType": "PurchaseInvoicePayment",
      "referenceTypeName": "PurchaseInvoicePayment",
      "referenceId": 4,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "amount": 1200,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "PurchasePayments",
      "categoryName": "مدفوعات المشتريات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "string",
      "payerName": null
    },
    {
      "transactionId": 52,
      "transactionDate": "2026-11-04T23:08:54.696629",
      "description": "Refund for sale return - Invoice: INV-000004",
      "referenceType": "SaleReturn",
      "referenceTypeName": "SaleReturn",
      "referenceId": 3,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 15,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "SaleReturns",
      "categoryName": "مرتجعات المبيعات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "INV-000004",
      "payerName": null
    },
    {
      "transactionId": 46,
      "transactionDate": "2026-11-04T22:29:58.7899658",
      "description": "Refund for sale return - Invoice: INV-000001",
      "referenceType": "SaleReturn",
      "referenceTypeName": "SaleReturn",
      "referenceId": 2,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 40,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "SaleReturns",
      "categoryName": "مرتجعات المبيعات",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": "INV-000001",
      "payerName": null
    },
    {
      "transactionId": 44,
      "transactionDate": "2026-11-04T22:18:52.1973874",
      "description": "Owner withdrawal #3 from Subscriptions.",
      "referenceType": "OwnerTransaction",
      "referenceTypeName": "OwnerTransaction",
      "referenceId": 3,
      "cashboxType": "Subscriptions",
      "cashboxName": "Subscriptions",
      "amount": 600,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "OwnerWithdrawals",
      "categoryName": "سحوبات المالك",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 43,
      "transactionDate": "2026-11-04T22:17:59.9243075",
      "description": "Owner withdrawal #2 from POS.",
      "referenceType": "OwnerTransaction",
      "referenceTypeName": "OwnerTransaction",
      "referenceId": 2,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 80,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "OwnerWithdrawals",
      "categoryName": "سحوبات المالك",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    },
    {
      "transactionId": 42,
      "transactionDate": "2026-11-04T22:15:35.7508132",
      "description": "Owner withdrawal #1 from POS.",
      "referenceType": "OwnerTransaction",
      "referenceTypeName": "OwnerTransaction",
      "referenceId": 1,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "amount": 100,
      "paymentMethod": null,
      "paymentMethodName": null,
      "category": "OwnerWithdrawals",
      "categoryName": "سحوبات المالك",
      "clientName": null,
      "employeeName": null,
      "invoiceNumber": null,
      "payerName": null
    }
  ],
  "pageNumber": 1,
  "pageSize": 20,
  "totalRecords": 32,
  "totalPages": 2
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 17:56:23 GMT 
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
  "summary": {
    "totalExpenses": 0,
    "totalTransactions": 0
  },
  "sources": {
    "academyExpenses": 0,
    "saleReturns": 0,
    "subscriptionCancellations": 0,
    "purchasePayments": 0,
    "payrollPayments": 0,
    "coachPayments": 0,
    "ownerWithdrawals": 0,
    "otherExpenses": 0
  },
  "transactions": [
    {
      "transactionId": 0,
      "transactionDate": "2026-11-14T17:58:38.344Z",
      "description": "string",
      "referenceType": "Subscription",
      "referenceTypeName": "string",
      "referenceId": 0,
      "cashboxType": "POS",
      "cashboxName": "string",
      "amount": 0,
      "paymentMethod": "Cash",
      "paymentMethodName": "string",
      "category": "string",
      "categoryName": "string",
      "clientName": "string",
      "employeeName": "string",
      "invoiceNumber": "string",
      "payerName": "string"
    }
  ],
  "pageNumber": 0,
  "pageSize": 0,
  "totalRecords": 0,
  "totalPages": 0
}
No links

GET
/api/reports/expenses/pdf


Parameters
Cancel
Name	Description
FromDate
string($date)
(query)
2026/11/01
ToDate
string($date)
(query)
2026/12/01
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/reports/expenses/pdf?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01' \
  -H 'accept: application/pdf' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3YTI3MThhLTg5ZjctNGNlYS1iNzlmLWRkZTEyOTUyOGU2NSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2Nzg4NTgsImV4cCI6MTc5NDY4MjQ1OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ODI6LUqMCDhpLGTqhZX5aOXmyOL52dfJglMaARFTAyE'
Request URL
https://swimming1academy.runasp.net/api/reports/expenses/pdf?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01
Server response
Code	Details
200	
Response body
Download file
Response headers
 content-disposition: attachment; filename=ExpenseReport_2026-11-01_2026-12-01.pdf; filename*=UTF-8''ExpenseReport_2026-11-01_2026-12-01.pdf 
 content-length: 90874 
 content-type: application/pdf 
 date: Sat,14 Nov 2026 17:56:34 GMT 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

application/pdf
Controls Accept header.
Example Value
Schema
string
No links

GET
/api/reports/expenses/excel


Parameters
Cancel
Name	Description
FromDate
string($date)
(query)
2026/11/01
ToDate
string($date)
(query)
2026/12/01
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/reports/expenses/excel?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01' \
  -H 'accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3YTI3MThhLTg5ZjctNGNlYS1iNzlmLWRkZTEyOTUyOGU2NSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2Nzg4NTgsImV4cCI6MTc5NDY4MjQ1OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ODI6LUqMCDhpLGTqhZX5aOXmyOL52dfJglMaARFTAyE'
Request URL
https://swimming1academy.runasp.net/api/reports/expenses/excel?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01
Server response
Code	Details
200	
Response body
Download file
Response headers
 content-disposition: attachment; filename=ExpenseReport_2026-11-01_2026-12-01.xlsx; filename*=UTF-8''ExpenseReport_2026-11-01_2026-12-01.xlsx 
 content-length: 11338 
 content-type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet 
 date: Sat,14 Nov 2026 17:56:44 GMT 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Controls Accept header.
Example Value
Schema
<?xml version="1.0" encoding="UTF-8"?>
<!-- XML example cannot be generated; root element name is undefined -->
No links

GET
/api/reports/warehouse


Parameters
Cancel
Name	Description
FromDate
string($date)
(query)
2026/11/01
ToDate
string($date)
(query)
2026/12/01
ProductId
integer($int32)
(query)
ProductId
TransactionType
string
(query)

--
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/reports/warehouse?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3YTI3MThhLTg5ZjctNGNlYS1iNzlmLWRkZTEyOTUyOGU2NSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2Nzg4NTgsImV4cCI6MTc5NDY4MjQ1OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ODI6LUqMCDhpLGTqhZX5aOXmyOL52dfJglMaARFTAyE'
Request URL
https://swimming1academy.runasp.net/api/reports/warehouse?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01
Server response
Code	Details
200	
Response body
Download
{
  "summary": {
    "totalProducts": 3,
    "totalCurrentStock": 48,
    "totalIncoming": 70,
    "totalOutgoing": 22,
    "netMovement": 48,
    "openingStock": 0,
    "closingStock": 48
  },
  "products": [
    {
      "productId": 1,
      "productName": "سكر تحليه",
      "totalIncoming": 45,
      "totalOutgoing": 12,
      "netMovement": 33,
      "currentStock": 33
    },
    {
      "productId": 2,
      "productName": "عصير جوهينا تفاح",
      "totalIncoming": 20,
      "totalOutgoing": 10,
      "netMovement": 10,
      "currentStock": 10
    },
    {
      "productId": 3,
      "productName": "كلور",
      "totalIncoming": 5,
      "totalOutgoing": 0,
      "netMovement": 5,
      "currentStock": 5
    }
  ],
  "transactions": [
    {
      "transactionId": 10,
      "productId": 1,
      "productName": "سكر تحليه",
      "transactionType": "Out",
      "transactionTypeName": "Out",
      "quantity": 7,
      "transactionDate": "2026-11-14T11:20:49.3783164",
      "movementGroupId": 7,
      "description": "test report"
    },
    {
      "transactionId": 9,
      "productId": 1,
      "productName": "سكر تحليه",
      "transactionType": "In",
      "transactionTypeName": "In",
      "quantity": 15,
      "transactionDate": "2026-11-14T11:16:29.494166",
      "movementGroupId": 6,
      "description": "test report"
    },
    {
      "transactionId": 8,
      "productId": 1,
      "productName": "سكر تحليه",
      "transactionType": "In",
      "transactionTypeName": "In",
      "quantity": 10,
      "transactionDate": "2026-11-05T20:36:31.7197996",
      "movementGroupId": 5,
      "description": "t"
    },
    {
      "transactionId": 7,
      "productId": 3,
      "productName": "كلور",
      "transactionType": "In",
      "transactionTypeName": "In",
      "quantity": 5,
      "transactionDate": "2026-11-05T20:36:31.7197996",
      "movementGroupId": 5,
      "description": "t"
    },
    {
      "transactionId": 6,
      "productId": 2,
      "productName": "عصير جوهينا تفاح",
      "transactionType": "Out",
      "transactionTypeName": "Out",
      "quantity": 5,
      "transactionDate": "2026-11-05T20:33:48.4967694",
      "movementGroupId": 4,
      "description": "test"
    },
    {
      "transactionId": 5,
      "productId": 2,
      "productName": "عصير جوهينا تفاح",
      "transactionType": "Out",
      "transactionTypeName": "Out",
      "quantity": 5,
      "transactionDate": "2026-11-04T21:41:55.6388241",
      "movementGroupId": 3,
      "description": "تحويل عصير و سكر للمحل"
    },
    {
      "transactionId": 4,
      "productId": 1,
      "productName": "سكر تحليه",
      "transactionType": "Out",
      "transactionTypeName": "Out",
      "quantity": 5,
      "transactionDate": "2026-11-04T21:41:55.6388241",
      "movementGroupId": 3,
      "description": "تحويل عصير و سكر للمحل"
    },
    {
      "transactionId": 3,
      "productId": 1,
      "productName": "سكر تحليه",
      "transactionType": "In",
      "transactionTypeName": "In",
      "quantity": 10,
      "transactionDate": "2026-11-04T21:40:25.7689465",
      "movementGroupId": 2,
      "description": "فاتورة عصير و سكر"
    },
    {
      "transactionId": 2,
      "productId": 2,
      "productName": "عصير جوهينا تفاح",
      "transactionType": "In",
      "transactionTypeName": "In",
      "quantity": 20,
      "transactionDate": "2026-11-04T21:40:25.7689465",
      "movementGroupId": 2,
      "description": "فاتورة عصير و سكر"
    },
    {
      "transactionId": 1,
      "productId": 1,
      "productName": "سكر تحليه",
      "transactionType": "In",
      "transactionTypeName": "In",
      "quantity": 10,
      "transactionDate": "2026-11-04T21:10:39.2007807",
      "movementGroupId": 1,
      "description": "string"
    }
  ],
  "pageNumber": 1,
  "pageSize": 20,
  "totalRecords": 10,
  "totalPages": 1
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 17:57:01 GMT 
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
  "summary": {
    "totalProducts": 0,
    "totalCurrentStock": 0,
    "totalIncoming": 0,
    "totalOutgoing": 0,
    "netMovement": 0,
    "openingStock": 0,
    "closingStock": 0
  },
  "products": [
    {
      "productId": 0,
      "productName": "string",
      "totalIncoming": 0,
      "totalOutgoing": 0,
      "netMovement": 0,
      "currentStock": 0
    }
  ],
  "transactions": [
    {
      "transactionId": 0,
      "productId": 0,
      "productName": "string",
      "transactionType": "In",
      "transactionTypeName": "string",
      "quantity": 0,
      "transactionDate": "2026-11-14T17:58:38.358Z",
      "movementGroupId": 0,
      "description": "string"
    }
  ],
  "pageNumber": 0,
  "pageSize": 0,
  "totalRecords": 0,
  "totalPages": 0
}
No links

GET
/api/reports/warehouse/pdf


Parameters
Cancel
Name	Description
FromDate
string($date)
(query)
2026/11/01
ToDate
string($date)
(query)
2026/12/01
ProductId
integer($int32)
(query)
ProductId
TransactionType
string
(query)

In
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/reports/warehouse/pdf?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01&TransactionType=In' \
  -H 'accept: application/pdf' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3YTI3MThhLTg5ZjctNGNlYS1iNzlmLWRkZTEyOTUyOGU2NSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2Nzg4NTgsImV4cCI6MTc5NDY4MjQ1OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ODI6LUqMCDhpLGTqhZX5aOXmyOL52dfJglMaARFTAyE'
Request URL
https://swimming1academy.runasp.net/api/reports/warehouse/pdf?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01&TransactionType=In
Server response
Code	Details
200	
Response body
Download file
Response headers
 content-disposition: attachment; filename=WarehouseReport_2026-11-01_2026-12-01.pdf; filename*=UTF-8''WarehouseReport_2026-11-01_2026-12-01.pdf 
 content-length: 62214 
 content-type: application/pdf 
 date: Sat,14 Nov 2026 17:57:18 GMT 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

application/pdf
Controls Accept header.
Example Value
Schema
string
No links

GET
/api/reports/warehouse/excel


Parameters
Cancel
Name	Description
FromDate
string($date)
(query)
2026/11/01
ToDate
string($date)
(query)
2026/12/01
ProductId
integer($int32)
(query)
ProductId
TransactionType
string
(query)

Out
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/reports/warehouse/excel?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01&TransactionType=Out' \
  -H 'accept: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3YTI3MThhLTg5ZjctNGNlYS1iNzlmLWRkZTEyOTUyOGU2NSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2Nzg4NTgsImV4cCI6MTc5NDY4MjQ1OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ODI6LUqMCDhpLGTqhZX5aOXmyOL52dfJglMaARFTAyE'
Request URL
https://swimming1academy.runasp.net/api/reports/warehouse/excel?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01&TransactionType=Out
Server response
Code	Details
200	
Response body
Download file
Response headers
 content-disposition: attachment; filename=WarehouseReport_2026-11-01_2026-12-01.xlsx; filename*=UTF-8''WarehouseReport_2026-11-01_2026-12-01.xlsx 
 content-length: 9466 
 content-type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet 
 date: Sat,14 Nov 2026 17:57:32 GMT 
 x-powered-by: ASP.NET 
Responses
Code	Description	Links
200	
OK

Media type

application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Controls Accept header.
Example Value
Schema
<?xml version="1.0" encoding="UTF-8"?>
<!-- XML example cannot be generated; root element name is undefined -->
No links

GET
/api/reports/cashboxes


Parameters
Cancel
Name	Description
FromDate
string($date)
(query)
2026/11/01
ToDate
string($date)
(query)
2026/12/01
CashboxType
string
(query)

--
TransactionType
string
(query)

--
ReferenceType
string
(query)

--
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://swimming1academy.runasp.net/api/reports/cashboxes?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01' \
  -H 'accept: text/plain' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3VwZXJhZG1pbiIsImp0aSI6ImE3YTI3MThhLTg5ZjctNGNlYS1iNzlmLWRkZTEyOTUyOGU2NSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN1cGVyQWRtaW4iLCJuYmYiOjE3OTQ2Nzg4NTgsImV4cCI6MTc5NDY4MjQ1OCwiaXNzIjoiU3dpbW1pbmdBY2FkZW15LkFwaSIsImF1ZCI6IlN3aW1taW5nQWNhZGVteS5DbGllbnQifQ.ODI6LUqMCDhpLGTqhZX5aOXmyOL52dfJglMaARFTAyE'
Request URL
https://swimming1academy.runasp.net/api/reports/cashboxes?FromDate=2026%2F11%2F01&ToDate=2026%2F12%2F01
Server response
Code	Details
200	
Response body
Download
{
  "summary": {
    "totalCashboxes": 3,
    "totalCurrentBalance": 20492,
    "totalIncoming": 35702,
    "totalOutgoing": 15210,
    "netMovement": 20492
  },
  "cashboxes": [
    {
      "cashboxType": "POS",
      "cashboxName": "POS",
      "totalIncome": 6115,
      "totalExpense": 1507,
      "currentBalance": 4608,
      "openingBalance": 0,
      "periodIncoming": 6115,
      "periodOutgoing": 1507,
      "closingBalance": 4608
    },
    {
      "cashboxType": "Subscriptions",
      "cashboxName": "Subscriptions",
      "totalIncome": 16460,
      "totalExpense": 8306,
      "currentBalance": 8154,
      "openingBalance": 0,
      "periodIncoming": 16460,
      "periodOutgoing": 8306,
      "closingBalance": 8154
    },
    {
      "cashboxType": "Main",
      "cashboxName": "Main",
      "totalIncome": 13127,
      "totalExpense": 5397,
      "currentBalance": 7730,
      "openingBalance": 0,
      "periodIncoming": 13127,
      "periodOutgoing": 5397,
      "closingBalance": 7730
    }
  ],
  "transactions": [
    {
      "id": 110,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "transactionType": "Income",
      "transactionTypeName": "Income",
      "referenceType": "Sale",
      "referenceTypeName": "Sale",
      "referenceId": 16,
      "amount": 10,
      "notes": "Initial payment for sale invoice INV-000016",
      "transactionDate": "2026-11-14T11:10:36.0481492"
    },
    {
      "id": 109,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "transactionType": "Income",
      "transactionTypeName": "Income",
      "referenceType": "Sale",
      "referenceTypeName": "Sale",
      "referenceId": 16,
      "amount": 15,
      "notes": "Initial payment for sale invoice INV-000016",
      "transactionDate": "2026-11-14T11:10:36.0481492"
    },
    {
      "id": 108,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "transactionType": "Expense",
      "transactionTypeName": "Expense",
      "referenceType": "CoachPayment",
      "referenceTypeName": "CoachPayment",
      "referenceId": 4,
      "amount": 100,
      "notes": "Coach payment for coach #1 - pola",
      "transactionDate": "2026-11-14T10:28:12.148021"
    },
    {
      "id": 107,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "transactionType": "Expense",
      "transactionTypeName": "Expense",
      "referenceType": "CoachPayment",
      "referenceTypeName": "CoachPayment",
      "referenceId": 3,
      "amount": 10,
      "notes": "Coach payment for coach #1 - pola",
      "transactionDate": "2026-11-14T10:27:41.7477622"
    },
    {
      "id": 106,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "transactionType": "Expense",
      "transactionTypeName": "Expense",
      "referenceType": "SaleReturn",
      "referenceTypeName": "SaleReturn",
      "referenceId": 7,
      "amount": 5,
      "notes": "Refund for sale return - Invoice: INV-000015",
      "transactionDate": "2026-11-13T18:05:05.6464296"
    },
    {
      "id": 105,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "transactionType": "Income",
      "transactionTypeName": "Income",
      "referenceType": "Sale",
      "referenceTypeName": "Sale",
      "referenceId": 15,
      "amount": 50,
      "notes": "Initial payment for sale invoice INV-000015",
      "transactionDate": "2026-11-13T17:59:49.8858011"
    },
    {
      "id": 104,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "transactionType": "Expense",
      "transactionTypeName": "Expense",
      "referenceType": "SaleReturn",
      "referenceTypeName": "SaleReturn",
      "referenceId": 6,
      "amount": 45,
      "notes": "Refund for sale return - Invoice: INV-000014",
      "transactionDate": "2026-11-13T15:56:42.4977145"
    },
    {
      "id": 103,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "transactionType": "Income",
      "transactionTypeName": "Income",
      "referenceType": "Sale",
      "referenceTypeName": "Sale",
      "referenceId": 14,
      "amount": 45,
      "notes": "Initial payment for sale invoice INV-000014",
      "transactionDate": "2026-11-13T15:50:21.5119822"
    },
    {
      "id": 102,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "transactionType": "Expense",
      "transactionTypeName": "Expense",
      "referenceType": "SaleReturn",
      "referenceTypeName": "SaleReturn",
      "referenceId": 5,
      "amount": 45,
      "notes": "Refund for sale return - Invoice: INV-000013",
      "transactionDate": "2026-11-13T15:42:03.8933637"
    },
    {
      "id": 101,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "transactionType": "Income",
      "transactionTypeName": "Income",
      "referenceType": "Sale",
      "referenceTypeName": "Sale",
      "referenceId": 13,
      "amount": 45,
      "notes": "Initial payment for sale invoice INV-000013",
      "transactionDate": "2026-11-13T15:38:05.1141402"
    },
    {
      "id": 100,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "transactionType": "Expense",
      "transactionTypeName": "Expense",
      "referenceType": "OwnerTransaction",
      "referenceTypeName": "OwnerTransaction",
      "referenceId": 11,
      "amount": 400,
      "notes": "Owner withdrawal #11 from Main.",
      "transactionDate": "2026-11-13T15:33:34.2340819"
    },
    {
      "id": 99,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "transactionType": "Expense",
      "transactionTypeName": "Expense",
      "referenceType": "OwnerTransaction",
      "referenceTypeName": "OwnerTransaction",
      "referenceId": 10,
      "amount": 500,
      "notes": "Owner withdrawal #10 from Main.",
      "transactionDate": "2026-11-13T15:31:58.6534344"
    },
    {
      "id": 98,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "transactionType": "Expense",
      "transactionTypeName": "Expense",
      "referenceType": "Expense",
      "referenceTypeName": "Expense",
      "referenceId": 10,
      "amount": 200,
      "notes": "Electricity expense test",
      "transactionDate": "2026-11-13T15:27:34.231"
    },
    {
      "id": 96,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "transactionType": "Income",
      "transactionTypeName": "Income",
      "referenceType": "DuePaymentCollection",
      "referenceTypeName": "DuePaymentCollection",
      "referenceId": 18,
      "amount": 700,
      "notes": "Payment for due payment #22 - اسم الجهة المستأجرة",
      "transactionDate": "2026-11-13T14:25:40.5727583"
    },
    {
      "id": 95,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "transactionType": "Income",
      "transactionTypeName": "Income",
      "referenceType": "DuePaymentCollection",
      "referenceTypeName": "DuePaymentCollection",
      "referenceId": 17,
      "amount": 35,
      "notes": "POS sale payment collection for due payment #21 - حمو",
      "transactionDate": "2026-11-13T14:05:21.7679661"
    },
    {
      "id": 97,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "transactionType": "Income",
      "transactionTypeName": "Income",
      "referenceType": "OtherIncome",
      "referenceTypeName": "OtherIncome",
      "referenceId": 6,
      "amount": 5000,
      "notes": "محمد النجار",
      "transactionDate": "2026-11-13T14:00:35.307"
    },
    {
      "id": 94,
      "cashboxType": "Main",
      "cashboxName": "Main",
      "transactionType": "Income",
      "transactionTypeName": "Income",
      "referenceType": "OtherIncome",
      "referenceTypeName": "OtherIncome",
      "referenceId": 5,
      "amount": 500,
      "notes": "Other income test",
      "transactionDate": "2026-11-13T14:00:35.307"
    },
    {
      "id": 93,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "transactionType": "Income",
      "transactionTypeName": "Income",
      "referenceType": "Sale",
      "referenceTypeName": "Sale",
      "referenceId": 12,
      "amount": 40,
      "notes": "Initial payment for sale invoice INV-000012",
      "transactionDate": "2026-11-13T13:57:54.1352265"
    },
    {
      "id": 92,
      "cashboxType": "Subscriptions",
      "cashboxName": "Subscriptions",
      "transactionType": "Income",
      "transactionTypeName": "Income",
      "referenceType": "Subscription",
      "referenceTypeName": "Subscription",
      "referenceId": 13,
      "amount": 1000,
      "notes": "Initial payment for subscription #13 - Mohamed",
      "transactionDate": "2026-11-13T13:51:43.1418554"
    },
    {
      "id": 91,
      "cashboxType": "POS",
      "cashboxName": "POS",
      "transactionType": "Income",
      "transactionTypeName": "Income",
      "referenceType": "OwnerTransaction",
      "referenceTypeName": "OwnerTransaction",
      "referenceId": 9,
      "amount": 1000,
      "notes": "Owner deposit #9 into POS.",
      "transactionDate": "2026-11-13T13:15:13.2415245"
    }
  ],
  "pageNumber": 1,
  "pageSize": 20,
  "totalRecords": 108,
  "totalPages": 6
}
Response headers
 content-type: application/json; charset=utf-8 
 date: Sat,14 Nov 2026 17:58:38 GMT 
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
  "summary": {
    "totalCashboxes": 0,
    "totalCurrentBalance": 0,
    "totalIncoming": 0,
    "totalOutgoing": 0,
    "netMovement": 0
  },
  "cashboxes": [
    {
      "cashboxType": "POS",
      "cashboxName": "string",
      "totalIncome": 0,
      "totalExpense": 0,
      "currentBalance": 0,
      "openingBalance": 0,
      "periodIncoming": 0,
      "periodOutgoing": 0,
      "closingBalance": 0
    }
  ],
  "transactions": [
    {
      "id": 0,
      "cashboxType": "POS",
      "cashboxName": "string",
      "transactionType": "Income",
      "transactionTypeName": "string",
      "referenceType": "Subscription",
      "referenceTypeName": "string",
      "referenceId": 0,
      "amount": 0,
      "notes": "string",
      "transactionDate": "2026-11-14T17:58:38.377Z"
    }
  ],
  "pageNumber": 0,
  "pageSize": 0,
  "totalRecords": 0,
  "totalPages": 0
}
No links

GET
/api/reports/cashboxes/pdf


Parameters
Try it out
Name	Description
FromDate
string($date)
(query)
FromDate
ToDate
string($date)
(query)
ToDate
CashboxType
string
(query)
Available values : POS, Subscriptions, Main


--
TransactionType
string
(query)
Available values : Income, Expense


--
ReferenceType
string
(query)
Available values : Subscription, Sale, Payroll, Expense, SubscriptionCancellation, SaleReturn, OtherIncome, DuePaymentCollection, CoachPayment, PurchaseInvoicePayment, CashTransfer, OwnerTransaction


--
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Responses
Code	Description	Links
200	
OK

Media type

application/pdf
Controls Accept header.
Example Value
Schema
string
No links

GET
/api/reports/cashboxes/excel


Parameters
Try it out
Name	Description
FromDate
string($date)
(query)
FromDate
ToDate
string($date)
(query)
ToDate
CashboxType
string
(query)
Available values : POS, Subscriptions, Main


--
TransactionType
string
(query)
Available values : Income, Expense


--
ReferenceType
string
(query)
Available values : Subscription, Sale, Payroll, Expense, SubscriptionCancellation, SaleReturn, OtherIncome, DuePaymentCollection, CoachPayment, PurchaseInvoicePayment, CashTransfer, OwnerTransaction


--
PageNumber
integer($int32)
(query)
PageNumber
PageSize
integer($int32)
(query)
PageSize
Responses
Code	Description	Links
200	
OK

Media type

application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Controls Accept header.
Example Value
Schema
<?xml version="1.0" encoding="UTF-8"?>
<!--