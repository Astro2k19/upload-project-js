
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { uploadFiles } from "./upload";

const firebaseConfig = {
   apiKey: "AIzaSyCHdFuEwEOJKxXnXi3G0kq_2_rm-SXptb4",
   authDomain: "upload-project-43f52.firebaseapp.com",
   projectId: "upload-project-43f52",
   storageBucket: "upload-project-43f52.appspot.com",
   messagingSenderId: "188137635850",
   appId: "1:188137635850:web:e84c6a21640df50bef5ff3"
 };
 
 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const storage = getStorage();

uploadFiles('#file',{
    multy:true,
     accept:['.png', '.jpg', '.jpeg', '.gif'],
     onUpload(files, blocks){
        files.forEach((file, index) => {
         const fileRef = ref(storage, `images/${file.name}`);
        const uploadTask =  uploadBytesResumable(fileRef, file)

        uploadTask.on('state_changed', 
  (snapshot) => {
 
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    blocks[index].querySelector('.uploading-progress').textContent = progress + '%'
    blocks[index].querySelector('.uploading-progress').style.width = progress + '%'
  }, 
  (error) => {
    console.log(error)
  }, 
  () => {
    console.log('succesfully complete')
  }
);
        });
     }
})