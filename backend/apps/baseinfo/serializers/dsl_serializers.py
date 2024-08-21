from rest_framework import serializers


class ExcelFileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        if not value.name.endswith('.xlsx'):
            raise serializers.ValidationError("فقط فایل‌های اکسل با فرمت .xlsx پشتیبانی می‌شوند.")

        return value
