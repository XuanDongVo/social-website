package com.xuandong.ChatApp.repository.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.user.UserConstants;

public interface UserRepository extends JpaRepository<User, String> {
	Optional<User> findByEmailAndPassword(String email, String password);

	@Query(name = UserConstants.FIND_USER_BY_EMAIL)
	Optional<User> findByEmail(@Param("email") String userEmail);

	@Query(name = UserConstants.FIND_ALL_USERS_EXCEPT_SELF)
	List<User> findAllUsersExceptSelf(@Param("publicId") String publicId);

	Optional<User> findById(String id);

	@Query("SELECT u FROM User u WHERE u.firstName LIKE %:keyWord% OR u.lastName LIKE %:keyWord%")
	Page<User> searchingUser( @Param("keyWord") String keyWord,  Pageable pageable);

}
