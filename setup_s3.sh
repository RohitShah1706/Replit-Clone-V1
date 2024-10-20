#!/bin/bash

docker compose up -d s3
aws s3 mb s3://replit-clone --endpoint-url http://localhost:4566
aws s3 cp s3_base_contents s3://replit-clone/base --recursive --endpoint-url http://localhost:4566