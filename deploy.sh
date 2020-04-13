# list buckets
echo "clearing cloudfront cache"
aws cloudfront create-invalidation --distribution-id EJ0PSIG2HCU64 --paths '/*'

echo "syncing bucket"
aws s3 ls

aws s3 sync ./build s3://covid-19-home-nations-in-the-world