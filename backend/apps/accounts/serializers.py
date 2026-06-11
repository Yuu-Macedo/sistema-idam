from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=8)

    class Meta:
        model = User
        fields = [
            "id",
            "nome",
            "email",
            "username",
            "cargo",
            "telefone",
            "tipo_usuario",
            "ativo",
            "password",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        is_admin = bool(
            user
            and user.is_authenticated
            and (user.is_superuser or user.tipo_usuario == "administrador")
        )

        if self.instance and not is_admin:
            if (
                "tipo_usuario" in attrs
                and attrs["tipo_usuario"] != self.instance.tipo_usuario
            ):
                raise serializers.ValidationError(
                    {"tipo_usuario": "Apenas administradores podem alterar permissoes."}
                )
            if "ativo" in attrs and attrs["ativo"] != self.instance.ativo:
                raise serializers.ValidationError(
                    {"ativo": "Apenas administradores podem alterar o status do usuario."}
                )

        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        user.is_active = user.ativo
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        if "ativo" in validated_data:
            instance.is_active = validated_data["ativo"]
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class LoginSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.ativo:
            raise serializers.ValidationError("Usuário inativo.")
        data["user"] = UserSerializer(self.user).data
        return data


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
