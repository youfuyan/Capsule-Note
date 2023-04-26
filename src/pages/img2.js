import React from 'react';
import { IKImage, IKContext, IKUpload } from 'imagekitio-react'
import { uploadImg } from "@/modules/Data.js";

function ImgUpload() {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  const authenticationEndpoint = process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/auth";

  return (
    <div className="ImgUpload">
      <p>To use this funtionality please remember to setup the server</p>
      <p>Tip: set env on codehooks using CLI </p>
      <p>https://codehooks.io/docs/application-secrets#adding-secret-environment-variables</p>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
        <IKUpload fileName="abc.jpg" tags={["tag1"]} useUniqueFileName={true} isPrivateFile= {false} />
      </IKContext>   
    </div>
  );
}

export default ImgUpload;