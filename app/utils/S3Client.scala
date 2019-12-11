package utils

import java.io.File

import com.amazonaws.AmazonServiceException
import com.amazonaws.auth.{AWSStaticCredentialsProvider, BasicAWSCredentials}
import com.amazonaws.services.s3.model._
import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}

//BELA <3

object S3Client {

  private val bucketName = "stingy"
  private val credentials = new BasicAWSCredentials("AAAAA", "AAAA")

  def uploadFile(fileName: String, keyName: String): Option[String] = {
    val amazonClient: AmazonS3 = AmazonS3ClientBuilder.standard.withCredentials(new AWSStaticCredentialsProvider(credentials)).withRegion("sa-east-1").build
    try {
      val file: File = new File(fileName)
      val putObjectRequest: PutObjectRequest = new PutObjectRequest(bucketName, keyName, file)
      putObjectRequest.setCannedAcl(CannedAccessControlList.PublicRead)
      amazonClient.putObject(putObjectRequest)

      Some(amazonClient.getObject(new GetObjectRequest(bucketName, keyName)).getObjectContent.getHttpRequest.getURI.toString)
    } catch {
      case ase: AmazonServiceException =>
        print("Caught an AmazonServiceException, which means your request made it to Amazon S3, but was rejected with an error response for some reason.")
        print("Error Message:    " + ase.getMessage)
        print("HTTP Status Code: " + ase.getStatusCode)
        print("AWS Error Code:   " + ase.getErrorCode)
        print("Error Type:       " + ase.getErrorType)
        print("Request ID:       " + ase.getRequestId)
        None
      case _: Throwable => None
    }
  }

  def deleteFile(keyName: String): Option[Boolean] = {
    val amazonClient: AmazonS3 = AmazonS3ClientBuilder.standard.withCredentials(new AWSStaticCredentialsProvider(credentials)).withRegion("us-east-2").build
    try {
      val deleteObjectRequest: DeleteObjectRequest = new DeleteObjectRequest(bucketName, keyName)
      amazonClient.deleteObject(deleteObjectRequest)
      Some(true)
    } catch {
      case ase: AmazonServiceException =>
        print("Caught an AmazonServiceException, which means your request made it to Amazon S3, but was rejected with an error response for some reason.")
        print("Error Message:    " + ase.getMessage)
        print("HTTP Status Code: " + ase.getStatusCode)
        print("AWS Error Code:   " + ase.getErrorCode)
        print("Error Type:       " + ase.getErrorType)
        print("Request ID:       " + ase.getRequestId)
        None
      case _: Throwable => None
    }
  }

}
