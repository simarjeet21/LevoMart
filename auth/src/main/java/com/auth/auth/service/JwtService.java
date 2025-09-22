package com.auth.auth.service;

import java.security.Key;
//import java.security.NoSuchAlgorithmException;
//import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

// import javax.crypto.KeyGenerator;
// import javax.crypto.SecretKey;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

// import com.auth.auth.model.User;
import com.auth.auth.model.UserPrincipal;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

//service used to generate JWT token and validate it
@Service
public class JwtService {

    //private static final String SECRET = "TmV3U2VjcmV0S2V5Rm9ySldUU2lnbmluZ1B1cnBvc2VzMTIzNDU2Nzg=\r\n";
    //private static final Logger logger = LoggerFactory.getLogger(JwtService.class);
    @Value("${jwt.secret}")
    private String secretKey;

    public JwtService() {
        //secretKey = generateSecretKey();
    }

    // public String generateSecretKey() {
    //     try {
    //         KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
    //         SecretKey secretKey = keyGen.generateKey();
    //         System.out.println("Secret Key : " + secretKey.toString());
    //         return Base64.getEncoder().encodeToString(secretKey.getEncoded());
    //     } catch (NoSuchAlgorithmException e) {
    //         throw new RuntimeException("Error generating secret key", e);
    //     }
    // }

    public String generateToken( UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        if (userDetails instanceof UserPrincipal principal) {
        claims.put("role", principal.getUser().getRole().name());
        claims.put("id", principal.getUser().getUserId());
        claims.put("email", principal.getUser().getEmail());
    }
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000*60*30))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
                
                
    }
    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUserName(String token) {
        // extract the username from jwt token
        return extractClaim(token, Claims::getSubject);
    }
    
    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build().parseClaimsJws(token).getBody();
    }


    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

}
