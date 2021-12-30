import { auth } from '../util/firebase';
import { Post } from './ChatRoom';

const ChatMessage = (prop: { message: Post }) => {
    const { text, uid, photoURL } = prop.message;

    const messageClass = uid === auth.currentUser?.uid ? 'sent' : 'received';

    return (<>
        <div className={`message ${messageClass}`}>
            <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt='' />
            <p>{text}</p>
        </div>
    </>)
}

export default ChatMessage
