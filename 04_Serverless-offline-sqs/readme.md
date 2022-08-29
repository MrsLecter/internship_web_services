1) run docker
2) download and run container docker with config

docker run -p 9324:9324 -p 9325:9325 -v `pwd`/custom.conf:/opt/elasticmq.conf softwaremill/elasticmq
3) run serverless offline sls offline
4) make get request to http://localhost:9324?Action=ListQueues
5) grab queue url from response 
http://localhost:9324?Action=GetQueueUrl&QueueName=demoqueue

<QueueUrl>http: //localhost:9324/000000000000/redirect-queue-name</QueueUrl><QueueUrl>http://localhost:9324/000000000000/queue1-dead-letters</QueueUrl><QueueUrl>http://localhost:9324/000000000000/queue1</QueueUrl><QueueUrl>http://localhost:9324/000000000000/audit-queue-name</QueueUrl>

POST http://localhost:3000/dev/publisher
body:
[{"name":"user1", "token": "token1"}, {"name": "user2", "token":"token2"}]

view message status http://localhost:9325/

run elasticmq locally: sudo java -Dconfig.file=custom.conf -jar elasticmq-server-1.3.9.jar
mysql -u root -p
serverless offline start --printOutput
