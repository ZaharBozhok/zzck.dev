---
layout: post
title:  "Database replication"
date:   2021-06-13
last_modified_at: 2021-06-13
categories: [Jekyll Paper]
tags: [database, replication, docker]
---

Replication is a one of possible ways to scale database, in other word replication is a process of copying data from master database to slave database(s).

1. Create 3 docker containers: mysql-m, mysql-s1, mysql-s2
2. Setup master slave replication (Master: mysql-m, Slave: mysql-s1, mysql-s2)
3. Write script that will frequently write data to database
4. Ensure, that replication is working
5. Try to turn off mysql-s1, 
6. Try to remove a column in  database on slave node


Goals which usually db users are trying to achieve are:
- Reliability
- Fault-Tolerance
- Accessability

What are benefits from replication?

Master-Master replication

mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%.example.com';

from mysql 8.0
CHANGE REPLICATION SOURCE TO
    SOURCE_HOST='mysql-m',
    SOURCE_USER='slave1_2021',
    SOURCE_PASSWORD='pass2021',
    SOURCE_LOG_FILE='mysql-bin.000001',
    SOURCE_LOG_POS=861;

SHOW REPLICA STATUS

For example we have a shop-service which has 3 types of loads: regular users, goods managers, background jobs for analytics.
Regular users do 

Goal:
1. Create 3 docker containers: postgresql-b, postgresql-b1, postgresql-b2
2. Setup horizontal sharding
3. Insert 1 000 000 rows into books
4. Measure performance
5. Measure performance without sharding
6. Compare performance

PostgreSQL of version 13.3 is used for the demonstration of sharding usage.

```yaml
# docker-compose.yml
# TODO: make a link
  
```

Open ```localhost:80``` in your browser and enter pgadmin creds, and then you'll get in the web management tool.

In quick links add new server.
And now in `Create-Server` window enter postgres DB name, thans to docker-compose.yml docker images have common network and DB can be accessed by it's name `pgDB`.
I named this connection `mainDB`, and in `Connection` tab enter host - `pgDB`, user - `postgres`, password - `pass2021`.

Check out the [Jekyll Paper docs][jekyll-paper-docs] or [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. If you have questions or suggestions, you can create an issue to asking them on [Jekyll Paper Issues][jekyll-paper-issues] or [Jekyll Talk][jekyll-talk].

[jekyll-paper-docs]: https://github.com/ghosind/Jekyll-Paper/wiki
[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-paper-issues]: https://github.com/ghosind/Jekyll-Paper/issues
[jekyll-talk]: https://talk.jekyllrb.com/
