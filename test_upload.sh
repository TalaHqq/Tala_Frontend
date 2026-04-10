#!/bin/bash
LOGIN_RES=$(curl -s -X POST "https://tala-dev-api-26jt.onrender.com/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"testuser@example.com\",\"password\":\"Test@123\"}")
TOKEN=$(echo "$LOGIN_RES" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

echo -e "\nPOST /api/upload/initiate"
curl -s -X POST "https://tala-dev-api-26jt.onrender.com/api/upload/initiate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"fileName\":\"test.png\",\"contentType\":\"image/png\",\"partCount\":1,\"collectionId\":\"CL1001\"}"
