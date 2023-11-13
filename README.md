# Run the tests

    npm i && npm run test


# Test results

    **PASS** src/tests/**test.spec.ts** (**7.049 s**)
    
    GET /public
    
    ✓  should accept the first 100 requests and reject others (368 ms)
    
    ✓  should inform the client about when they can make another request (185 ms)
    
    ✓  should be accessible (174 ms)
    
    ✓  should identify the client by their ip address (182 ms)
    
    GET /private/1
    
    ✓  should be accessible (4 ms)
    
    ✓  should reject unauthorized access (3 ms)
    
    ✓  should accept authorized access (176 ms)
    
    ✓  should not accept unknown tokens (4 ms)
    
    ✓  should accept the first 200 requests and reject others (391 ms)
    
    ✓  should inform the client about when they can make another request (176 ms)
    
    ✓  should identify the client by their access token (179 ms)
    
    GET /private/2
    
    ✓  should be accessible (4 ms)
    
    ✓  should reject unauthorized access (4 ms)
    
    ✓  should accept authorized access (183 ms)
    
    ✓  should not accept unknown tokens (4 ms)
    
    ✓  should accept the first 100 requests and reject others (317 ms)
    
    ✓  should inform the client about when they can make another request (186 ms)
    
    ✓  should identify the client by their access token (179 ms)
    
    GET /private/5
    
    ✓  should be accessible (4 ms)
    
    ✓  should reject unauthorized access (4 ms)
    
    ✓  should accept authorized access (184 ms)
    
    ✓  should not accept unknown tokens (4 ms)
    
    ✓  should accept the first 40 requests and reject others (229 ms)
    
    ✓  should inform the client about when they can make another request (178 ms)
    
    ✓  should identify the client by their access token (192 ms)
    
      
    
    **Test Suites:** **1 passed**, 1 total
    
    **Tests:** **25 passed**, 25 total
    
    **Snapshots:** 0 total
    
    **Time:**  7.128 s

## Sample ENV file

    REDIS_URL=
    
    REDIS_PORT=
    
    REDIS_PASS=
    
    CACHE_DB_INDEX_PUBLIC=0
    
    CACHE_DB_INDEX_PRIVATE=1
    
    TOKEN_BUCKET_SIZE_PRIVATE=200
    
    TOKEN_BUCKET_SIZE_PUBLIC=100
    
    TOKEN_RENEW_INTERVAL_PUBLIC=3600000
    
    TOKEN_RENEW_INTERVAL_PRIVATE=3600000