package ro.medCare.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import ro.medCare.service.JwtTokenService;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtTokenService jwtTokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        logger.debug("Processing request: {} {}", request.getMethod(), request.getRequestURI());

        String username = null;
        String jwt = null;

        if (request.getMethod().equals("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtTokenService.extractUsername(jwt);
                logger.debug("Extracted username: {}", username);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                    String role = jwtTokenService.extractAllClaims(jwt).get("role").toString();
                    logger.debug("User role: {}", role);

                    UserDetails userDetails = new User(
                            username,
                            "",
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                    );

                    if (jwtTokenService.validateToken(jwt, username)) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        logger.debug("Authentication successful for user: {}", username);
                    }
                }
            } catch (ExpiredJwtException e) {
                logger.error("JWT Token has expired: {}", e.getMessage());
            } catch (UnsupportedJwtException | MalformedJwtException | IllegalArgumentException e) {
                logger.error("JWT Token error: {}", e.getMessage());
            }
        } else {
            logger.debug("No JWT token found in request headers");
        }

        filterChain.doFilter(request, response);
    }
}