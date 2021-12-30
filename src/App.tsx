import './App.css';
import ChatRoom from './components/ChatRoom';
import Header from './components/Header';
import { SignIn } from './components/Auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './util/firebase';

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <Header />
      <section>
        {
          user ? <ChatRoom /> : <SignIn />
        }
      </section>
    </div>
  );
}

export default App;
