import Head from "next/head";
import { Inter } from "next/font/google";
import landingstyles from "@/styles/landingPage.module.css";
import Image from "next/image";
import { Button } from "react-bootstrap";
// import BatchPredictionIcon from '@mui/icons-material/BatchPrediction'
import { RedirectToSignIn, SignIn, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ["latin"] });

// the landing page '/'
export default function Home() {
  const iconstyle = {
    margin: "5px",
    fontSize: ".5rem",
    // color: 'rgb(70, 40, 131)',
  };

  return (
    <>
      <Head>
        <title>Note Capsule</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css?family=Saira Stencil One"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.googleapis.com/css?family=Inter"
          rel="stylesheet"
        ></link>
      </Head>
      <main>
        <SignedIn>
          <RedirectToSignIn redirectUrl="/dashboard"></RedirectToSignIn>
        </SignedIn>
        <SignedOut>
          <div>
            <div className={landingstyles.logo}>
              {/* <BatchPredictionIcon xs={iconstyle} /> */}
              Note Capsule
            </div>

            <Image
              src="/landing.png"
              alt="background"
              width={375}
              height={246}
              className={landingstyles.image}
            />

            <div className={landingstyles.welcome}>
              <strong>Welcome to Note Capsule!</strong>
            </div>

            <Button href="/signin">Sign In</Button>
            <Button href="/signup">Sign Up</Button>
          </div>
        </SignedOut>
      </main>
    </>
  );
}
