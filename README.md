# Grafana & Prometheus Demo Application

This project demonstrates the integration of a Node.js application with Prometheus and Grafana for monitoring and visualization. The application exposes various metrics that can be scraped by Prometheus and visualized in Grafana.

## Project Structure

```
grafana_demo/
├── app/                    # Node.js application
│   ├── app.js             # Main application code
│   ├── package.json       # Node.js dependencies
│   └── Dockerfile         # Container configuration
└── prometheus/            # Prometheus configuration
    └── prometheus.yml     # Prometheus configuration file
```

## Features

- Express.js web application with Prometheus metrics integration
- Various metric types demonstrated:
  - Counters (http_requests_total)
  - Gauges (random_value_gauge)
  - Histograms (http_request_duration_ms)
  - Summaries (http_request_size_bytes)
- Docker containerization
- Health check endpoint
- Prometheus configuration for metrics collection

## Available Endpoints

- `/` - Welcome page
- `/metrics` - Prometheus metrics endpoint
- `/increment` - Increment counter (optional value parameter)
- `/gauge/:value` - Set gauge value
- `/random-gauge` - Set gauge to random value
- `/slow` - Simulate slow response
- `/flaky` - Simulate occasional errors
- `/health` - Health check endpoint

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd grafana_demo
   ```

2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Application: http://localhost:3000
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3001 (default credentials: admin/admin)

## Metrics

The application exposes the following metrics:

- `http_requests_total`: Total number of HTTP requests
- `random_value_gauge`: Current random value
- `http_request_duration_ms`: Duration of HTTP requests
- `http_request_size_bytes`: Size of HTTP requests
- Default Node.js metrics (memory, CPU, etc.)

## Development

To run the application locally:

1. Install dependencies:
   ```bash
   cd app
   npm install
   ```

2. Start the application:
   ```bash
   npm start
   ```

## Docker

The application is containerized using Docker. The Dockerfile includes:
- Node.js 18 slim base image
- Health check configuration
- Production environment settings
- Optimized layer caching

## Prometheus Configuration

The Prometheus configuration (`prometheus.yml`) includes:
- 5-second scrape interval for the Node.js application
- Default metrics collection
- Static target configuration
- Self-monitoring setup

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 