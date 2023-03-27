import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'


const XAWS = AWSXRay.captureAWS(AWS)
const s3BucketName = process.env.ATTCHMENTS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION


// TODO: Implement the fileStogare logic


export class AttachmentUtils{
    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4'}),
        private readonly bucketName = s3BucketName
    ){}

    getAttachmentUrl(todoId: string){
        return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
    }

    async getPreSignedUrl(todoId: string): Promise<string> {
       
        const signedUrl = await this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: urlExpiration

        })
    
    return signedUrl 
    }
}