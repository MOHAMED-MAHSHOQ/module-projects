package com.university.authserver.custom;

import com.university.authserver.entity.AppUser;
import com.university.authserver.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    AppUser appUser =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found " + username));

    List<GrantedAuthority> authorities =
        List.of(new SimpleGrantedAuthority("ROLE_" + appUser.getRole().name()));
    return new CustomUserDetails(
        appUser.getUsername(), appUser.getPassword(), authorities, appUser.getEmail());
  }
}
