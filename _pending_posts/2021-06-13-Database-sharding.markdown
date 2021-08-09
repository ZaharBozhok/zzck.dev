---
layout: post
title:  "Database sharding"
date:   2021-06-13
last_modified_at: 2021-06-13
categories: [Jekyll Paper]
tags: [Databases, DB, Sharding, Docker]
---

Database sharding

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
