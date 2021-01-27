import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

/********************************************************************************************/
  /************************************ Les Attributs  ****************************************/
  /********************************************************************************************/
  Url: string = `${environment.url}/api`;
  //responseType dans Back end est converter tous en json sauf String(text)
  options = { responseType: "text" as "json" };

  /********************************************************************************************/
  /*******************************Les Fonctions d'Intialisations ******************************/
  /********************************************************************************************/

  constructor(private http: HttpClient) {}

  /********************************************************************************************/
  /*********************************** Les Fonctions HTTP *************************************/
  /********************************************************************************************/

  //---------- post http image -----------
  upLoadImage(
    image: File,
    fileName: string
  ): Observable<string> {

    //pour form de données en text/pdf/file ....
    const uploadData = new FormData();
          uploadData.append("image", image, fileName); //uploadimage

    return this.http.post<string>(this.Url+"/postImage" ,uploadData,this.options);

  }

  /********************************************************************************************/
  /************************************* Sous-Fonctions ***************************************/
  /********************************************************************************************/

  base64toBlob(base64Data, contentType) {
    console.log("base64toBlob");
    contentType = contentType || "";
    const sliceSize = 1024;
    const byteCharacters = window.atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  //converter image en file(base64) (car file peut étre url ou byte)
  convertImageToFile(imageData: string | File) {
    let imageFile;

    //verifier type image si string
    if (typeof imageData === "string") {
      try {
        //pour affichage
        imageFile = this.base64toBlob(
          //remplacer par vide car est générer par caméra par défault
          imageData.replace("data:image/jpeg;base64,", ""),
          "image/jpeg"
        );
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }

    return imageFile;
  }
  

}
