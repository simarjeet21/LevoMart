package com.payment.payment.aspect;

import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;

import org.aspectj.lang.annotation.Pointcut;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

@Aspect
@Component
public class LoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();// thread safety

    @Value("${logging.aop.verbose:false}")
    private boolean verbose;// Controlled via application.properties or yml

    /**
     * Pointcut to log all controller methods in the com.auth.auth.controller package
     */
    @Pointcut("execution(* com.payment.payment.controller.*.*(..)) || execution(* com.payment.payment.service.*.*(..))")

    public void controllerMethods(){}

    @Around("controllerMethods()")
    public Object logControllerMethods(ProceedingJoinPoint joinPoint)throws Throwable{

        String methodName = joinPoint.getSignature().toShortString();
        Object[]args=joinPoint.getArgs();

        String argsJson=null;

        if(verbose && !isSensitiveMethod(methodName)){
            try{
                argsJson=objectMapper.writeValueAsString(args);
            }catch(Exception e){
                argsJson=Arrays.toString(args);
            }
            logger.debug("➡️ Entering: {} with args: {}", methodName, argsJson);
        } else if (verbose) {
            logger.debug("➡️ Entering: {} with args: [REDACTED]", methodName);
        }
        long startTime = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;

            if (verbose) {
                try {
                    String resultJson = objectMapper.writeValueAsString(result);
                    logger.debug("✅ Exiting: {} with result: {} in {} ms", methodName, resultJson, duration);
                } catch (Exception e) {
                    logger.debug("✅ Exiting: {} with non-serializable result in {} ms", methodName, duration);
                }
            } else {
                logger.info("✅ {} completed in {} ms", methodName, duration);
            }

            return result;
        } catch (Throwable e) {
            logger.error("❌ Exception in {}: {}", methodName, e.getMessage(), e);
            throw e;
        }
    }
    /**
     * Utility method to detect sensitive methods (e.g., login, token)
     */
    private boolean isSensitiveMethod(String methodName) {
        String lower = methodName.toLowerCase();
        return lower.contains("login") || lower.contains("token") || lower.contains("password");
    }



    
}
