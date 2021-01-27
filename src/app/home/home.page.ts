import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { PhotoService } from "../services/photo.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  /********************************************************************************************/
  /************************************ Les Attributs  ****************************************/
  /********************************************************************************************/

  //pour image check et fileImage
  checkAndFile: {
    imgIsLoading: boolean; //image is loading or not
    imageFile: File; //image upload
    pathImg: string; //image dewonload
    isGetImgName: boolean; //objet has image or not
    imgLabel: string; //title of image
  } = {
    imageFile: null,
    pathImg: "",
    imgIsLoading: false,
    isGetImgName: false,
    imgLabel: "Photo",
  };

  /********************************************************************************************/
  /*******************************Les fonctions d'intialisations ******************************/
  /********************************************************************************************/

  constructor(
    public photoService: PhotoService //service de photo
  ) {}

  ngOnInit() {
    this.getImage(); //"_IMAGE.jpg"
  }



  //-------- Get Image of Rest Api ---------
  getImage(ImgName?: string) {

    this.checkAndFile.pathImg=null;

    if (ImgName) {
      this.checkAndFile.isGetImgName = ImgName ? true : false;

      if (this.checkAndFile?.isGetImgName) {

        this.checkAndFile.pathImg = `${environment.url}/api/getImage/${ImgName}`;

        this.checkAndFile.imgIsLoading = false; //image encore Loading
      }
    }
  }

  /********************************************************************************************/
  /************************************* Les fonctions ****************************************/
  /********************************************************************************************/

  //----------- Take Image --------------
  onImagePicked(imageData: string | File) {
    //converter dataImage(base64) à bolob(string)
    let imageFile = this.photoService.convertImageToFile(imageData);

    this.checkAndFile.imageFile = imageFile;

    //pour post et return name image
    this.upLoadImage(this.checkAndFile.imageFile, "IMAGE");
  }

  /********************************************************************************************/
  /************************************ sous-fonctions ****************************************/
  /********************************************************************************************/

  //---------- Post Image ------------
  upLoadImage(imageFile: File, namImg: string) {
    if (!imageFile) {
      return;
    }
    this.checkAndFile.imgIsLoading = true; //image encore Loading

    //service uploadImage
    this.photoService.upLoadImage(imageFile,Date.now()+"._" + namImg + ".jpg").subscribe(
      (getImageName: string) => {

        console.log("getImgName ", getImageName);
        
        //name image get by BackEnd
        if (getImageName.length != 0) {
          this.getImage(getImageName);
        }

      },
      (err) => console.log(err)
    );
  }


}
