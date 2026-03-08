package com.backend.exception;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("message", "Email already exists");
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(OwnerNotFoundExecption.class)
    public ResponseEntity<Map<String, String>> handleOwnerNotFoundException(OwnerNotFoundExecption ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("message", "Owner not found");
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(PatientNotFoundException.class)
    public ResponseEntity<Map<String, String>> handlePatientNotFoundException(PatientNotFoundException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("message", "Patient not found");
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(AppointmentNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleAppointmentNotFoundException(AppointmentNotFoundException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("message", "Appointment not found");
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(BillingNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleBillingNotFoundException(BillingNotFoundException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("message", "Billing not found");
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(RecordNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleRecordNotFoundException(RecordNotFoundException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("message", "Record not found");
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(PhoneAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handlePhoneAlreadyExistsException(PhoneAlreadyExistsException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("message", "Phone already exists");
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleEnumNotAvailableInJson(HttpMessageNotReadableException ex) {
        Map<String, String> error = new HashMap<>();

        if (ex.getCause() instanceof InvalidFormatException) {
            InvalidFormatException ife = (InvalidFormatException) ex.getCause();

            if (ife.getTargetType() != null && ife.getTargetType().isEnum()) {
                String fieldName = ife.getPath().get(0).getFieldName();
                String invalidValue = ife.getValue().toString();

                // Get list of valid enum constants as a string
                String acceptedValues = Arrays.stream(ife.getTargetType().getEnumConstants())
                        .map(Object::toString)
                        .collect(Collectors.joining(", "));

                error.put(fieldName, String.format("The value '%s' is not available. Please use one of: [%s]",
                        invalidValue, acceptedValues));

                return ResponseEntity.badRequest().body(error);
            }
        }

        error.put("error", "Malformed JSON request or invalid data format");
        return ResponseEntity.badRequest().body(error);
    }

}
