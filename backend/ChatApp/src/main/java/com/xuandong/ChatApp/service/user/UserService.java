package com.xuandong.ChatApp.service.user;

import java.util.List;
import java.util.stream.Collectors;

import com.xuandong.ChatApp.dto.request.EditProfileRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.xuandong.ChatApp.dto.request.RegisterRequest;
import com.xuandong.ChatApp.dto.response.user.AuthResponse;
import com.xuandong.ChatApp.dto.response.user.ProfileResponse;
import com.xuandong.ChatApp.dto.response.user.UserResponse;
import com.xuandong.ChatApp.entity.Role;
import com.xuandong.ChatApp.entity.RoleUser;
import com.xuandong.ChatApp.entity.User;
import com.xuandong.ChatApp.mapper.UserMapper;
import com.xuandong.ChatApp.repository.role.RoleRepository;
import com.xuandong.ChatApp.repository.role.RoleUserRepository;
import com.xuandong.ChatApp.repository.user.UserRepository;
import com.xuandong.ChatApp.service.follow.FollowService;
import com.xuandong.ChatApp.service.jwt.JwtService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper mapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final RoleUserRepository roleUserRepository;
    private final FollowService followService;

    public AuthResponse login(String email, String password, HttpServletResponse response) {
        Authentication authenticationRequest = UsernamePasswordAuthenticationToken.unauthenticated(email, password);
        Authentication authenticationResponse = this.authenticationManager.authenticate(authenticationRequest);

        String accessToken = jwtService.createAccessToken(authenticationResponse);
        String refreshToken = jwtService.createRefreshToken(authenticationResponse);

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);
        refreshTokenCookie.setAttribute("SameSite", "Strict");
        response.addCookie(refreshTokenCookie);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException());

        return mapper.toAuthResponse(user, accessToken);
    }

    public UserResponse findById(String userId){
        User user = userRepository.findById(userId).orElseThrow(EntityNotFoundException::new);
        return mapper.toUserResponse(user);
    }

    @Transactional
    public void createUser(RegisterRequest registerRequest) {
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        String hashPassword = passwordEncoder.encode(registerRequest.getPassword());
        user.setPassword(hashPassword);
        userRepository.save(user);

        Role role = roleRepository.findByRoleName("user").orElseThrow(() -> new EntityNotFoundException("Not found role"));
        RoleUser roleUser = new RoleUser();
        roleUser.setRole(role);
        roleUser.setUser(user);

        roleUserRepository.save(roleUser);
    }

    public List<UserResponse> searchUser(String keyword) {
        Pageable pageable = PageRequest.of(0, 10);
        Page<User> users = userRepository.searchingUser(keyword, pageable);
        return users.getContent().stream().map(mapper::toUserResponse).toList();
    }

    public ProfileResponse getProfileUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found with id " + userId));
        int follower = followService.getFollower(user).size();
        return mapper.toProFileUserResponse(user, follower);
    }


    public void editProfile(EditProfileRequest editProfileRequest) {
        User user = userRepository.findById(editProfileRequest.getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id " + editProfileRequest.getId()));
        user.setBio(editProfileRequest.getBio());
        user.setFirstName(editProfileRequest.getFirstName());
        user.setLastName(editProfileRequest.getLastName());
        userRepository.save(user);
    }

    public void changeProfilePicture(String urlImage , String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id " + userId));
        user.setProfileImage(urlImage);
        userRepository.save(user);
    }

}
