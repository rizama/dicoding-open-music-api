const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const config = require('../../utils/config');

class StorageService {
    constructor() {
        this._S3 = new S3Client({
            region: config.s3.region,
            credentials: {
                accessKeyId: config.s3.accessKeyId,
                secretAccessKey: config.s3.secretAccessKey,
            },
        });
    }

    async writeFile(file, meta) {
        const parameter = new PutObjectCommand({
            Bucket: config.s3.bucketName,
            Key: meta.filename,
            Body: file._data,
            ContentType: meta.headers['content-type'],
        });

        await this._S3.send(parameter);

        return this.createPreSignedUrl({
            bucket: config.s3.bucketName,
            key: meta.filename,
        });
    }

    createPreSignedUrl({ bucket, key }) {
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        return getSignedUrl(this._S3, command, { expiresIn: 3600 });
    }
}

module.exports = StorageService;
