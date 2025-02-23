package com.xuandong.ChatApp.repository.follow;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.xuandong.ChatApp.entity.Follow;
import com.xuandong.ChatApp.entity.User;

public interface FollowRepository extends JpaRepository<Follow, String> {

	@Query("SELECT f FROM Follow f WHERE f.user.id = :userId")
	List<Follow> findFollowingByUser(@Param("userId") String userId);

	@Query("SELECT f FROM Follow f WHERE f.userFollowing.id = :userId")
	List<Follow> findFollowers(@Param("userId") String userId);

	Optional<Follow> findById(String id);
	
	Optional<Follow> findByUserAndUserFollowing(User user, User userFollow);

}
