export async function addSignUp(email_address, password){
    console.log("hi");
    const CLERK_URL = process.env.NEXT_PUBLIC_CLERK_API_URL;
    const response = await fetch(CLERK_URL+"sign_ups", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "email_address": email_address,
            "password": password,
            "first_name": email_address,
            "last_name": email_address
        })
    }).then((result) => {
        console.log(result.status);
        return result.status;
    })
}

export async function addSignIn(email_address, password){
    console.log("hello");
    const CLERK_URL = process.env.NEXT_PUBLIC_CLERK_API_URL;
    const response = await fetch(CLERK_URL+"sign_ins", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "identifier": email_address,
            "strategy": "password",
            "password": password,
            "redirect_url": "/notes",
        })
    }).then((result) => {
        console.log(result.status);
        return result.status;
    })
}