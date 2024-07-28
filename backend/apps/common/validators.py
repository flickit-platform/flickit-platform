from django.core.exceptions import ValidationError


def validate_file_size(value):
    filesize = value.size
    if filesize > 5 * 1024 * 1024:
        raise ValidationError("File size must be no larger than 5 MB")
    return value


def validate_dsl_extension(value):
    import os
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.zip', '.rar']
    if not ext.lower() in valid_extensions:
        raise ValidationError(f"Unsupported file extension. Allowed extensions: {', '.join(valid_extensions)}")
    return value
