FROM openjdk:17-jdk-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file JAR từ máy host vào container
COPY target/*.jar app.jar

# Expose cổng 8080 để bên ngoài có thể truy cập ứng dụng
EXPOSE 8080

# Lệnh chạy ứng dụng khi container khởi động
CMD ["java", "-jar", "app.jar"]
