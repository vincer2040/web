import { Auth, EmailPassword, SignInTypes } from "./auth";

(async () => {
    let signinBtn = document.getElementById("signin") as HTMLButtonElement;
    let emailInput = document.getElementById("email") as HTMLInputElement;
    let passwordInput = document.getElementById("password") as HTMLInputElement;
    async function signInWithEmail(e: Event) {
        e.preventDefault();
        let email = emailInput.value;
        let pw = passwordInput.value;
        let emailSignIn = new EmailPassword(email, pw);
        let a = new Auth<EmailPassword>(SignInTypes.EmailPassword, emailSignIn);
        let is = await a.auth();
        console.log(is);
    }
    signinBtn.addEventListener("click", signInWithEmail);
})();
