package com.auth.auth.dao;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auth.auth.model.User;

// Repository interface for User entity, extending JpaRepository to provide CRUD operations
public interface UserRepo extends JpaRepository<User,UUID> {

    User findByUsername(String username);

}
