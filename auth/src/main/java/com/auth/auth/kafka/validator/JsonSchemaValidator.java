package com.auth.auth.kafka.validator;

import java.io.File;
//import java.io.InputStream;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import com.networknt.schema.ValidationMessage;

@Component
public class JsonSchemaValidator {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static void validate(String json, String schemaPath) throws Exception {
        
        File schemaFile = new File(schemaPath);
        if (!schemaFile.exists()) {
        throw new RuntimeException("❌ Schema file not found at: " + schemaFile.getAbsolutePath());
    }

        JsonSchema schema = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V7)
                .getSchema(schemaFile.toURI());

        JsonNode jsonNode = objectMapper.readTree(json);
        Set<ValidationMessage> errors = schema.validate(jsonNode);
        if (!errors.isEmpty()) {
            throw new RuntimeException("❌ JSON Schema validation failed:\n" + errors);
        }
    }

    
}
