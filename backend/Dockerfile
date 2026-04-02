# Use Java 17 (working image)
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build the project
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Run the jar
CMD ["sh", "-c", "java -jar target/*.jar"]