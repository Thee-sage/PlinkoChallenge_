/**
 * Test script to demonstrate traceops integration issues
 * Run with: npx ts-node scripts/test-traceops.ts
 */

const TRACEOPS_ENDPOINT = "https://traceops.onrender.com/events";
const SERVICE_NAME = "plinko-challenge";

interface TestEvent {
  eventType: "DEPLOY" | "CONFIG_CHANGE" | "ERROR";
  serviceName: string;
  timestamp: number;
  message?: string;
  metadata?: Record<string, any>;
}

async function testTraceopsEvent(eventType: "DEPLOY" | "CONFIG_CHANGE" | "ERROR", message: string, metadata?: Record<string, any>) {
  const event: TestEvent = {
    eventType,
    serviceName: SERVICE_NAME,
    timestamp: Date.now(),
    message,
    metadata: metadata || {},
  };

  console.log(`\n📤 Sending ${eventType} event to traceops...`);
  console.log("Endpoint:", TRACEOPS_ENDPOINT);
  console.log("Payload:", JSON.stringify(event, null, 2));

  try {
    const startTime = Date.now();
    const response = await fetch(TRACEOPS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`\n✅ Response received (${duration}ms):`);
    console.log("Status:", response.status, response.statusText);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log("Response body:", responseText || "(empty)");

    if (!response.ok) {
      console.error(`❌ Request failed with status ${response.status}`);
      return { success: false, status: response.status, error: responseText };
    }

    console.log(`✅ Event sent successfully!`);
    return { success: true, status: response.status, duration };
  } catch (error: any) {
    console.error(`\n❌ Error sending event:`);
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    if (error.code) {
      console.error("Error code:", error.code);
    }
    if (error.cause) {
      console.error("Error cause:", error.cause);
    }

    return { success: false, error: error.message, code: error.code };
  }
}

async function runTests() {
  console.log("=".repeat(60));
  console.log("TRACEOPS INTEGRATION TEST");
  console.log("=".repeat(60));
  console.log(`Testing endpoint: ${TRACEOPS_ENDPOINT}`);
  console.log(`Service name: ${SERVICE_NAME}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);

  const results = [];

  // Test 1: DEPLOY event
  results.push(await testTraceopsEvent("DEPLOY", "Test deployment event", {
    env: "test",
    version: "1.0.0",
  }));

  // Wait a bit between requests
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 2: ERROR event
  results.push(await testTraceopsEvent("ERROR", "Test error event", {
    errorType: "TestError",
    stack: "Error: This is a test error\n    at test-traceops.ts:1:1",
    source: "test-script",
  }));

  // Wait a bit between requests
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 3: CONFIG_CHANGE event
  results.push(await testTraceopsEvent("CONFIG_CHANGE", "Test config change event", {
    setting: "test_setting",
    value: "test_value",
    changedBy: "test-user",
  }));

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("TEST SUMMARY");
  console.log("=".repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Total tests: ${results.length}`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  results.forEach((result, index) => {
    const testName = ["DEPLOY", "ERROR", "CONFIG_CHANGE"][index];
    if (result.success) {
      console.log(`  ${testName}: ✅ Success (${result.status})`);
    } else {
      console.log(`  ${testName}: ❌ Failed - ${result.error || result.code || "Unknown error"}`);
    }
  });

  console.log("\n" + "=".repeat(60));
  console.log("NEXT STEPS:");
  console.log("=".repeat(60));
  console.log("1. Check traceops dashboard to see if events appear");
  console.log("2. If events don't appear, use this output as evidence");
  console.log("3. Check network tab in browser for CORS or other errors");
  console.log("4. Verify traceops service is running and accessible");
  console.log("=".repeat(60));
}

// Run the tests
runTests().catch(console.error);

