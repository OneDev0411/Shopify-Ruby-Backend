# Stackpath object to upload files for the CDN
STACKPATH_S3 = Aws::S3::Resource.new(
        access_key_id: ENV['STACKPATH_ACCESS_KEY'],
        secret_access_key: ENV['STACKPATH_SECRET_KEY'],
        endpoint: "https://s3.us-east-2.stackpathstorage.com",
        region: 'us-east-2'
      )
