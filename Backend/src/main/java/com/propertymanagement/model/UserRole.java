package com.propertymanagement.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserRole {
    ADMIN,
    LANDLORD,
    TENANT;

    @JsonCreator
    public static UserRole fromString(String value) {
        if (value == null) {
            return null;
        }
        return UserRole.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}