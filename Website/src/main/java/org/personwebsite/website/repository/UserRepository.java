package org.personwebsite.website.repository;

import org.personwebsite.website.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    boolean existsByUsernameOrEmail(String username, String email);
}
