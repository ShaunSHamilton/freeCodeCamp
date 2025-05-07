# Exam Moderation Service

## Development

To run:

```bash
cargo run
```

## Deployment

Build the Docker image:

```bash
docker build -t exam-moderation-service -f ./docker/exam-moderation-service/Dockerfile .
```

Run the Docker container:

```bash
docker run -d exam-moderation-service
```

## Testing

1. Seed database with exam and attempt

```bash
pnpm run seed:exam-env --attempt
```

2. `cargo test`
