#!/bin/bash

# API Testing Script
# Tests the node-api endpoints to verify everything is working

set -e

API_URL="${API_URL:-http://localhost:3000}"
BOLD='\033[1m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BOLD}🧪 Testing node-api at ${API_URL}${NC}"
echo ""

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${BOLD}Testing: ${description}${NC}"
    echo "  ${method} ${endpoint}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X ${method} "${API_URL}${endpoint}")
    else
        response=$(curl -s -w "\n%{http_code}" -X ${method} "${API_URL}${endpoint}" \
            -H "Content-Type: application/json" \
            -d "${data}")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "  ${GREEN}✅ Success (${http_code})${NC}"
        echo "  Response: ${body}" | head -c 200
        if [ ${#body} -gt 200 ]; then
            echo "..."
        fi
        echo ""
    else
        echo -e "  ${RED}❌ Failed (${http_code})${NC}"
        echo "  Response: ${body}"
        echo ""
        return 1
    fi
    
    echo ""
}

# Check if API is running
echo -e "${YELLOW}Checking if API is running...${NC}"
if ! curl -s "${API_URL}" > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: API is not responding at ${API_URL}${NC}"
    echo ""
    echo "Please start the API first:"
    echo "  make db-only"
    echo "  cd services/node-api && npm run dev"
    echo ""
    echo "Or start everything with Docker:"
    echo "  make dev"
    exit 1
fi
echo -e "${GREEN}✅ API is running${NC}"
echo ""

# Run tests
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_endpoint "GET" "/" "Root endpoint"

test_endpoint "GET" "/health" "Health check"

test_endpoint "GET" "/api/ping" "Ping endpoint"

test_endpoint "GET" "/api/info" "Info endpoint"

test_endpoint "GET" "/api/users" "List all users"

# Create a test user
timestamp=$(date +%s)
test_email="test-${timestamp}@example.com"
test_endpoint "POST" "/api/users" \
    "{\"name\":\"Test User ${timestamp}\",\"email\":\"${test_email}\"}" \
    "Create new user"

test_endpoint "GET" "/api/users/1" "Get user by ID"

test_endpoint "POST" "/api/users/logs/activity" \
    "{\"action\":\"test_action\",\"userId\":\"1\",\"metadata\":{\"test\":true}}" \
    "Create activity log"

test_endpoint "GET" "/api/users/logs/activity" "Get activity logs"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}${BOLD}✅ All tests passed!${NC}"
echo ""
echo "Your node-api is working correctly with both PostgreSQL and MongoDB."
echo ""
