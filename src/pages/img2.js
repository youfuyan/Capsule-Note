import React from 'react';
import { IKImage, IKContext, IKUpload } from 'imagekitio-react'

function ImgUpload() {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  let urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  const authenticationEndpoint = "http://localhost:3001/auth";

  return (
    <div className="ImgUpload">
      <p>To use this funtionality please remember to setup the server</p>
      <IKContext publicKey={publicKey} urlEndpoint={urlEndpoint} authenticationEndpoint={authenticationEndpoint} >
        <IKUpload fileName="abc.jpg" tags={["tag1"]} useUniqueFileName={true} isPrivateFile= {false} />
      </IKContext>   
    </div>
  );
}

export default ImgUpload;