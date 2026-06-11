from rest_framework import serializers


def validate_cpf(value: str) -> str:
    digits = "".join(char for char in value if char.isdigit())

    if len(digits) != 11:
        raise serializers.ValidationError("CPF deve conter 11 digitos.")

    if len(set(digits)) == 1:
        raise serializers.ValidationError("CPF invalido.")

    for verifier_position in (9, 10):
        weight_start = verifier_position + 1
        total = sum(
            int(digit) * weight
            for digit, weight in zip(digits[:verifier_position], range(weight_start, 1, -1))
        )
        expected = (total * 10) % 11
        if expected == 10:
            expected = 0

        if expected != int(digits[verifier_position]):
            raise serializers.ValidationError("CPF invalido.")

    return value
