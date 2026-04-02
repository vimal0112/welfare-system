package com.project.welfare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.welfare.Entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findByMobile(String mobile);
    User findByEmail(String email);
    long countByRole(String role);
}
