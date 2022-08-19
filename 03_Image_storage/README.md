Endpoints:
    auth:
    
	POST - https://e3ygsvc037.execute-api.us-east-1.amazonaws.com/dev/signup - POST {"email": "yourmail@google.com", "password": "min8letters"}
	POST - https://e3ygsvc037.execute-api.us-east-1.amazonaws.com/dev/signup/confirm - POST {"email": "yourmail@google.com", "code":"000000"}
	POST - https://e3ygsvc037.execute-api.us-east-1.amazonaws.com/dev/signin - POST {"email": "yourmail@google.com", "password": "min8letters"}
	Response:
	{
		"accessTocken":"yourToken",
		"refreshTocken":"yourToken"
	}
	On your client side, you need to store both tokens.
	
	
	  POST - https://qyxyynq61e.execute-api.us-east-1.amazonaws.com/dev/hello
	  GET - https://qyxyynq61e.execute-api.us-east-1.amazonaws.com/dev/images
	  POST - https://qyxyynq61e.execute-api.us-east-1.amazonaws.com/dev/images
	  DELETE - https://qyxyynq61e.execute-api.us-east-1.amazonaws.com/dev/images
	
	
	
	eyJraWQiOiJ2VHlYSTlcL2grUzVSdHpZSmhKSHA1aGZxMzE2cWxEQWltb1VcL0FncHpxQzQ9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJmZWQ2MzczOS1kYTU5LTQxNzgtOWJiMS0xYTQ5OWQxOWU0NDUiLCJkZXZpY2Vfa2V5IjoidXMtZWFzdC0xXzM0Y2ZkODgzLTljN2ItNDY5OC05N2UwLTkyNjc2NWYwMzk5NyIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0NJSHdEQUF0NyIsImNsaWVudF9pZCI6IjNlYm83NXI2Z3VsMTczbTdmc285bzJjaGthIiwib3JpZ2luX2p0aSI6IjU3YTIxZDVjLTIwMDUtNGYyNS1iZWI3LTNmNWQ2MjE1N2JkZSIsImV2ZW50X2lkIjoiNGUzMWFmZjktYWZhOC00ZGFiLWFiMWItYTgxY2JhMWMxYzZiIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTY2MDc1NjY4NiwiZXhwIjoxNjYwNzYwMjg2LCJpYXQiOjE2NjA3NTY2ODYsImp0aSI6IjdjZTg4MTBiLWQxMzktNDdlYy04NzNlLWM5NmJhYzYxNzhkYSIsInVzZXJuYW1lIjoiZmVkNjM3MzktZGE1OS00MTc4LTliYjEtMWE0OTlkMTllNDQ1In0.xr4uYWI6Hil9iUVkKSTlF6K4Yjq2KgluIcxwagvckiq1Cx781fbNT1toWxg9osaz4tuhrz8SQjU1Z05teCRdq3RMdnSrsMyzat1-dNEx02jOA_Gd6vGvigs88mXasuUIrAr5uhgOzI0o_W0QeVbtNGtqPkznnYohcfPwY27UczhLQ9R-snYfA4FzG4-X33HuP_-yT7tmJGrC-10Zlt62ApwnBnsE8fsr4NUEoGx6LrZrCQfY_aMB6ZEuVK1ICERGFSMgAFikHqRLPMJyWb6_xawiIuCIN7ECEf3DrRBxaxIsAwCNkYdYS4OklPgY_p3QHgKHtLoLB6l2b7NcOrv-4Q
	
	
	https://qyxyynq61e.execute-api.us-east-1.amazonaws.com/dev/images?email=MissisLecter@protonmail.com&name=catacrobat.ico
