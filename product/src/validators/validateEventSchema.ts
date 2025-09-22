import Ajv from "ajv";
import addFormats from "ajv-formats"; //  Add this

const ajv = new Ajv({ allErrors: true });
addFormats(ajv); //  Register the formats

export const validateWithSchema = (schema: object, payload: any) => {
  try {
    const validate = ajv.compile(schema);
    const valid = validate(payload);

    if (!valid) {
      console.error(" AJV validation errors:", validate.errors);
      throw new Error(
        "Event payload validation failed: " + JSON.stringify(validate.errors)
      );
    }
  } catch (err) {
    console.error(" Schema compile/validation error:", err);
    throw err;
  }
};
