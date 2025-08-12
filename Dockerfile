# 多階段構建
# 第一階段：構建後端
FROM openjdk:17-jdk-slim AS backend-build

WORKDIR /app/backend
COPY backend/pom.xml .
COPY backend/mvnw .
COPY backend/mvnw.cmd .
COPY backend/.mvn .mvn
COPY backend/src src

# 設置執行權限並構建
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# 第二階段：運行環境
FROM openjdk:17-jre-slim

# 安裝nginx用於前端
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 複製後端jar文件
COPY --from=backend-build /app/backend/target/*.jar backend.jar

# 複製前端文件到nginx目錄
COPY *.html /var/www/html/
COPY *.css /var/www/html/
COPY *.js /var/www/html/
COPY *.md /var/www/html/

# 複製nginx配置
COPY docker/nginx.conf /etc/nginx/nginx.conf

# 複製啟動腳本
COPY docker/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# 暴露端口
EXPOSE 80 8080

# 啟動命令
CMD ["/app/start.sh"]
