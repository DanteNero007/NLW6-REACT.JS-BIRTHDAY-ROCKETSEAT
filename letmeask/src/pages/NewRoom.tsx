import {FormEvent, useState} from 'react'
import {Link, useHistory} from 'react-router-dom';
import ilustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
//import googleIcon from '../assets/images/google-icon.svg';

import {Button} from '../components/Button';

import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { useTheme } from '../hooks/useTheme';

export function NewRoom() {


    const {user} = useAuth();
    const [newRoom, setNewRoom] = useState('');
    const history = useHistory();
    const{theme, toggleTheme} = useTheme();



    async function handleCreateRoom(event: FormEvent){
        //nao redireciona a pagina
        event.preventDefault();
        
        if(newRoom.trim() === ''){
            return;
        }
        const roomRef = database.ref('rooms');
        
        const firebaseRoom = await roomRef.push({

            title: newRoom,
            authorId: user?.id,
        });
        history.push(`/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id='page-auth' className={theme}>
            <aside>
            <button className='themeButton' onClick ={toggleTheme} > {theme}</button>
          
                <img src={ilustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            
            <main >   
                <div className='main-content'>
                    
                    <img src={logoImg} alt="Letmeask" />
                    <h1> {user?.name} </h1>
                        <h2>Criar uma nova sala</h2> 
                     <div className='separator'>ou entre em uma sala</div>
                    <form onSubmit ={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder='Nome da sala'
                            onChange ={event => setNewRoom(event.target.value)}
                            value ={newRoom}
                        />
                        <Button type="submit">
                           Criar Sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala existente <Link to="/">Clique aqui</Link> </p>
                </div>
            </main>

        </div>
    );

}