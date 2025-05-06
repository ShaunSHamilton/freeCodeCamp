ARG TARGET=x86_64-unknown-linux-gnu
ARG BIN_NAME=exam-moderation-service
ARG PROJECT_DIR=tools/${BIN_NAME}

# Compile binary
FROM rust:1-slim as builder

WORKDIR /app

# Copy only the Cargo manifest files first for dependency caching
COPY ${PROJECT_DIR}/Cargo.toml ${PROJECT_DIR}/Cargo.lock ./

# Build dependencies (this layer will be cached if Cargo files don't change)
RUN cargo build --release --target ${TARGET} --bin ${BIN_NAME}

# Copy the entire source directory
COPY ${PROJECT_DIR}/src ./src

# Build the final executable
RUN cargo build --release --target ${TARGET} --bin ${BIN_NAME}

# Create runtime image
FROM debian:bullseye-slim

WORKDIR /app

# Copy the built executable from the builder stage
COPY --from=builder /app/target/${TARGET}/release/${BIN_NAME} ./

# Set execute permissions
RUN chmod +x ./exam-moderation-service

# Command to run when the container starts
CMD ["./exam-moderation-service"]
