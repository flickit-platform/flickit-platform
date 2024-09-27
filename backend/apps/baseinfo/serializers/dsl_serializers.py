from rest_framework import serializers


class ExcelFileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        # Check that the file has a .xlsx extension
        if not value.name.endswith('.xlsx'):
            raise serializers.ValidationError("Only Excel files with .xlsx extension are supported.")

        # Check that the file size does not exceed 5MB
        max_size_mb = 5
        if value.size > max_size_mb * 1024 * 1024:
            raise serializers.ValidationError(f"File size should not exceed {max_size_mb} MB.")

        return value
