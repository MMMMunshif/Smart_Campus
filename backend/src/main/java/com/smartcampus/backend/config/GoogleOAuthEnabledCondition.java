package com.smartcampus.backend.config;

import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

public class GoogleOAuthEnabledCondition implements Condition {

    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        String clientId = context.getEnvironment().getProperty("app.oauth.google.client-id", "");
        String clientSecret = context.getEnvironment().getProperty("app.oauth.google.client-secret", "");
        return !clientId.isBlank() && !clientSecret.isBlank();
    }
}
