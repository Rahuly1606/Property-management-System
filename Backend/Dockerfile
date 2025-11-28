# Build stage
FROM maven:3.9.5-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy Maven configuration files
COPY pom.xml .
COPY lombok.config .

# Download dependencies (this layer is cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -S spring && adduser -S spring -G spring

# Set working directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R spring:spring /app

# Switch to non-root user
USER spring:spring

# Environment variables (can be overridden at runtime)
ENV SPRING_PROFILES_ACTIVE=docker
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql-db:3306/pmsbackend
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=Rahul@1606
ENV SERVER_PORT=8082
ENV CLOUDINARY_CLOUD_NAME=dt8xx5yyr
ENV CLOUDINARY_API_KEY=338782571496263
ENV CLOUDINARY_API_SECRET=QRaGSP5Ki02u4WV_nWrTe79QTzE
ENV RAZORPAY_KEY_ID=rzp_test_RkpquIoUsbb6em
ENV RAZORPAY_KEY_SECRET=YMVXpJ0WmSbKH5mUKO9rCCO4

# Expose the application port
EXPOSE 8082

# Health check - Check if application responds (any HTTP response = healthy)
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -s http://localhost:8082/ > /dev/null || exit 1

# Run the application
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]