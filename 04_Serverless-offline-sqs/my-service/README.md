## Serverless SQS
  Serverless Framework + Serverless Offline + ElasticMQ + K6 + RDS(MySQL)
  - How it works: 
  - ![Example](./how_it_works.png)

## How to use

1) <code>npm install</code> and configure your params in .env file
2) download local elasticmq (https://github.com/softwaremill/elasticmq)
3) run local elasticmq
<p>run elasticmq locally: <code>sudo java -Dconfig.file=custom.conf -jar elasticmq-server-1.3.9.jar</code></p>
<p>You need config file <code>custom.conf</code>. Its creates queue called "queue1", dead message queue - "dead-queue", sets the parametrs accountId and region.</p>
<p>See all your queue: <code>http://localhost:9324?Action=ListQueues</code></p>
<p>If you want add message to queue manually: <code>http://localhost:9324/${your accountId}/queue1?Action=SendMessage&MessageBody=someuser</code></p>

4) install k6 locally: <code>npm i k6 --save</code>
<p>You need test script for k6: <code>k6-load-test.js</code>, if you have bug with serverless : <code>QueueName fot found</code> use file <code>k6-consumer-test.js</code></p>

5) run serverless offline: <code>sls offline</code>
<p>If you want to see logs run: <code>serverless offline start --printOutput</code></p>

6) run k6 script: <code>k6 run k6-load-scenarios.js</code>
<p>To see how many messages are in the queue visit <code>http://localhost:9325/</code></p>

or

6) run k6 script: <code>k6 run k6-load-test.js</code>
<p>When test complete see on parametr <code>http_reqs</code> - how much request done</p>
<p>To see how many messages are in the queue visit <code>http://localhost:9325/</code></p>

7) run k6 script: <code>k6 run k6-consumer-test.js</code>
<p>To see how many messages are in the queue visit <code>http://localhost:9325/</code></p>

8) To see how much data is loaded into the database use sqlworkbench of <code>mysql -u root -p</code>, <code>use [yourtable]</code>, <code>select * from [yourtable]</code>

## Endpoints 

- **GET**  <code>http://localhost:3000/dev/getall</code> - get all data from DB
- **POST** <code>http://localhost:3000/dev/publisher</code> - push data to queue
- **POST** <code>http://localhost:3000/dev/consumer</code> - receive data from queue and push it in DB