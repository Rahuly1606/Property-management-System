FROM maven:3.8.5-openjdk-17 AS build

# Set working directory
WORKDIR /app

# Copy Maven configuration files
COPY pom.xml .
COPY .mvn .mvn

# Download dependencies (this layer is cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN mvn package -DskipTests

# Create the final image
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Environment variables (can be overridden at runtime)
ENV SPRING_PROFILES_ACTIVE=docker
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql-db:3306/pmsbackend
ENV SPRING_DATASOURCE_USERNAME=root
ENV SPRING_DATASOURCE_PASSWORD=Rahul@1606

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]