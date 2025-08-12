package com.cyy.furniture;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * CYY家具電商系統主應用類
 * 
 * @author CYY Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
public class CyyFurnitureApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(CyyFurnitureApplication.class, args);
        System.out.println("=== CYY家具電商後端系統啟動成功 ===");
        System.out.println("API文檔地址: http://localhost:8080/api/swagger-ui.html");
        System.out.println("數據庫控制台: http://localhost:8080/api/h2-console (開發環境)");
    }
} 