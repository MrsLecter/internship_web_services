
import * as S3 from 'aws-sdk/clients/s3';
import { Observable, of } from 'rxjs';

class FileUpload {
  name: string;
  url: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }
  result: any[];
}

export class S3Controller {
    FOLDER = 'icons'; // For example, 'my_folder'.
    BUCKET = 'image-s3bucket-storage'; // For example, 'my_bucket'.

  private static getS3Bucket(): any {
    return new S3(
      {
        accessKeyId: 'AKIAVALYXPL422HP2Q63', 
        secretAccessKey: 'DGwe007wBEd+5bMlMqRvY+ETBA9yjYNWOX61kjeL',
        region: 'us-east-1'
      }
    );
  }

  public uploadFile(file) {
    const bucket = new S3(
      {
        accessKeyId: '/* access key here */',
        secretAccessKey: '/* secret key here */',
        region: '/* region here */'
      }
    );

    const params = {
      Bucket: this.BUCKET,
      Key: this.FOLDER + file.name,
      Body: file,
      ACL: 'public-read'
    };

    bucket.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    });
  }

  public getFiles(): Observable<Array<FileUpload>> {
    const fileUploads = [];

    const params = {
      Bucket: this.BUCKET,
      Prefix: this.FOLDER
    };

    S3Controller.getS3Bucket().listObjects(params, function (err, data) {
      if (err) {
        console.log('There was an error getting your files: ' + err);
        return;
      }
      console.log('Successfully get files.', data);

      const fileDetails = data.Contents;
      fileDetails.forEach((file) => {
        fileUploads.push(new FileUpload(
          file.Key,
          'https://' +params.Bucket + '.s3.amazonaws.com/' + params.Prefix + '/' + file.Key
        ));
        //https://image-s3bucket-storage.s3.amazonaws.com/icons/batman.ico
      });
    });

    return of(fileUploads);
    // return of(params.Bucket ,params.Prefix);
  }

  public deleteFile(file: FileUpload) {
    const params = {
      Bucket: this.BUCKET,
      Key: file.name
    };

    S3Controller.getS3Bucket().deleteObject(params,  (err) => {
      if (err) {
        console.log('There was an error deleting your file: ', err.message);
        return;
      }
      console.log('Successfully deleted file.');
    });
  }
}