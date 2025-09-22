package com.payment.payment.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import java.security.Key;

import org.springframework.beans.factory.annotation.Value;

// import java.util.Date;

// import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtils {

    //@Value("${jwt.secret}")
    //private String jwtSecret="NewSecretKeyForJWTSigningPurposes12345678";
    //private String jwtSecret="TmV3U2VjcmV0S2V5Rm9ySldUU2lnbmluZ1B1cnBvc2VzMTIzNDU2Nzg=";
    @Value("${jwt.secret}")
    private String jwtSecret;

    //  @Value("${jwt.expiration}") // e.g., 86400000 ms = 1 day
    // private long jwtExpiration;

    // public String generateToken(String email, String role, String id) {
    //     return Jwts.builder()
    //             .setSubject(email)
    //             .claim("email", email)
    //             .claim("role", role)
    //             .claim("id", id)
    //             .setIssuedAt(new Date())
    //             .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
    //             .signWith(SignatureAlgorithm.HS512, jwtSecret.getBytes())
    //             .compact();
    // }


    public Claims parseToken(String token) {
        //Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
        Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));



        return Jwts.parserBuilder()
                // .setSigningKey("NewSecretKeyForJWTSigningPurposes12345678")
                .setSigningKey(key)
                
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}