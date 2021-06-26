import {useHistory} from 'react-router-dom';
//import {auth, firebase} from '../services/firebase';
import ilustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg';

import {Button} from '../components/Button';

import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent} from 'react';
import { useState } from 'react';
import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';

export function Home() {
    const{theme, toggleTheme} = useTheme();
    const {user, signInWithGoogle}= useAuth();
    const history =  useHistory();
    const [roomCode, setRoomCode] =  useState('');

    async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle();
        }
             history.push('/rooms/new');
        }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();

        if(roomCode.trim() === ''){
            return;
        }
        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if(!roomRef.exists()){
            alert('Room does not exists');
            return;
        }
        if(roomRef.val().endedAt){
            alert('Room alreadey closed');
            return;
        }
        history.push(`/rooms/${roomCode}`);
    }

    return (
        <div id='page-auth' className = {theme}>
            <aside>
            <button className='themeButton' onClick ={toggleTheme} > {theme}</button>
                <img src={ilustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="Letmeask" />
                    <h1> {user?.name}</h1>
                    <button onClick = {handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do google" />
                        Crie sua sala com o Google
                    </button>
                    <div className='separator'>ou entre em uma sala</div>
                    <form onSubmit ={handleJoinRoom} >
                        <input
                            type="text"
                            placeholder='Digite  o código da sala'
                            onChange ={event => setRoomCode(event.target.value) }
                            value = {roomCode}
                        
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>

        </div>
    );

}