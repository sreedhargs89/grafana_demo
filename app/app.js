const express = require('express');
const promClient = require('prom-client');
const app = express();
const port = process.env.PORT || 3000;

// Create a Registry to register the metrics
const register = new promClient.Registry();
// Enable the collection of default metrics
promClient.collectDefaultMetrics({ register });

// ===== METRIC DEFINITIONS =====

// Counter: Counts the total number of requests received
// Counters only go up and reset when the process restarts
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'endpoint', 'status'],
  registers: [register]
});

// Gauge: Shows current value of something that can go up and down
// For example, the number of active connections or memory usage
const randomValueGauge = new promClient.Gauge({
  name: 'random_value_gauge',
  help: 'A gauge that contains a random value',
  registers: [register]
});

// Histogram: Measures the distribution of values
// Useful for response times and other duration-based metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'endpoint'],
  buckets: [10, 50, 100, 200, 500, 1000, 2000],
  registers: [register]
});

// Summary: Similar to histogram but calculates configurable quantiles
const requestSizeSummary = new promClient.Summary({
  name: 'http_request_size_bytes',
  help: 'HTTP request size in bytes',
  percentiles: [0.5, 0.9, 0.99],
  registers: [register]
});

// ===== MIDDLEWARE =====

// Middleware to measure request duration
app.use((req, res, next) => {
  const start = Date.now();
  
  // When response is finished, record metrics
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.path)
      .observe(duration);
    
    httpRequestsTotal
      .labels(req.method, req.path, res.statusCode)
      .inc();
    
    // Simulate request size for demonstration
    const fakeRequestSize = Math.floor(Math.random() * 10000);
    requestSizeSummary.observe(fakeRequestSize);
  });
  
  next();
});

// ===== ROUTES =====

// Expose metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Grafana & Prometheus Demo App! Visit /metrics to see the metrics.');
});

// Increment counter manually
app.get('/increment', (req, res) => {
  // Extract the value from query params or use default of 1
  const value = parseInt(req.query.value) || 1;
  
  // Increment a counter with a custom label
  httpRequestsTotal
    .labels('GET', 'increment', 200)
    .inc(value);
  
  res.send(`Counter incremented by ${value}. Visit /metrics to see the change.`);
});

// Update the random value gauge
app.get('/gauge/:value', (req, res) => {
  const value = parseFloat(req.params.value);
  
  if (isNaN(value)) {
    res.status(400).send('Value must be a number');
    return;
  }
  
  randomValueGauge.set(value);
  res.send(`Gauge set to ${value}. Visit /metrics to see the change.`);
});

// Generate random gauge value
app.get('/random-gauge', (req, res) => {
  const value = Math.random() * 100;
  randomValueGauge.set(value);
  res.send(`Gauge set to random value: ${value.toFixed(2)}. Visit /metrics to see the change.`);
});

// Simulate a slow endpoint to affect duration metrics
app.get('/slow', async (req, res) => {
  // Sleep for a random amount of time between 100ms and 2s
  const sleepTime = Math.floor(Math.random() * 1900) + 100;
  
  await new Promise(resolve => setTimeout(resolve, sleepTime));
  
  res.send(`Slow response after ${sleepTime}ms. This will affect the duration histogram. Visit /metrics to see the change.`);
});

// API that simulates errors occasionally
app.get('/flaky', (req, res) => {
  // 20% chance of error
  if (Math.random() < 0.2) {
    res.status(500).send('Internal Server Error');
  } else {
    res.send('Success! But this endpoint occasionally fails. Refresh a few times to see errors.');
  }
});

// Health check endpoint for Docker
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// ===== BACKGROUND TASKS =====
// Periodically update the gauge with a random value (every 5 seconds)
setInterval(() => {
  const randomValue = Math.random() * 100;
  randomValueGauge.set(randomValue);
  console.log(`Updated gauge to ${randomValue.toFixed(2)}`);
}, 5000);

// ===== SERVER STARTUP =====

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  console.log(`Metrics available at http://localhost:${port}/metrics`);
});

