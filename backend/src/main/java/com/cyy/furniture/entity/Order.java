package com.cyy.furniture.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 訂單實體類
 * 
 * @author CYY Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "orders")
public class Order extends BaseEntity {
    
    @NotBlank(message = "訂單號不能為空")
    @Size(max = 50, message = "訂單號長度不能超過50字符")
    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;
    
    @DecimalMin(value = "0.0", message = "商品總金額不能為負數")
    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;
    
    @DecimalMin(value = "0.0", message = "運費不能為負數")
    @Column(name = "shipping_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal shippingFee = BigDecimal.ZERO;
    
    @DecimalMin(value = "0.0", message = "折扣金額不能為負數")
    @Column(name = "discount_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @DecimalMin(value = "0.0", message = "總金額不能為負數")
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    @Size(max = 100, message = "優惠券代碼長度不能超過100字符")
    @Column(name = "coupon_code")
    private String couponCode;
    
    // 配送信息
    @NotBlank(message = "收件人姓名不能為空")
    @Size(max = 100, message = "收件人姓名長度不能超過100字符")
    @Column(name = "shipping_name", nullable = false)
    private String shippingName;
    
    @NotBlank(message = "收件人電話不能為空")
    @Size(max = 20, message = "收件人電話長度不能超過20字符")
    @Column(name = "shipping_phone", nullable = false)
    private String shippingPhone;
    
    @NotBlank(message = "配送地址不能為空")
    @Size(max = 500, message = "配送地址長度不能超過500字符")
    @Column(name = "shipping_address", nullable = false)
    private String shippingAddress;
    
    @Size(max = 1000, message = "備註長度不能超過1000字符")
    private String notes;
    
    // 支付信息
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    @Column(name = "paid_at")
    private LocalDateTime paidAt;
    
    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;
    
    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;
    
    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;
    
    @Size(max = 1000, message = "取消原因長度不能超過1000字符")
    @Column(name = "cancel_reason")
    private String cancelReason;
    
    // 訂單所屬用戶
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // 訂單項目
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;
    
    /**
     * 訂單狀態枚舉
     */
    public enum Status {
        PENDING("待確認"),
        CONFIRMED("已確認"),
        PAID("已付款"),
        SHIPPED("已發貨"),
        DELIVERED("已送達"),
        CANCELLED("已取消"),
        REFUNDED("已退款");
        
        private final String description;
        
        Status(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
    
    /**
     * 支付方式枚舉
     */
    public enum PaymentMethod {
        CASH_ON_DELIVERY("貨到付款"),
        CREDIT_CARD("信用卡"),
        BANK_TRANSFER("銀行轉帳"),
        LINE_PAY("Line Pay"),
        APPLE_PAY("Apple Pay");
        
        private final String description;
        
        PaymentMethod(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
    
    /**
     * 支付狀態枚舉
     */
    public enum PaymentStatus {
        PENDING("待支付"),
        PAID("已支付"),
        FAILED("支付失敗"),
        REFUNDED("已退款");
        
        private final String description;
        
        PaymentStatus(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
    
    /**
     * 計算訂單總金額
     */
    public BigDecimal calculateTotalAmount() {
        return subtotal.add(shippingFee).subtract(discountAmount);
    }
} 