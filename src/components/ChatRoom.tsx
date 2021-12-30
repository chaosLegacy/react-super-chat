import {
    collection, addDoc, query, orderBy, limitToLast, Timestamp
} from "firebase/firestore";
import { useEffect, useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, db } from "../util/firebase";
import ChatMessage from './ChatMessage';

export type Post = {
    id?: string;
    text: string;
    uid: string | null;
    photoURL?: string | null;
    createdAt?: any;
}
const ChatRoom = () => {
    const dummy = useRef<HTMLSpanElement>(null);
    const messagesRef = collection(db, `${process.env.REACT_APP_FIREBASE_DOC_REF}/messages`);
    const q = query(messagesRef, orderBy('createdAt'), limitToLast(25));
    const [data, setData] = useState<Post[]>([]);
    const [messages] = useCollectionData(q, { idField: 'id' });
    const [formValue, setFormValue] = useState('');

    useEffect(() => {
        if (!messages) return;
        setData(messages as unknown as Post[]);
    }, [messages]);


    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!auth.currentUser) return;

        const { uid, photoURL } = auth.currentUser;

        await addDoc(messagesRef, {
            text: formValue,
            createdAt: Timestamp.now(),
            uid,
            photoURL
        });
        setFormValue('');
        if (dummy.current !== null) {
            dummy.current.scrollIntoView({ behavior: 'smooth' });
        }
        // const changeInnerTextExample = (el: HTMLElement, value: string) => {
        //     el.innerText = value;
        // }
    }

    return (
        <>
            <main>
                {data && data.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                <span ref={dummy}></span>
            </main>

            <form onSubmit={sendMessage}>

                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

                <button type="submit" disabled={!formValue}>🕊️</button>

            </form>
        </>
    )
}

export default ChatRoom
