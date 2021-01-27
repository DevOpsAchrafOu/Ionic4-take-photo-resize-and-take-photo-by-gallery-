import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  Plugins,
  CameraResultType,
  Capacitor,
  FilesystemDirectory,
  CameraPhoto,
  CameraSource,
} from "@capacitor/core";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-photo",
  templateUrl: "./photo.page.html",
  styleUrls: ["./photo.page.scss"],
})
export class PhotoPage implements OnInit {
  /*--------------------Angular v11 and Ionic v4--------------------*/
  /* 
  1_Installation (before import):
    npm install
  2_Installation (for capacitor): 
    npm install @capacitor/core @capacitor/cli
    npm install @ionic/pwa-elements//for working caméra in browser
  3_add in index.xml :
   <!--  pwa-element -->
  <script type="module" src="https://unpkg.com/@ionic/pwa-elements@latest/dist/ionicpwaelements/ionicpwaelements.esm.js"></script>
  <script nomodule src="https://unpkg.com/@ionic/pwa-elements@latest/dist/ionicpwaelements/ionicpwaelements.js"></script>

  4_build by capacitor:
    ionic build
    ionic capacitor add  android
    ionic capacitor copy  android
    cd .\android\
    .\gradlew assembleDebug
  */

  /********************************************************************************************/
  /************************************ Les Attributs  ****************************************/
  /********************************************************************************************/

  @ViewChild("takeFile") takeFileRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>(); //fils => pére
  @Input() usetakeFile = false; //true; si prendre image à gallery ou non
  @Input() emptyNextTakeImage = false; //
  @Input() imgIsLoading = false; // pére => fils
  @Input() pathImg = ""; // pére => fils
  @Input() imgLabel = ""; // pére => fils

  /********************************************************************************************/
  /*******************************Les fonctions d'intialisations ******************************/
  /********************************************************************************************/

  constructor(
    private platform: Platform //pour visialiser platforme qui ouvrer à ce moment
  ) {}

  ngOnInit() {
    if (this.platform.is("desktop")) {
      //si utiliser  desctop et PWA pas décloncher
      this.usetakeFile = true;
    }
  }


  /********************************************************************************************/
  /************************************* Les fonctions ****************************************/
  /********************************************************************************************/
//------------ Take Image -------------
  onPickImage() {
    console.log("==> onPickImage");
    
    //if plugin is not camera (take photo By gallery)
    if (!Capacitor.isPluginAvailable("Camera")) {
      this.takeFileRef.nativeElement.click();
      return;
    }

    Plugins.Camera.getPhoto({
      source: CameraSource.Camera, //pour permet de take image ou choiser (Camera/Photos/Prompt)
      correctOrientation: true,
      saveToGallery: true, //save in  gallery
      quality: 85,
      height: 960,
      width: 1280,
      preserveAspectRatio: true, //la height et la width seront utilisées comme valeurs maximales et le rapport height/width sera conservé
      resultType: CameraResultType.Base64,
    })
      .then((image) => {
        this.imagePick.emit(image.base64String); //
      })
      .catch((error) => {
        console.log(error);
        if (this.usetakeFile) {
          //si close caméra n'est pas décloncher est passer de prendre FileImage
          this.takeFileRef.nativeElement.click();
        }
        return false;
      });
  }

  onFileChosen(event: Event) {
    console.log("==> onFileChosen");

    //pour dire que cette event est un input html
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader(); //lire file

    fr.onload = () => {
      const dataUrl = fr.result.toString(); //converter to string
      //this.pathImg = dataUrl; //stoker donné Url
      this.imagePick.emit(this.pathImg); //envoyer fileImage
    };
    fr.readAsDataURL(pickedFile);
  }
}
