from rest_framework import serializers


def validate_cpf(value: str) -> str:
    digits = "".join(char for char in value if char.isdigit())

    if len(digits) != 11:
        raise serializers.ValidationError("CPF deve conter 11 dígitos.")

    if len(set(digits)) == 1:
        raise serializers.ValidationError("CPF inválido.")

    return value
