from storages.backends.s3boto3 import S3Boto3Storage
from storages.utils import clean_name

from assessmentplatform.settings import MINIO_MEDIA_BUCKET_NAME, MINIO_STATIC_BUCKET_NAME, MINIO_URL , MINIO_QUERYSTRING_EXPIRE_MEDIA

class CustomStorage(S3Boto3Storage):
    custom_url = MINIO_URL
    def url(self, name, parameters=None, expire=None, http_method=None, bucket_name=None):
        # Preserve the trailing slash after normalizing the path.
        name = self._normalize_name(clean_name(name))
        params = parameters.copy() if parameters else {}
        if expire is None:
            expire = self.querystring_expire
        params['Bucket'] = self.bucket.name
        if bucket_name is not None:
            params['Bucket'] = bucket_name
        params['Key'] = name
        url = self.bucket.meta.client.generate_presigned_url('get_object', Params=params,
                                                             ExpiresIn=expire, HttpMethod=http_method)
        if self.custom_url:
            url = url.replace(self.endpoint_url,self.custom_url)
        if self.querystring_auth:
            return url
        return self._strip_signing_parameters(url)



class MediaStorage(CustomStorage):
    bucket_name = MINIO_MEDIA_BUCKET_NAME
    default_acl = "private"
    file_overwrite = False
    querystring_auth = True
    querystring_expire = MINIO_QUERYSTRING_EXPIRE_MEDIA

class StaticStorage(CustomStorage):
    bucket_name = MINIO_STATIC_BUCKET_NAME
    querystring_auth = False
    file_overwrite = True
