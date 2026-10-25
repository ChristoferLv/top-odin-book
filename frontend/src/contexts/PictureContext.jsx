import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchUserPicture } from "../../api/requests";
import { AuthContext } from "./AuthContext";

export const PictureContext = createContext({
    setUserPicture: () => { },
    userPictureUrl: "",
    setIsPictureSet: () => { },
    isPictureSet: false
});


function PictureContextProvider({ children }) {
    const { user } = useContext(AuthContext);
    const [userPictureUrl, setUserPicture] = useState("");
    const [isPictureSet, setIsPictureSet] = useState(false);

    const pictureSetter = useCallback((value) => {
        if (value == "") {
            setIsPictureSet(false);
        }else{
            setIsPictureSet(true);
        }
        setUserPicture(value);
    }, []);

    useEffect(() => {
        if (isPictureSet) return;
        async function getPicture() {
            if (user) {
                const picture = await fetchUserPicture(user.id);
                if (picture.success && picture.data.buffer) {
                    const rawBuffer = new Uint8Array(picture.data.buffer?.data);
                    const blob = new Blob([rawBuffer], { type: picture.data.mime });
                    const imageUrl = URL.createObjectURL(blob);
                    setUserPicture(imageUrl);
                    setIsPictureSet(true);
                } else {
                    setIsPictureSet(true);
                }
            }
        }
        getPicture();
    }, [user])



    return (
        <PictureContext value={{ userPictureUrl, pictureSetter, isPictureSet }} >
            {children}
        </PictureContext>
    );
}

export default PictureContextProvider;