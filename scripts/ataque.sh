#!/bin/bash

for i in {1..50}
do

curl http://localhost:8080/api/stress/http > /dev/null &

curl -X POST http://localhost:8080/api/stress/db \
-H "Content-Type: application/json" \
-d '{"accion":"insert"}' > /dev/null &

curl -X POST http://localhost:8080/api/stress/db \
-H "Content-Type: application/json" \
-d '{"accion":"select"}' > /dev/null &

done

wait
