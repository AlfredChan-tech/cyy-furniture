package com.cyy.furniture.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * 用戶實體類
 * 
 * @author CYY Team
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "users")
public class User extends BaseEntity implements UserDetails {
    
    @NotBlank(message = "用戶名不能為空")
    @Size(min = 3, max = 50, message = "用戶名長度必須在3-50字符之間")
    @Column(unique = true, nullable = false)
    private String username;
    
    @NotBlank(message = "密碼不能為空")
    @Size(min = 6, message = "密碼長度至少6個字符")
    @Column(nullable = false)
    private String password;
    
    @NotBlank(message = "郵箱不能為空")
    @Email(message = "郵箱格式不正確")
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank(message = "姓名不能為空")
    @Size(max = 100, message = "姓名長度不能超過100字符")
    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    @Size(max = 20, message = "電話號碼長度不能超過20字符")
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Size(max = 255, message = "地址長度不能超過255字符")
    private String address;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;
    
    @Column(name = "account_enabled", nullable = false)
    private Boolean accountEnabled = true;
    
    @Column(name = "account_locked", nullable = false)
    private Boolean accountLocked = false;
    
    @Column(name = "credentials_expired", nullable = false)
    private Boolean credentialsExpired = false;
    
    @Column(name = "account_expired", nullable = false)
    private Boolean accountExpired = false;
    
    // UserDetails 接口實現
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return !accountExpired;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return !accountLocked;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return !credentialsExpired;
    }
    
    @Override
    public boolean isEnabled() {
        return accountEnabled;
    }
    
    /**
     * 用戶角色枚舉
     */
    public enum Role {
        USER("普通用戶"),
        ADMIN("管理員"),
        SUPER_ADMIN("超級管理員");
        
        private final String description;
        
        Role(String description) {
            this.description = description;
        }
        
        public String getDescription() {
            return description;
        }
    }
} 