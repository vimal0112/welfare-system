FROM maven:3.9.9-eclipse-temurin-17

WORKDIR /app

# Copy everything inside backend
COPY . .

# Build project
RUN mvn clean package -DskipTests

# Run jar
CMD ["sh", "-c", "java -jar target/*.jar"]