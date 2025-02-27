	package com.xuandong.ChatApp.entity;

import java.beans.Transient;
import java.time.LocalDateTime;
import java.util.List;

import com.xuandong.ChatApp.user.UserConstants;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
@NamedQuery(name = UserConstants.FIND_USER_BY_EMAIL, query = "SELECT u FROM User u WHERE u.email = :email")
@NamedQuery(name = UserConstants.FIND_ALL_USERS_EXCEPT_SELF, query = "SELECT u FROM User u WHERE u.id != :publicId")
@NamedQuery(name = UserConstants.FIND_USER_BY_PUBLIC_ID, query = "SELECT u FROM User u WHERE u.id = :publicId")
public class User extends BaseAuditingEntity {

	private static final int LAST_ACTIVATE_INTERVAL = 5;

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;
	private String firstName;
	private String lastName;
	@Column(nullable = false, unique = true)
	@Email
	private String email;
	private LocalDateTime lastSeen;
	private String password;

	@OneToMany(mappedBy = "sender")
	private List<Chat> chatsAsSender;

	@OneToMany(mappedBy = "recipient")
	private List<Chat> chatsAsRecipient;

	@OneToMany(mappedBy = "user")
	private List<Follow> follows;

	@OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Story> stories;
	
	@OneToMany(mappedBy = "user",cascade = CascadeType.ALL, orphanRemoval = true )
	private List<Post> posts;

	@OneToMany(mappedBy = "user", orphanRemoval = true, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<RoleUser> roles;

	@Transient
	public boolean isUserOnline() {
		return lastSeen != null && lastSeen.isAfter(LocalDateTime.now().minusMinutes(LAST_ACTIVATE_INTERVAL));
	}
	
}
