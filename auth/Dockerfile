# Dockerfile for the Auth Service
# 
# - Uses the official OpenJDK 21 slim image as the base for a lightweight Java runtime environment.
FROM openjdk:21-slim
# - Sets the working directory inside the container to /app-auth-service.

WORKDIR /app-auth-service
# - Copies the built JAR file (auth-0.0.1-SNAPSHOT.jar) from the target directory on the host to the container, renaming it to auth-service.jar.
COPY target/auth-0.0.1-SNAPSHOT.jar auth-service.jar

# Copy shared-schemas directory into the image
COPY shared-schemas/ /app/shared-schemas/

# Specifies the command to run the application using Java and the provided JAR file when the container starts.
ENTRYPOINT [ "java","-jar", "auth-service.jar" ]



# FROM openjdk:21-slim

# WORKDIR /app

# # Copy compiled classes and resources
# COPY target/classes target/classes
# COPY src/main/resources src/main/resources

# # Set the classpath to include classes and resources
# ENV CLASSPATH=target/classes:src/main/resources

# # Set the main class (update if your main class is different)
# CMD ["java", "com.auth.auth.AuthApplication"]