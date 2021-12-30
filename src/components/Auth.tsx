import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../util/firebase";

export const SignIn = () => {
    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();

            signInWithPopup(auth, provider);
        } catch (error) {
            console.log('error: ', error);
        }
    }

    return (
        <div>
            <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
            <p>Do not violate the community guidelines or you will be banned for life!</p>
        </div>
    )
}

export const SignOut = () => {
    return auth.currentUser && (
        <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    )
}
