package com.xuandong.ChatApp.repository.role;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xuandong.ChatApp.entity.Role;
import java.util.List;
import java.util.Optional;


public interface RoleRepository extends JpaRepository<Role, String> {
	Optional<Role> findByRoleName(String roleName);
}
